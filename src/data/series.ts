export interface DailyPoint { day: string; value: number | null; }
export function summarizeSeries(points: readonly DailyPoint[]) {
  const values = points.map(point => point.value).filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  return {
    count: values.length,
    missing: points.length - values.length,
    mean: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
    min: values.length ? Math.min(...values) : null,
    max: values.length ? Math.max(...values) : null,
  };
}

/** Compare observed daily means; a missing day is never imputed as zero. */
export function comparePeriods(current: readonly DailyPoint[], previous: readonly DailyPoint[]) {
  const now = summarizeSeries(current);
  const before = summarizeSeries(previous);
  return { current: now, previous: before, difference: now.mean !== null && before.mean !== null ? now.mean - before.mean : null };
}
