import type { DailyPoint } from '../data/series';
export interface TimeSeriesChartProps {
    data: readonly DailyPoint[];
    label: string;
    unit?: string;
    domain?: readonly [number, number];
    color?: string;
    darkMode?: boolean;
    formatValue?: (value: number) => string;
}
/** Responsive SVG with truthful gaps and an equivalent keyboard date inspector. */
export declare function TimeSeriesChart({ data, label, unit, domain, color, darkMode, formatValue }: TimeSeriesChartProps): import("react/jsx-runtime").JSX.Element;
