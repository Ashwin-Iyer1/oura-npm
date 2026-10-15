import React from 'react';
import type { OuraCollection, OuraRequestOptions } from '../data/client';
interface OuraDashboardProps {
    accessToken: string;
    startDate?: string;
    endDate?: string;
    useSandbox?: boolean;
    baseUrl?: string;
    darkMode?: boolean;
    collections?: readonly OuraCollection[];
    fetchImpl?: OuraRequestOptions['fetchImpl'];
}
export declare const OuraDashboard: React.FC<OuraDashboardProps>;
export {};
