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
        return _jsx("div", { children: "Loading Oura Data..." });
    if (error)
        return _jsxs("div", { style: { color: 'red' }, children: ["Error: ", error] });
    if (!data)
        return _jsx("div", { children: "No data available" });
    var containerStyle = darkMode ? {
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: '"Courier New", Courier, monospace', // Tech/Mono look
        padding: '20px',
        minHeight: '100vh', // Ensure full height
        boxSizing: 'border-box'
    } : {
        padding: '20px',
        fontFamily: 'sans-serif'
    };
    var headerStyle = darkMode ? {
        textTransform: 'uppercase',
        letterSpacing: '4px',
        color: '#ffffff',
        borderBottom: '1px solid #ffffff',
        paddingBottom: '16px',
        marginBottom: '32px',
        fontSize: '24px',
        fontWeight: 'normal'
    } : {};
    var inputStyle = darkMode ? {
        backgroundColor: '#000000',
        color: '#ffffff',
        border: '1px solid #333333',
        padding: '8px 12px',
        fontFamily: 'inherit',
        marginLeft: '10px',
        outline: 'none',
        boxShadow: 'none',
        borderRadius: '0'
    } : {
        marginLeft: '5px'
    };
    var cardStyle = darkMode ? {
        backgroundColor: '#000000',
        border: '1px solid #333333',
        padding: '24px',
        borderRadius: '0' // Sharp edges for monochrome/tech look
    } : {
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsx("h2", { style: headerStyle, children: "Oura Ring Stats Dashboard" }), _jsxs("div", { style: { marginBottom: '32px', display: 'flex', gap: '32px', alignItems: 'center' }, children: [_jsxs("label", { style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', color: darkMode ? '#888' : 'inherit' }, children: ["START DATE:", _jsx("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, style: inputStyle })] }), _jsxs("label", { style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', color: darkMode ? '#888' : 'inherit' }, children: ["END DATE:", _jsx("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, style: inputStyle })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }, children: [_jsx("div", { style: cardStyle, children: _jsx(ActivityChart, { data: data.activity, darkMode: darkMode }) }), _jsx("div", { style: cardStyle, children: _jsx(ReadinessChart, { data: data.readiness, darkMode: darkMode }) }), _jsx("div", { style: cardStyle, children: _jsx(SleepChart, { data: data.sleep, darkMode: darkMode }) })] })] }));
};
