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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { format, parseISO } from 'date-fns';
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload, label = _a.label;
    if (active && payload && payload.length) {
        return (_jsxs("div", { style: { backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }, children: [_jsx("p", { children: label }), payload.map(function (p) { return (_jsxs("p", { style: { color: p.color }, children: [p.name, ": ", p.value] }, p.name)); })] }));
    }
    return null;
};
export var ActivityChart = function (_a) {
    var data = _a.data;
    // Sort data by day
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return new Date(a.day).getTime() - new Date(b.day).getTime(); });
    return (_jsxs("div", { style: { width: '100%', height: 300 }, children: [_jsx("h3", { children: "Activity Trends" }), _jsx(ResponsiveContainer, { children: _jsxs(ComposedChart, { data: sortedData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "day", tickFormatter: function (str) { return format(parseISO(str), 'MMM d'); } }), _jsx(YAxis, { yAxisId: "left", orientation: "left", stroke: "#8884d8" }), _jsx(YAxis, { yAxisId: "right", orientation: "right", stroke: "#82ca9d" }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, {}), _jsx(Bar, { yAxisId: "left", dataKey: "steps", fill: "#8884d8", name: "Steps" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "active_calories", stroke: "#82ca9d", name: "Active Cal" })] }) })] }));
};
export var ReadinessChart = function (_a) {
    var data = _a.data;
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return new Date(a.day).getTime() - new Date(b.day).getTime(); });
    return (_jsxs("div", { style: { width: '100%', height: 300 }, children: [_jsx("h3", { children: "Readiness Score" }), _jsx(ResponsiveContainer, { children: _jsxs(LineChart, { data: sortedData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "day", tickFormatter: function (str) { return format(parseISO(str), 'MMM d'); } }), _jsx(YAxis, { domain: [0, 100] }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "score", stroke: "#ff7300", name: "Readiness Score", strokeWidth: 2 })] }) })] }));
};
export var SleepChart = function (_a) {
    var data = _a.data;
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return new Date(a.day).getTime() - new Date(b.day).getTime(); });
    // Prepare data for stacked chart (convert seconds to hours for better readability?)
    // Or just keep seconds. Let's convert to hours roughly for axis, but maybe just use raw now.
    // Actually, seconds is too big numbers. Let's just use score and total sleep.
    var processedData = sortedData.map(function (d) { return (__assign(__assign({}, d), { total_sleep_hours: d.contributors.total_sleep ? (d.contributors.total_sleep / 3600).toFixed(1) : 0, deep_sleep_hours: d.contributors.deep_sleep ? (d.contributors.deep_sleep / 3600).toFixed(1) : 0, rem_sleep_hours: d.contributors.rem_sleep ? (d.contributors.rem_sleep / 3600).toFixed(1) : 0 })); });
    return (_jsxs("div", { style: { width: '100%', height: 300 }, children: [_jsx("h3", { children: "Sleep Score & Duration" }), _jsx(ResponsiveContainer, { children: _jsxs(ComposedChart, { data: processedData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "day", tickFormatter: function (str) { return format(parseISO(str), 'MMM d'); } }), _jsx(YAxis, { yAxisId: "left", orientation: "left", domain: [0, 100], stroke: "#8884d8" }), _jsx(YAxis, { yAxisId: "right", orientation: "right", unit: "h", stroke: "#82ca9d" }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, {}), _jsx(Bar, { yAxisId: "left", dataKey: "score", fill: "#8884d8", name: "Sleep Score" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "total_sleep_hours", stroke: "#82ca9d", name: "Total Sleep (h)" })] }) })] }));
};
