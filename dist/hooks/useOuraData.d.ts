import { OuraData } from '../types';
interface UseOuraDataProps {
    accessToken: string;
    startDate: string;
    endDate: string;
    useSandbox?: boolean;
}
export declare const useOuraData: ({ accessToken, startDate, endDate, useSandbox }: UseOuraDataProps) => {
    data: OuraData | null;
    loading: boolean;
    error: string | null;
};
export {};
