import React from 'react';
import { DailyActivity, DailyReadiness, DailySleep } from '../types';
interface ChartProps<T> {
    data: T[];
    darkMode?: boolean;
}
export declare const ActivityChart: React.FC<ChartProps<DailyActivity>>;
export declare const ReadinessChart: React.FC<ChartProps<DailyReadiness>>;
export declare const SleepChart: React.FC<ChartProps<DailySleep>>;
export {};
