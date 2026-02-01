import { useState, useEffect } from 'react';
import { parseAuthCallback } from './utils';
export var useOuraAuth = function () {
    var _a = useState(null), authResult = _a[0], setAuthResult = _a[1];
    useEffect(function () {
        // Check for hash in URL on mount
        if (typeof window !== 'undefined' && window.location.hash) {
            var result = parseAuthCallback(window.location.hash);
            if (result) {
                setAuthResult(result);
                // Clear the hash to look cleaner and prevent re-parsing
                window.history.replaceState(null, '', ' ');
            }
        }
    }, []);
    return authResult;
};
