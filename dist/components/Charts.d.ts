import React from 'react';
import { DailyActivity, DailyReadiness, DailySleep, DailyStress, DailySpO2, HeartRate, Workout, DailyResilience, DailyCardiovascularAge, VO2Max, Sleep, RingConfiguration, SleepTime, RestModePeriod } from '../types';
interface ChartProps<T> {
    data: T[];
    darkMode?: boolean;
}
export declare const ActivityChart: React.FC<ChartProps<DailyActivity>>;
export declare const ReadinessChart: React.FC<ChartProps<DailyReadiness>>;
export declare const SleepChart: React.FC<ChartProps<DailySleep>>;
export declare const StressChart: React.FC<ChartProps<DailyStress>>;
export declare const SpO2Chart: React.FC<ChartProps<DailySpO2>>;
export declare const HeartRateChart: React.FC<ChartProps<HeartRate>>;
export declare const WorkoutChart: React.FC<ChartProps<Workout>>;
export declare const ResilienceChart: React.FC<ChartProps<DailyResilience>>;
export declare const CardioAgeChart: React.FC<ChartProps<DailyCardiovascularAge>>;
export declare const VO2MaxChart: React.FC<ChartProps<VO2Max>>;
export declare const SleepDetailChart: React.FC<ChartProps<Sleep>>;
export declare const RingConfigCard: React.FC<ChartProps<RingConfiguration>>;
export declare const SleepTimeCard: React.FC<ChartProps<SleepTime>>;
export declare const RestModeCard: React.FC<ChartProps<RestModePeriod>>;
export declare const SimpleListCard: React.FC<ChartProps<any> & {
    title: string;
    renderItem: (d: any) => React.ReactNode;
}>;
export {};
