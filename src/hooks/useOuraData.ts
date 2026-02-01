import { useState, useEffect } from 'react';
import axios from 'axios';
import { OuraData, DailyActivity, DailyReadiness, DailySleep } from '../types';

interface UseOuraDataProps {
  accessToken: string;
  startDate: string;
  endDate: string;
  useSandbox?: boolean;
}

export const useOuraData = ({ accessToken, startDate, endDate, useSandbox = true }: UseOuraDataProps) => {
  const [data, setData] = useState<OuraData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const params = { start_date: startDate, end_date: endDate };
        
        const baseUrl = useSandbox 
          ? 'https://api.ouraring.com/v2/sandbox/usercollection' 
          : 'https://api.ouraring.com/v2/usercollection';

        const [activityRes, readinessRes, sleepRes] = await Promise.all([
          axios.get<{ data: DailyActivity[] }>(`${baseUrl}/daily_activity`, { headers, params }),
          axios.get<{ data: DailyReadiness[] }>(`${baseUrl}/daily_readiness`, { headers, params }),
          axios.get<{ data: DailySleep[] }>(`${baseUrl}/daily_sleep`, { headers, params })
        ]);

        setData({
          activity: activityRes.data.data,
          readiness: readinessRes.data.data,
          sleep: sleepRes.data.data
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Oura data');
        console.error('Oura API Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, startDate, endDate, useSandbox]);

  return { data, loading, error };
};
