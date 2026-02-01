import { OuraData } from '../types';
interface UseOuraDataProps {
    accessToken: string;
    startDate: string;
    endDate: string;
}
export declare const useOuraData: ({ accessToken, startDate, endDate }: UseOuraDataProps) => {
    data: OuraData | null;
    loading: boolean;
    error: string | null;
};
export {};
