import { OuraData } from '../types';
interface UseOuraDataProps {
    accessToken: string;
    startDate: string;
    endDate: string;
    useSandbox?: boolean;
    baseUrl?: string;
}
export declare const useOuraData: ({ accessToken, startDate, endDate, useSandbox, baseUrl }: UseOuraDataProps) => {
    data: OuraData | null;
    loading: boolean;
    error: string | null;
};
export {};
