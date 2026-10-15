import type { DailyPoint, OuraData } from 'oura-stats-visualizer';
export const END_DAY = '2026-10-15';
export const shiftDay = (day: string, delta: number) => new Date(Date.parse(`${day}T12:00:00Z`) + delta * 86400000).toISOString().slice(0, 10);
export const daysInRange = (end: string, count: number) => Array.from({ length: count }, (_, index) => shiftDay(end, index - count + 1));
const dates = daysInRange(END_DAY, 120);
const wave = (index: number, period: number, offset = 0) => Math.sin(index / period + offset);

// Original deterministic fixtures, not Oura sandbox responses or a person's data.
export const fixtureCollections: Record<string, Record<string, unknown>[]> = {
  daily_activity: dates.map((day, index) => ({ id: `activity-${day}`, day, score: Math.round(78 + 10 * wave(index, 4) + 5 * wave(index, 13)), steps: Math.round(7100 + 2100 * wave(index, 4) + 900 * wave(index, 13) + index * 12), active_calories: Math.round(350 + 100 * wave(index, 4)), total_calories: 2100, timestamp: `${day}T12:00:00Z` })),
  daily_readiness: dates.filter((_, index) => index !== 109).map(day => { const index = dates.indexOf(day); return { id: `readiness-${day}`, day, score: Math.round(77 + 9 * wave(index, 5, .9) + 4 * wave(index, 12)), timestamp: `${day}T12:00:00Z` }; }),
  daily_sleep: dates.filter((_, index) => index !== 103 && index !== 112).map(day => { const index = dates.indexOf(day); return { id: `sleep-score-${day}`, day, score: Math.round(80 + 8 * wave(index, 5, .3) + 5 * wave(index, 11)), timestamp: `${day}T12:00:00Z` }; }),
  sleep: dates.filter((_, index) => index !== 103 && index !== 112).map(day => { const index = dates.indexOf(day); const hours = 7.15 + .65 * wave(index, 5, .3) + .3 * wave(index, 11); const total = Math.round(hours * 3600); return { id: `sleep-${day}`, day, total_sleep_duration: total, deep_sleep_duration: Math.round(total * .19), rem_sleep_duration: Math.round(total * .24), light_sleep_duration: Math.round(total * .57), average_heart_rate: Math.round(55 + 3 * wave(index, 8)), average_hrv: Math.round(49 + 10 * wave(index, 8)), efficiency: 91, type: 'long_sleep' }; }),
};

export function createSampleTransport(readinessFailure: boolean): typeof fetch {
  return async (input, init) => {
    const url = new URL(String(input), 'https://fictional.invalid');
    const endpoint = url.pathname.split('/').pop() || '';
    await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(new DOMException('Canceled', 'AbortError')); };
      const timer = setTimeout(() => { init?.signal?.removeEventListener('abort', abort); resolve(); }, 35);
      if (init?.signal?.aborted) abort(); else init?.signal?.addEventListener('abort', abort, { once: true });
    });
    if (readinessFailure && endpoint === 'daily_readiness') return new Response('{}', { status: 503 });
    const start = url.searchParams.get('start_date') || '';
    const end = url.searchParams.get('end_date') || END_DAY;
    const records = (fixtureCollections[endpoint] || []).filter(item => String(item.day) >= start && String(item.day) <= end);
    const offset = Number(url.searchParams.get('next_token') || '0');
    const next = offset + 20;
    return Response.json({ data: records.slice(offset, next), next_token: next < records.length ? String(next) : null });
  };
}

export type MetricId = 'sleep' | 'readiness' | 'steps' | 'duration';
export const metrics: { id: MetricId; label: string; unit: string; color: string; domain: readonly [number, number]; description: string; collection: keyof OuraData }[] = [
  { id: 'sleep', label: 'Sleep score', unit: 'points', color: '#7777c8', domain: [0, 100], description: 'A daily summary score in the fictional dataset.', collection: 'sleep' },
  { id: 'readiness', label: 'Readiness', unit: 'points', color: '#587e6c', domain: [0, 100], description: 'A generated recovery score. No clinical interpretation is implied.', collection: 'readiness' },
  { id: 'steps', label: 'Daily movement', unit: 'steps', color: '#b7824c', domain: [0, 14000], description: 'Daily step totals, without imputing missing observations.', collection: 'activity' },
  { id: 'duration', label: 'Sleep duration', unit: 'hours', color: '#56838c', domain: [0, 10], description: 'Time asleep, converted from seconds to hours.', collection: 'sleep_documents' },
];

export function metricSeries(data: OuraData | null, metric: MetricId, end: string, count: number): DailyPoint[] {
  const records = metric === 'sleep' ? data?.sleep : metric === 'readiness' ? data?.readiness : metric === 'steps' ? data?.activity : data?.sleep_documents;
  return daysInRange(end, count).map(day => {
    const row = records?.find(item => item.day === day);
    let value: number | null = null;
    if (row) {
      if (metric === 'steps' && 'steps' in row) value = row.steps;
      else if (metric === 'duration' && 'total_sleep_duration' in row) value = row.total_sleep_duration / 3600;
      else if ('score' in row) value = row.score;
    }
    return { day, value: typeof value === 'number' && Number.isFinite(value) ? value : null };
  });
}

export function formatMetric(value: number | null, metric: MetricId): string {
  if (value === null) return '—';
  return metric === 'duration' ? value.toFixed(1) : Math.round(value).toLocaleString('en-US');
}
