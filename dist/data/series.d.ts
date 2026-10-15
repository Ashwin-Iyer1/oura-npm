export interface DailyPoint {
    day: string;
    value: number | null;
}
export declare function summarizeSeries(points: readonly DailyPoint[]): {
    count: number;
    missing: number;
    mean: number | null;
    min: number | null;
    max: number | null;
};
/** Compare observed daily means; a missing day is never imputed as zero. */
export declare function comparePeriods(current: readonly DailyPoint[], previous: readonly DailyPoint[]): {
    current: {
        count: number;
        missing: number;
        mean: number | null;
        min: number | null;
        max: number | null;
    };
    previous: {
        count: number;
        missing: number;
        mean: number | null;
        min: number | null;
        max: number | null;
    };
    difference: number | null;
};
