import { OuraData } from '../types';
import { OuraRequestOptions } from '../data/client';
export type UseOuraDataProps = Omit<OuraRequestOptions, 'signal'>;
export declare const useOuraData: ({ accessToken, startDate, endDate, useSandbox, baseUrl, collections, fetchImpl, timeoutMs }: UseOuraDataProps) => {
    data: OuraData | null;
    loading: boolean;
    error: string | null;
    errors: Partial<Record<"daily_stress" | "daily_spo2" | "daily_resilience" | "daily_cardiovascular_age" | "sleep" | "sleep_time" | "session" | "workout" | "tag" | "enhanced_tag" | "rest_mode_period" | "ring_configuration" | "activity" | "readiness" | "heart_rate" | "sleep_documents" | "vo2_max", string>>;
    refresh: () => void;
};
