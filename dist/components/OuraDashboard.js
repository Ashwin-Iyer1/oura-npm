import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useOuraData } from '../hooks/useOuraData';
import { ActivityChart, ReadinessChart, SleepChart, StressChart, SpO2Chart, HeartRateChart, WorkoutChart, ResilienceChart, CardioAgeChart, VO2MaxChart, SleepDetailChart, RingConfigCard, SleepTimeCard, RestModeCard, SimpleListCard } from './Charts';
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
        gap: '16px',
        alignItems: 'center',
        border: borderStyle,
        padding: '8px 12px',
        backgroundColor: '#ffffff',
        color: '#333'
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
            border: borderStyle,
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gridColumn: "span ".concat(span),
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#fff',
            color: '#333'
        });
    };
    var headerTextStyle = darkMode ? {
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '14px',
        margin: 0,
        color: '#fff'
    } : {
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '14px',
        margin: 0,
        color: '#333',
        fontWeight: 'bold'
    };
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
        backgroundColor: '#fff',
        color: '#333',
        border: '1px solid #ccc',
        padding: '2px 6px',
        fontFamily: 'inherit',
        marginLeft: '8px',
        outline: 'none',
        fontSize: '11px',
        borderRadius: 0
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsxs("div", { style: controlBarStyle, children: [_jsx("h2", { style: headerTextStyle, children: "OURA_STATS_VISUALIZER" }), _jsx("div", { style: { flex: 1 } }), _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsxs("label", { style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', color: '#888' }, children: ["START_DATE", _jsx("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, style: inputStyle })] }), _jsxs("label", { style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', color: '#888' }, children: ["END_DATE", _jsx("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, style: inputStyle })] })] })] }), _jsxs("div", { style: gridContainerStyle, children: [_jsx("div", { style: cardStyle(4), children: _jsx(ActivityChart, { data: data.activity, darkMode: darkMode }) }), _jsx("div", { style: cardStyle(4), children: _jsx(ReadinessChart, { data: data.readiness, darkMode: darkMode }) }), _jsx("div", { style: cardStyle(4), children: _jsx(SleepChart, { data: data.sleep, darkMode: darkMode }) }), data.daily_stress && data.daily_stress.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(StressChart, { data: data.daily_stress, darkMode: darkMode }) })), data.daily_spo2 && data.daily_spo2.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(SpO2Chart, { data: data.daily_spo2, darkMode: darkMode }) })), data.heart_rate && data.heart_rate.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(HeartRateChart, { data: data.heart_rate, darkMode: darkMode }) })), data.workout && data.workout.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(WorkoutChart, { data: data.workout, darkMode: darkMode }) })), data.daily_resilience && data.daily_resilience.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(ResilienceChart, { data: data.daily_resilience, darkMode: darkMode }) })), data.daily_cardiovascular_age && data.daily_cardiovascular_age.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(CardioAgeChart, { data: data.daily_cardiovascular_age, darkMode: darkMode }) })), data.vo2_max && data.vo2_max.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(VO2MaxChart, { data: data.vo2_max, darkMode: darkMode }) })), data.sleep_documents && data.sleep_documents.length > 0 && (_jsx("div", { style: cardStyle(4), children: _jsx(SleepDetailChart, { data: data.sleep_documents, darkMode: darkMode }) })), (data.sleep_time && data.sleep_time.length > 0) && (_jsx("div", { style: cardStyle(4), children: _jsx(SleepTimeCard, { data: data.sleep_time, darkMode: darkMode }) })), (data.ring_configuration && data.ring_configuration.length > 0) && (_jsx("div", { style: cardStyle(4), children: _jsx(RingConfigCard, { data: data.ring_configuration, darkMode: darkMode }) })), _jsx("div", { style: cardStyle(4), children: _jsx(RestModeCard, { data: data.rest_mode_period || [], darkMode: darkMode }) }), _jsx("div", { style: cardStyle(4), children: _jsx(SimpleListCard, { title: "SESSIONS", darkMode: darkMode, data: data.session || [], renderItem: function (s) { return (_jsxs("div", { children: [_jsx("span", { style: { opacity: 0.7, marginRight: 6 }, children: s.day }), _jsx("strong", { children: s.type }), " (", s.mood, ")"] })); } }) }), _jsx("div", { style: cardStyle(4), children: _jsx(SimpleListCard, { title: "TAGS", darkMode: darkMode, data: data.tag || [], renderItem: function (t) {
                                var _a;
                                return (_jsxs("div", { children: [_jsx("span", { style: { opacity: 0.7, marginRight: 6 }, children: t.day }), t.text && _jsxs("span", { children: [t.text, " "] }), ((_a = t.tags) === null || _a === void 0 ? void 0 : _a.length) > 0 && _jsxs("span", { style: { color: '#888' }, children: ["[", t.tags.join(', '), "]"] })] }));
                            } }) }), _jsx("div", { style: cardStyle(4), children: _jsx(SimpleListCard, { title: "ENHANCED TAGS", darkMode: darkMode, data: data.enhanced_tag || [], renderItem: function (t) { return (_jsxs("div", { children: [_jsx("span", { style: { opacity: 0.7, marginRight: 6 }, children: t.start_day }), _jsx("strong", { children: t.tag_type_code }), t.comment && _jsxs("div", { children: ["\"", t.comment, "\""] })] })); } }) })] })] }));
};
