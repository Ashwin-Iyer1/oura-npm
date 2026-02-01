import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useOuraData } from '../hooks/useOuraData';
import { ActivityChart, ReadinessChart, SleepChart } from './Charts';
export var OuraDashboard = function (_a) {
    var accessToken = _a.accessToken, _b = _a.startDate, initialStartDate = _b === void 0 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : _b, _c = _a.endDate, initialEndDate = _c === void 0 ? new Date().toISOString().split('T')[0] : _c, _d = _a.useSandbox, useSandbox = _d === void 0 ? true : _d, baseUrl = _a.baseUrl, _e = _a.darkMode, darkMode = _e === void 0 ? false : _e;
    var _f = useState(initialStartDate), startDate = _f[0], setStartDate = _f[1];
    var _g = useState(initialEndDate), endDate = _g[0], setEndDate = _g[1];
    var _h = useOuraData({ accessToken: accessToken, startDate: startDate, endDate: endDate, useSandbox: useSandbox, baseUrl: baseUrl }), data = _h.data, loading = _h.loading, error = _h.error;
    if (loading)
        return _jsx("div", { style: { color: darkMode ? '#00ff9d' : '#000', fontFamily: darkMode ? '"Courier New", monospace' : 'sans-serif' }, children: "Loading Oura Data..." });
    if (error)
        return _jsxs("div", { style: { color: 'red', fontFamily: darkMode ? '"Courier New", monospace' : 'sans-serif' }, children: ["Error: ", error] });
    if (!data)
        return _jsx("div", { style: { color: darkMode ? '#a0a0a0' : '#000', fontFamily: darkMode ? '"Courier New", monospace' : 'sans-serif' }, children: "No data available" });
    return (_jsxs("div", { style: {
            padding: '20px',
            fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
            backgroundColor: darkMode ? '#050505' : 'transparent',
            borderRadius: '8px',
            border: darkMode ? '1px solid #333' : 'none'
        }, children: [_jsx("h2", { style: { color: darkMode ? '#00f3ff' : 'inherit', textTransform: darkMode ? 'uppercase' : 'none', letterSpacing: darkMode ? '2px' : 'normal' }, children: "Oura Ring Stats Dashboard" }), _jsxs("div", { style: { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }, children: [_jsxs("label", { style: { color: darkMode ? '#a0a0a0' : 'inherit' }, children: ["Start Date:", _jsx("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, style: {
                                    marginLeft: '5px',
                                    backgroundColor: darkMode ? '#111' : '#fff',
                                    color: darkMode ? '#00ff9d' : '#000',
                                    border: darkMode ? '1px solid #333' : '1px solid #ccc',
                                    padding: '4px',
                                    borderRadius: '4px'
                                } })] }), _jsxs("label", { style: { color: darkMode ? '#a0a0a0' : 'inherit' }, children: ["End Date:", _jsx("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, style: {
                                    marginLeft: '5px',
                                    backgroundColor: darkMode ? '#111' : '#fff',
                                    color: darkMode ? '#00ff9d' : '#000',
                                    border: darkMode ? '1px solid #333' : '1px solid #ccc',
                                    padding: '4px',
                                    borderRadius: '4px'
                                } })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }, children: [_jsx("div", { style: {
                            border: darkMode ? '1px solid #333' : '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: darkMode ? '0 0 10px rgba(0,243,255,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: darkMode ? '#080808' : '#fff'
                        }, children: _jsx(ActivityChart, { data: data.activity, darkMode: darkMode }) }), _jsx("div", { style: {
                            border: darkMode ? '1px solid #333' : '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: darkMode ? '0 0 10px rgba(255,115,0,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: darkMode ? '#080808' : '#fff'
                        }, children: _jsx(ReadinessChart, { data: data.readiness, darkMode: darkMode }) }), _jsx("div", { style: {
                            border: darkMode ? '1px solid #333' : '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: darkMode ? '0 0 10px rgba(0,255,157,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: darkMode ? '#080808' : '#fff'
                        }, children: _jsx(SleepChart, { data: data.sleep, darkMode: darkMode }) })] })] }));
};
