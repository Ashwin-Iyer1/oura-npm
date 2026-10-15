import type { OuraData } from '../types';

export const COLLECTION_ENDPOINTS = {
  activity: 'daily_activity', readiness: 'daily_readiness', sleep: 'daily_sleep',
  daily_stress: 'daily_stress', daily_spo2: 'daily_spo2', daily_resilience: 'daily_resilience',
  daily_cardiovascular_age: 'daily_cardiovascular_age', heart_rate: 'heartrate',
  sleep_documents: 'sleep', sleep_time: 'sleep_time', session: 'session', workout: 'workout',
  tag: 'tag', enhanced_tag: 'enhanced_tag', rest_mode_period: 'rest_mode_period',
  ring_configuration: 'ring_configuration', vo2_max: 'vO2_max',
} as const;
export type OuraCollection = keyof typeof COLLECTION_ENDPOINTS;
export type OuraCollectionErrors = Partial<Record<OuraCollection, string>>;
export interface OuraRequestOptions {
  accessToken: string;
  startDate: string;
  endDate: string;
  useSandbox?: boolean;
  baseUrl?: string;
  collections?: readonly OuraCollection[];
  /** Inject a transport for tests, offline fixtures, or a same-origin proxy. */
  fetchImpl?: typeof fetch;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export function emptyOuraData(): OuraData {
  return Object.fromEntries(Object.keys(COLLECTION_ENDPOINTS).map(key => [key, []])) as unknown as OuraData;
}

function validDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

export function validateDateRange(start: string, end: string): void {
  if (!validDay(start) || !validDay(end)) throw new Error('Use valid dates in YYYY-MM-DD format.');
  if (start > end) throw new Error('The start date must be on or before the end date.');
}

function abortError(): Error { const error = new Error('The request was canceled.'); error.name = 'AbortError'; return error; }

/** Fetch complete collections independently. One denied scope cannot erase successful data. */
export async function fetchOuraData(options: OuraRequestOptions): Promise<{ data: OuraData; errors: OuraCollectionErrors }> {
  validateDateRange(options.startDate, options.endDate);
  if (options.signal?.aborted) throw abortError();
  const useSandbox = options.useSandbox ?? true;
  const baseUrl = (options.baseUrl || `https://api.ouraring.com/v2/${useSandbox ? 'sandbox/' : ''}usercollection`).replace(/\/$/, '');
  const fetchImpl = options.fetchImpl || fetch;
  const collections = Array.from(new Set(options.collections || Object.keys(COLLECTION_ENDPOINTS) as OuraCollection[]));
  for (const key of collections) if (!Object.prototype.hasOwnProperty.call(COLLECTION_ENDPOINTS, key)) throw new Error(`Unknown Oura collection: ${key}`);
  const data = emptyOuraData();
  const errors: OuraCollectionErrors = {};
  await Promise.all(collections.map(async (key) => {
    if (key === 'ring_configuration' && useSandbox) return;
    const controller = new AbortController();
    const abort = () => controller.abort();
    options.signal?.addEventListener('abort', abort, { once: true });
    if (options.signal?.aborted) abort();
    const timer = setTimeout(abort, options.timeoutMs ?? 15000);
    try {
      const params = new URLSearchParams();
      if (key === 'heart_rate') {
        params.set('start_datetime', `${options.startDate}T00:00:00Z`);
        params.set('end_datetime', `${options.endDate}T23:59:59Z`);
      } else if (key !== 'ring_configuration') {
        params.set('start_date', options.startDate); params.set('end_date', options.endDate);
      }
      const items: unknown[] = [];
      const seenTokens = new Set<string>();
      let pages = 0;
      for (;;) {
        if (controller.signal.aborted) throw abortError();
        const response = await fetchImpl(`${baseUrl}/${COLLECTION_ENDPOINTS[key]}?${params}`, {
          headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {},
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`);
        const body: unknown = await response.json();
        if (!body || typeof body !== 'object' || !('data' in body) || !Array.isArray(body.data)) throw new Error('The collection response is not a data array.');
        items.push(...body.data);
        const next = 'next_token' in body ? body.next_token : undefined;
        if (next === null || next === undefined || next === '') break;
        if (typeof next !== 'string' || seenTokens.has(next) || ++pages >= 100) throw new Error('Pagination did not complete safely.');
        seenTokens.add(next); params.set('next_token', next);
      }
      (data[key] as unknown[]) = items;
    } catch (error) {
      if (options.signal?.aborted) return;
      errors[key] = controller.signal.aborted ? 'The collection request timed out.' : error instanceof Error ? error.message : 'The collection request failed.';
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', abort);
    }
  }));
  if (options.signal?.aborted) throw abortError();
  return { data, errors };
}
