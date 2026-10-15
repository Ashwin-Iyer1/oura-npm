export function summarizeSeries(points) {
    var values = points.map(function (point) { return point.value; }).filter(function (value) { return typeof value === 'number' && Number.isFinite(value); });
    return {
        count: values.length,
        missing: points.length - values.length,
        mean: values.length ? values.reduce(function (sum, value) { return sum + value; }, 0) / values.length : null,
        min: values.length ? Math.min.apply(Math, values) : null,
        max: values.length ? Math.max.apply(Math, values) : null,
    };
}
/** Compare observed daily means; a missing day is never imputed as zero. */
export function comparePeriods(current, previous) {
    var now = summarizeSeries(current);
    var before = summarizeSeries(previous);
    return { current: now, previous: before, difference: now.mean !== null && before.mean !== null ? now.mean - before.mean : null };
}
