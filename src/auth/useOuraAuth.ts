import { useState, useEffect } from 'react';
import { parseAuthCallback, AuthResult } from './utils';

export const useOuraAuth = () => {
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);

  useEffect(() => {
    // Check for hash in URL on mount
    if (typeof window !== 'undefined' && window.location.hash) {
      const result = parseAuthCallback(window.location.hash);
      if (result) {
        setAuthResult(result);
        // Clear the hash to look cleaner and prevent re-parsing
        window.history.replaceState(null, '', ' ');
      }
    }
  }, []);

  return authResult;
};
