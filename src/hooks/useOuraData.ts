import { useState, useEffect, useCallback } from 'react';
import { OuraData } from '../types';
import { fetchOuraData, OuraRequestOptions, OuraCollection, OuraCollectionErrors } from '../data/client';

export type UseOuraDataProps = Omit<OuraRequestOptions, 'signal'>;

export const useOuraData = ({ accessToken, startDate, endDate, useSandbox = true, baseUrl, collections, fetchImpl, timeoutMs }: UseOuraDataProps) => {
  const [data, setData] = useState<OuraData | null>(null);
  const [loading, setLoading] = useState(Boolean(accessToken));
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<OuraCollectionErrors>({});
  const [requestVersion, setRequestVersion] = useState(0);
  const refresh = useCallback(() => setRequestVersion(value => value + 1), []);
  const collectionKey = collections ? Array.from(new Set(collections)).sort().join(',') : undefined;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setData(null); setError(null); setErrors({});
    if (!accessToken) { setLoading(false); return () => { active = false; controller.abort(); }; }
    setLoading(true);
    fetchOuraData({ accessToken, startDate, endDate, useSandbox, baseUrl, fetchImpl, timeoutMs, signal: controller.signal,
      collections: collectionKey === undefined ? undefined : collectionKey ? collectionKey.split(',') as OuraCollection[] : [],
    }).then(result => {
      if (!active) return;
      setData(result.data); setErrors(result.errors);
    }).catch(reason => {
      if (!active || controller.signal.aborted) return;
      setError(reason instanceof Error ? reason.message : 'Failed to fetch Oura data.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [accessToken, startDate, endDate, useSandbox, baseUrl, collectionKey, fetchImpl, timeoutMs, requestVersion]);

  return { data, loading, error, errors, refresh };
};
