import React from 'react';
interface OuraDashboardProps {
    accessToken: string;
    startDate?: string;
    endDate?: string;
    useSandbox?: boolean;
    baseUrl?: string;
    darkMode?: boolean;
}
export declare const OuraDashboard: React.FC<OuraDashboardProps>;
export {};
