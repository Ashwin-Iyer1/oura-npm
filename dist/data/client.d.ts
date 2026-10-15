import type { OuraData } from '../types';
export declare const COLLECTION_ENDPOINTS: {
    readonly activity: "daily_activity";
    readonly readiness: "daily_readiness";
    readonly sleep: "daily_sleep";
    readonly daily_stress: "daily_stress";
    readonly daily_spo2: "daily_spo2";
    readonly daily_resilience: "daily_resilience";
    readonly daily_cardiovascular_age: "daily_cardiovascular_age";
    readonly heart_rate: "heartrate";
    readonly sleep_documents: "sleep";
    readonly sleep_time: "sleep_time";
    readonly session: "session";
    readonly workout: "workout";
    readonly tag: "tag";
    readonly enhanced_tag: "enhanced_tag";
    readonly rest_mode_period: "rest_mode_period";
    readonly ring_configuration: "ring_configuration";
    readonly vo2_max: "vO2_max";
};
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
export declare function emptyOuraData(): OuraData;
export declare function validateDateRange(start: string, end: string): void;
/** Fetch complete collections independently. One denied scope cannot erase successful data. */
export declare function fetchOuraData(options: OuraRequestOptions): Promise<{
    data: OuraData;
    errors: OuraCollectionErrors;
}>;
