import { useState, useEffect } from 'react';
import axios from 'axios';
import { OuraData, DailyActivity, DailyReadiness, DailySleep, DailyStress, DailySpO2, DailyResilience, DailyCardiovascularAge, HeartRate, Sleep, SleepTime, Session, Workout, Tag, EnhancedTag, RestModePeriod, RingConfiguration, VO2Max } from '../types';

interface UseOuraDataProps {
  accessToken: string;
  startDate: string;
  endDate: string;
  useSandbox?: boolean;
  baseUrl?: string;
}

export const useOuraData = ({ accessToken, startDate, endDate, useSandbox = true, baseUrl }: UseOuraDataProps) => {
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
        // Heart rate endpoint uses datetime
        const heartRateParams = { 
            start_datetime: `${startDate}T00:00:00`, 
            end_datetime: `${endDate}T23:59:59` 
        };
        
        const finalBaseUrl = baseUrl || (useSandbox 
          ? 'https://api.ouraring.com/v2/sandbox/usercollection' 
          : 'https://api.ouraring.com/v2/usercollection');

        const [
            activityRes, readinessRes, sleepRes,
            stressRes, spo2Res, resilienceRes, cardioAgeRes,
            heartRateRes, sleepDocRes, sleepTimeRes,
            sessionRes, workoutRes, tagRes, enhancedTagRes,
            restModeRes, ringConfigRes, vo2MaxRes
        ] = await Promise.all([
          axios.get<{ data: DailyActivity[] }>(`${finalBaseUrl}/daily_activity`, { headers, params }),
          axios.get<{ data: DailyReadiness[] }>(`${finalBaseUrl}/daily_readiness`, { headers, params }),
          axios.get<{ data: DailySleep[] }>(`${finalBaseUrl}/daily_sleep`, { headers, params }),
          
          axios.get<{ data: DailyStress[] }>(`${finalBaseUrl}/daily_stress`, { headers, params }),
          axios.get<{ data: DailySpO2[] }>(`${finalBaseUrl}/daily_spo2`, { headers, params }),
          axios.get<{ data: DailyResilience[] }>(`${finalBaseUrl}/daily_resilience`, { headers, params }),
          axios.get<{ data: DailyCardiovascularAge[] }>(`${finalBaseUrl}/daily_cardiovascular_age`, { headers, params }),
          
          // Heart rate can fail if range > 30 days (400 Bad Request). Handle gracefully.
          axios.get<{ data: HeartRate[] }>(`${finalBaseUrl}/heartrate`, { headers, params: heartRateParams })
              .catch(err => {
                  console.warn('Heart rate fetch failed (likely due to date range limit), skipping:', err.message);
                  return { data: { data: [] as HeartRate[] } };
              }),

          axios.get<{ data: Sleep[] }>(`${finalBaseUrl}/sleep`, { headers, params }),
          axios.get<{ data: SleepTime[] }>(`${finalBaseUrl}/sleep_time`, { headers, params }),
          
          axios.get<{ data: Session[] }>(`${finalBaseUrl}/session`, { headers, params }),
          axios.get<{ data: Workout[] }>(`${finalBaseUrl}/workout`, { headers, params }),
          axios.get<{ data: Tag[] }>(`${finalBaseUrl}/tag`, { headers, params }),
          axios.get<{ data: EnhancedTag[] }>(`${finalBaseUrl}/enhanced_tag`, { headers, params }),
          
          axios.get<{ data: RestModePeriod[] }>(`${finalBaseUrl}/rest_mode_period`, { headers, params }),
          // ring_configuration is not available in sandbox
          !useSandbox 
            ? axios.get<{ data: RingConfiguration[] }>(`${finalBaseUrl}/ring_configuration`, { headers, params })
            : Promise.resolve({ data: { data: [] as RingConfiguration[] } }),
          axios.get<{ data: VO2Max[] }>(`${finalBaseUrl}/vO2_max`, { headers, params })
        ]);

        setData({
          activity: activityRes.data.data,
          readiness: readinessRes.data.data,
          sleep: sleepRes.data.data,
          daily_stress: stressRes.data.data,
          daily_spo2: spo2Res.data.data,
          daily_resilience: resilienceRes.data.data,
          daily_cardiovascular_age: cardioAgeRes.data.data,
          heart_rate: heartRateRes.data.data,
          sleep_documents: sleepDocRes.data.data,
          sleep_time: sleepTimeRes.data.data,
          session: sessionRes.data.data,
          workout: workoutRes.data.data,
          tag: tagRes.data.data,
          enhanced_tag: enhancedTagRes.data.data,
          rest_mode_period: restModeRes.data.data,
          ring_configuration: ringConfigRes.data.data,
          vo2_max: vo2MaxRes.data.data
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Oura data');
        console.error('Oura API Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, startDate, endDate, useSandbox, baseUrl]);

  return { data, loading, error };
};
