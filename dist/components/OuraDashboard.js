var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        color: '#e0e0e0',
        fontFamily: '"Courier New", Courier, monospace',
        padding: '4px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    } : {
        padding: '20px',
        fontFamily: 'sans-serif'
    };
    var borderStyle = darkMode ? '1px solid #333' : '1px solid #ddd';
    var controlBarStyle = darkMode ? {
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        border: borderStyle,
        padding: '8px 12px',
        backgroundColor: '#050505'
    } : {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '20px'
    };
    var gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '4px',
        flex: 1
    };
    var cardStyle = function (span) {
        if (span === void 0) { span = 4; }
        return (darkMode ? {
            backgroundColor: '#050505',
            border: borderStyle,
            padding: '2px', // Minimal padding
            gridColumn: "span ".concat(span),
            height: '250px', // Fixed height to prevent infinite growth with ParentSize
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        } : {
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gridColumn: "span ".concat(span),
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });
    };
    var headerTextStyle = darkMode ? {
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '14px',
        margin: 0,
        color: '#fff'
    } : {};
    var inputStyle = darkMode ? {
        backgroundColor: '#000',
        color: '#fff',
        border: '1px solid #333',
        padding: '2px 6px',
        fontFamily: 'inherit',
        marginLeft: '8px',
        outline: 'none',
        fontSize: '11px',
        borderRadius: 0
    } : {
        marginLeft: '5px'
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsxs("div", { style: controlBarStyle, children: [_jsx("h2", { style: headerTextStyle, children: "OURA_STATS_VISUALIZER" }), _jsx("div", { style: { flex: 1 } }), _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsxs("label", { style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', color: '#888' }, children: ["START_DATE", _jsx("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, style: inputStyle })] }), _jsxs("label", { style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', color: '#888' }, children: ["END_DATE", _jsx("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, style: inputStyle })] })] })] }), _jsxs("div", { style: gridContainerStyle, children: [_jsx("div", { style: cardStyle(4), children: _jsx(ActivityChart, { data: data.activity, darkMode: darkMode }) }), _jsx("div", { style: cardStyle(4), children: _jsx(ReadinessChart, { data: data.readiness, darkMode: darkMode }) }), _jsx("div", { style: cardStyle(4), children: _jsx(SleepChart, { data: data.sleep, darkMode: darkMode }) }), _jsx("div", { style: __assign(__assign({}, cardStyle(12)), { minHeight: '150px', justifyContent: 'center', alignItems: 'center', color: '#333' }), children: _jsx("span", { style: { textTransform: 'uppercase', letterSpacing: '2px', fontSize: '10px' }, children: "NO_ADDITIONAL_DATA_STREAM" }) })] })] }));
};
