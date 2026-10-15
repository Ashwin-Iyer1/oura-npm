import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { useOuraData } from '../src/hooks/useOuraData.ts';
const options = { accessToken:'test-token', startDate:'2026-10-01', endDate:'2026-10-15', collections:['sleep'] };
const result = id => Response.json({ data:[{id, day:'2026-10-15', score:80}], next_token:null });

test('clearing credentials clears prior data and makes no new request', async () => {
  let current, calls = 0;
  function Harness(props) { current = useOuraData(props); return null; }
  const props = { ...options, fetchImpl: async () => { calls++; return result('old'); } };
  let renderer;
  await act(async () => { renderer = create(React.createElement(Harness, props)); });
  assert.equal(current.data.sleep[0].id, 'old');
  await act(async () => { renderer.update(React.createElement(Harness, {...props, accessToken:''})); });
  assert.equal(current.data, null); assert.equal(current.loading, false); assert.equal(calls, 1);
  await act(async () => renderer.unmount());
});
test('a late old-date response cannot overwrite the newer request', async () => {
  let current, resolveOld, oldSignal;
  function Harness(props) { current = useOuraData(props); return null; }
  const fetchImpl = async (url, init) => {
    if (new URL(url).searchParams.get('start_date') === '2026-10-01') { oldSignal = init.signal; return new Promise(resolve => { resolveOld = resolve; }); }
    return result('new');
  };
  let renderer;
  await act(async () => { renderer = create(React.createElement(Harness, {...options, fetchImpl})); });
  await act(async () => { renderer.update(React.createElement(Harness, {...options, startDate:'2026-10-02', fetchImpl})); });
  assert.equal(oldSignal.aborted, true); assert.equal(current.data.sleep[0].id, 'new');
  await act(async () => { resolveOld(result('old')); });
  assert.equal(current.data.sleep[0].id, 'new');
  await act(async () => renderer.unmount());
});
test('refresh recovers a collection without a remount', async () => {
  let current, failed = true;
  function Harness(props) { current = useOuraData(props); return null; }
  let renderer;
  await act(async () => { renderer = create(React.createElement(Harness, {...options, fetchImpl:async () => failed ? new Response('{}',{status:503}) : result('recovered')})); });
  assert.match(current.errors.sleep,/503/); failed = false;
  await act(async () => current.refresh());
  assert.equal(current.data.sleep[0].id,'recovered'); assert.deepEqual(current.errors,{});
  await act(async () => renderer.unmount());
});
