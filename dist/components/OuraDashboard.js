import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useOuraData } from '../hooks/useOuraData';
import { ActivityChart, ReadinessChart, SleepChart } from './Charts';
export var OuraDashboard = function (_a) {
    var accessToken = _a.accessToken, _b = _a.startDate, initialStartDate = _b === void 0 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : _b, _c = _a.endDate, initialEndDate = _c === void 0 ? new Date().toISOString().split('T')[0] : _c, _d = _a.useSandbox, useSandbox = _d === void 0 ? true : _d, baseUrl = _a.baseUrl;
    var _e = useState(initialStartDate), startDate = _e[0], setStartDate = _e[1];
    var _f = useState(initialEndDate), endDate = _f[0], setEndDate = _f[1];
    var _g = useOuraData({ accessToken: accessToken, startDate: startDate, endDate: endDate, useSandbox: useSandbox, baseUrl: baseUrl }), data = _g.data, loading = _g.loading, error = _g.error;
    if (loading)
        return _jsx("div", { children: "Loading Oura Data..." });
    if (error)
        return _jsxs("div", { style: { color: 'red' }, children: ["Error: ", error] });
    if (!data)
        return _jsx("div", { children: "No data available" });
    return (_jsxs("div", { style: { padding: '20px', fontFamily: 'sans-serif' }, children: [_jsx("h2", { children: "Oura Ring Stats Dashboard" }), _jsxs("div", { style: { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }, children: [_jsxs("label", { children: ["Start Date:", _jsx("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, style: { marginLeft: '5px' } })] }), _jsxs("label", { children: ["End Date:", _jsx("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, style: { marginLeft: '5px' } })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }, children: [_jsx("div", { style: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }, children: _jsx(ActivityChart, { data: data.activity }) }), _jsx("div", { style: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }, children: _jsx(ReadinessChart, { data: data.readiness }) }), _jsx("div", { style: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }, children: _jsx(SleepChart, { data: data.sleep }) })] })] }));
};
