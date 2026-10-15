import { useState, useEffect, useCallback } from 'react';
import { fetchOuraData } from '../data/client';
export var useOuraData = function (_a) {
    var accessToken = _a.accessToken, startDate = _a.startDate, endDate = _a.endDate, _b = _a.useSandbox, useSandbox = _b === void 0 ? true : _b, baseUrl = _a.baseUrl, collections = _a.collections, fetchImpl = _a.fetchImpl, timeoutMs = _a.timeoutMs;
    var _c = useState(null), data = _c[0], setData = _c[1];
    var _d = useState(Boolean(accessToken)), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var _f = useState({}), errors = _f[0], setErrors = _f[1];
    var _g = useState(0), requestVersion = _g[0], setRequestVersion = _g[1];
    var refresh = useCallback(function () { return setRequestVersion(function (value) { return value + 1; }); }, []);
    var collectionKey = collections ? Array.from(new Set(collections)).sort().join(',') : undefined;
    useEffect(function () {
        var controller = new AbortController();
        var active = true;
        setData(null);
        setError(null);
        setErrors({});
        if (!accessToken) {
            setLoading(false);
            return function () { active = false; controller.abort(); };
        }
        setLoading(true);
        fetchOuraData({ accessToken: accessToken, startDate: startDate, endDate: endDate, useSandbox: useSandbox, baseUrl: baseUrl, fetchImpl: fetchImpl, timeoutMs: timeoutMs, signal: controller.signal,
            collections: collectionKey === undefined ? undefined : collectionKey ? collectionKey.split(',') : [],
        }).then(function (result) {
            if (!active)
                return;
            setData(result.data);
            setErrors(result.errors);
        }).catch(function (reason) {
            if (!active || controller.signal.aborted)
                return;
            setError(reason instanceof Error ? reason.message : 'Failed to fetch Oura data.');
        }).finally(function () { if (active)
            setLoading(false); });
        return function () { active = false; controller.abort(); };
    }, [accessToken, startDate, endDate, useSandbox, baseUrl, collectionKey, fetchImpl, timeoutMs, requestVersion]);
    return { data: data, loading: loading, error: error, errors: errors, refresh: refresh };
};
