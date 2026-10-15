import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchOuraData, validateDateRange } from '../src/data/client.ts';
import { summarizeSeries, comparePeriods } from '../src/data/series.ts';
const options = { accessToken: 'test-only', startDate: '2026-10-01', endDate: '2026-10-15', useSandbox: false };
const response = (data, next_token = null) => Response.json({ data, next_token });

test('one denied collection preserves successful collections and an explicit error', async () => {
  const result = await fetchOuraData({ ...options, collections: ['activity', 'sleep', 'readiness'], fetchImpl: async url => String(url).includes('daily_readiness') ? new Response('{}', { status: 403 }) : response([{ id: 'fixture' }]) });
  assert.equal(result.data.activity.length, 1); assert.equal(result.data.sleep.length, 1);
  assert.deepEqual(result.data.readiness, []); assert.match(result.errors.readiness, /403/);
  assert.deepEqual(Object.keys(result.errors), ['readiness']);
});
test('pagination retains every page and sends the same query and auth on later pages', async () => {
  const seen = [];
  const result = await fetchOuraData({ ...options, collections: ['activity'], fetchImpl: async (input, init) => {
    const url = new URL(input); seen.push(url);
    assert.equal(init.headers.Authorization, 'Bearer test-only');
    assert.equal(url.searchParams.get('start_date'), options.startDate);
    return url.searchParams.has('next_token') ? response([{ id: 'second' }]) : response([{ id: 'first' }], 'page-two');
  }});
  assert.deepEqual(result.data.activity.map(row => row.id), ['first','second']);
  assert.equal(seen.length, 2); assert.equal(seen[1].searchParams.get('next_token'), 'page-two');
});
test('repeated pagination tokens are an explicit collection error rather than a loop', async () => {
  let calls = 0;
  const result = await fetchOuraData({ ...options, collections: ['sleep'], fetchImpl: async () => { calls++; return response([], 'same'); } });
  assert.equal(calls, 2); assert.match(result.errors.sleep, /Pagination/);
});
test('malformed responses are isolated and cannot masquerade as empty success', async () => {
  const result = await fetchOuraData({ ...options, collections: ['sleep'], fetchImpl: async () => Response.json({ data: null }) });
  assert.match(result.errors.sleep, /not a data array/);
});
test('heart-rate dates include timezone and ring configuration omits date parameters', async () => {
  const requests = [];
  await fetchOuraData({ ...options, collections: ['heart_rate','ring_configuration'], fetchImpl: async url => { requests.push(new URL(url)); return response([]); } });
  const heart = requests.find(url => url.pathname.endsWith('/heartrate'));
  assert.equal(heart.searchParams.get('start_datetime'), '2026-10-01T00:00:00Z');
  assert.equal(heart.searchParams.get('end_datetime'), '2026-10-15T23:59:59Z');
  assert.equal(requests.find(url => url.pathname.endsWith('/ring_configuration')).search, '');
});
test('sandbox skips unavailable ring configuration and deduplicates requested collections', async () => {
  let calls = 0;
  await fetchOuraData({ ...options, useSandbox: true, collections: ['ring_configuration','activity','activity'], fetchImpl: async () => { calls++; return response([]); } });
  assert.equal(calls, 1);
});
test('invalid dates and unsupported collections fail before any request', async () => {
  for (const [start,end] of [['2026-02-30','2026-03-01'], ['bad','2026-03-01'], ['2026-10-15','2026-10-01']]) assert.throws(() => validateDateRange(start,end));
  await assert.rejects(fetchOuraData({ ...options, collections:['constructor'], fetchImpl: () => assert.fail('must not request') }), /Unknown/);
});
test('timeout is explicit, abort cancels the whole operation, and neither leaks credentials', async () => {
  const pending = (_url, init) => new Promise((_resolve, reject) => { init.signal.addEventListener('abort', () => reject(new DOMException('Canceled', 'AbortError')), { once: true }); });
  const timed = await fetchOuraData({ ...options, collections: ['sleep'], fetchImpl: pending, timeoutMs: 5 });
  assert.equal(timed.errors.sleep, 'The collection request timed out.');
  const controller = new AbortController();
  const request = fetchOuraData({ ...options, collections: ['sleep'], fetchImpl: pending, signal: controller.signal });
  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
});
test('observed averages exclude null and nonfinite values while preserving true zero', () => {
  const points = [0, 10, null, NaN, Infinity].map((value, index) => ({ day: String(index), value }));
  assert.deepEqual(summarizeSeries(points), { count: 2, missing: 3, mean: 5, min: 0, max: 10 });
  assert.equal(comparePeriods(points, [{ day:'prior', value: 8 }]).difference, -3);
  assert.equal(comparePeriods(points, []).difference, null);
  assert.equal(summarizeSeries([]).mean, null);
});
