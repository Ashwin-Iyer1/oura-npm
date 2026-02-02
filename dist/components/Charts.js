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
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { LinearGradient } from '@visx/gradient';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { format, parseISO } from 'date-fns';
var getTheme = function (darkMode) { return ({
    background: darkMode ? '#000000' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    grid: darkMode ? '#333333' : '#e0e0e0',
    tooltipBg: darkMode ? '#000000' : '#ffffff',
    tooltipColor: darkMode ? '#ffffff' : '#000000',
    tooltipBorder: darkMode ? '#ffffff' : '#cccccc',
    bar: darkMode ? '#ffffff' : '#000000',
    line: darkMode ? '#ffffff' : '#000000',
    areaGradientFrom: darkMode ? '#ffffff' : '#000000',
    areaGradientTo: darkMode ? '#000000' : '#ffffff',
}); };
// Helper for dates
var getX = function (d) { return new Date(d.day); };
// --- Base Chart Component ---
var BaseChart = function (_a) {
    var width = _a.width, height = _a.height, darkMode = _a.darkMode, title = _a.title, children = _a.children;
    var theme = getTheme(darkMode);
    return (_jsxs("div", { style: { position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }, children: [_jsx("div", { style: {
                    position: 'absolute',
                    top: 4,
                    left: 8,
                    color: theme.text,
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    opacity: 0.8,
                    zIndex: 10
                }, children: title }), _jsxs("svg", { width: width, height: height, children: [_jsx("rect", { width: width, height: height, fill: theme.background }), children] })] }));
};
// --- Activity Chart ---
export var ActivityChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                // Compact Margins
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                // Data Accessors
                var getSteps = function (d) { return d.steps; };
                // Scales
                var xScale = scaleBand({
                    range: [0, xMax],
                    round: true,
                    domain: data.map(function (d) { return d.day; }),
                    padding: 0.2, // Tighter bars
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    round: true,
                    domain: [0, Math.max.apply(Math, data.map(getSteps))],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "STEPS", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8, // Very small font
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), data.map(function (d) {
                                var _a;
                                var day = d.day;
                                var barWidth = xScale.bandwidth();
                                var barHeight = yMax - ((_a = yScale(getSteps(d))) !== null && _a !== void 0 ? _a : 0);
                                var barX = xScale(day);
                                var barY = yMax - barHeight;
                                return (_jsx(Bar, { x: barX, y: barY, width: barWidth, height: barHeight, fill: theme.bar, fillOpacity: 1 }, "bar-".concat(day)));
                            })] }) }));
            } }) }));
};
// --- Readiness Chart ---
export var ReadinessChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getScore = function (d) { return d.score; };
                var xScale = scaleTime({
                    range: [0, xMax],
                    domain: [Math.min.apply(Math, data.map(function (d) { return getX(d).getTime(); })), Math.max.apply(Math, data.map(function (d) { return getX(d).getTime(); }))],
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [40, 100],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "READINESS", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(LinearGradient, { id: "readiness-gradient", from: theme.areaGradientFrom, to: theme.areaGradientTo, toOpacity: 0, fromOpacity: 0.5 }), _jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AreaClosed, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getScore(d) || 0)) !== null && _a !== void 0 ? _a : 0; }, yScale: yScale, strokeWidth: 0, fill: "url(#readiness-gradient)", curve: curveMonotoneX }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getScore(d) || 0)) !== null && _a !== void 0 ? _a : 0; }, stroke: theme.line, strokeWidth: 1, curve: curveMonotoneX }), data.map(function (d, i) { return (_jsx("circle", { cx: xScale(getX(d)), cy: yScale(getScore(d) || 0), r: 1.5, fill: theme.background, stroke: theme.line, strokeWidth: 1 }, i)); })] }) }));
            } }) }));
};
// --- Sleep Chart ---
export var SleepChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getScore = function (d) { return d.score; };
                var xScale = scaleBand({
                    range: [0, xMax],
                    round: true,
                    domain: data.map(function (d) { return d.day; }),
                    padding: 0.2,
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [0, 100],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "SLEEP", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), data.map(function (d) {
                                var _a;
                                var day = d.day;
                                var barWidth = xScale.bandwidth();
                                var barHeight = yMax - ((_a = yScale(getScore(d) || 0)) !== null && _a !== void 0 ? _a : 0);
                                var barX = xScale(day);
                                var barY = yMax - barHeight;
                                return (_jsx(Bar, { x: barX, y: barY, width: barWidth, height: barHeight, fill: theme.bar, fillOpacity: 1 }, "bar-".concat(day)));
                            })] }) }));
            } }) }));
};
// --- Stress Chart ---
export var StressChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getStress = function (d) { return d.stress_high; };
                var xScale = scaleBand({
                    range: [0, xMax],
                    round: true,
                    domain: data.map(function (d) { return d.day; }),
                    padding: 0.2,
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    round: true,
                    domain: [0, Math.max.apply(Math, __spreadArray(__spreadArray([], data.map(getStress), false), [100], false))],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "STRESS (HIGH)", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), data.map(function (d) {
                                var _a;
                                var day = d.day;
                                var barWidth = xScale.bandwidth();
                                var barHeight = yMax - ((_a = yScale(getStress(d))) !== null && _a !== void 0 ? _a : 0);
                                var barX = xScale(day);
                                var barY = yMax - barHeight;
                                return (_jsx(Bar, { x: barX, y: barY, width: barWidth, height: barHeight, fill: theme.bar, fillOpacity: 1 }, "bar-".concat(day)));
                            })] }) }));
            } }) }));
};
// --- SpO2 Chart ---
export var SpO2Chart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getValue = function (d) { var _a; return ((_a = d.spo2_percentage) === null || _a === void 0 ? void 0 : _a.average) || 0; };
                var xScale = scaleTime({
                    range: [0, xMax],
                    domain: [Math.min.apply(Math, data.map(function (d) { return getX(d).getTime(); })), Math.max.apply(Math, data.map(function (d) { return getX(d).getTime(); }))],
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [90, 100],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "SpO2 %", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(LinearGradient, { id: "spo2-gradient", from: theme.areaGradientFrom, to: theme.areaGradientTo, toOpacity: 0, fromOpacity: 0.5 }), _jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AreaClosed, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getValue(d))) !== null && _a !== void 0 ? _a : 0; }, yScale: yScale, strokeWidth: 0, fill: "url(#spo2-gradient)", curve: curveMonotoneX }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getValue(d))) !== null && _a !== void 0 ? _a : 0; }, stroke: theme.line, strokeWidth: 1, curve: curveMonotoneX }), data.map(function (d, i) { return (_jsx("circle", { cx: xScale(getX(d)), cy: yScale(getValue(d)), r: 1.5, fill: theme.background, stroke: theme.line, strokeWidth: 1 }, i)); })] }) }));
            } }) }));
};
// --- Heart Rate Chart ---
export var HeartRateChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getBpm = function (d) { return d.bpm; };
                var getDate = function (d) { return parseISO(d.timestamp); };
                // Need to filter valid dates or ensure data is sorted?
                // For sandbox, data might be sparse.
                var xScale = scaleTime({
                    range: [0, xMax],
                    domain: [Math.min.apply(Math, data.map(function (d) { return getDate(d).getTime(); })) || 0, Math.max.apply(Math, data.map(function (d) { return getDate(d).getTime(); })) || 0],
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [Math.min.apply(Math, data.map(getBpm)) * 0.9, Math.max.apply(Math, data.map(getBpm)) * 1.1],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "HEART RATE", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'HH:mm'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getDate(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getBpm(d))) !== null && _a !== void 0 ? _a : 0; }, stroke: theme.line, strokeWidth: 1, curve: curveMonotoneX })] }) }));
            } }) }));
};
// --- Workout Chart ---
export var WorkoutChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getCalories = function (d) { return d.calories; };
                var xScale = scaleBand({
                    range: [0, xMax],
                    round: true,
                    domain: data.map(function (d) { return d.day; }),
                    padding: 0.2,
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    round: true,
                    domain: [0, Math.max.apply(Math, __spreadArray(__spreadArray([], data.map(getCalories), false), [100], false))],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "WORKOUT CALS", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), data.map(function (d) {
                                var _a;
                                var day = d.day;
                                var barWidth = xScale.bandwidth();
                                var barHeight = yMax - ((_a = yScale(getCalories(d))) !== null && _a !== void 0 ? _a : 0);
                                var barX = xScale(day);
                                var barY = yMax - barHeight;
                                return (_jsx(Bar, { x: barX, y: barY, width: barWidth, height: barHeight, fill: theme.bar, fillOpacity: 1 }, "bar-".concat(day)));
                            })] }) }));
            } }) }));
};
// --- Resilience Chart ---
export var ResilienceChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getContributor = function (d, key) { return d.contributors[key]; };
                var xScale = scaleTime({
                    range: [0, xMax],
                    domain: [Math.min.apply(Math, data.map(function (d) { return getX(d).getTime(); })), Math.max.apply(Math, data.map(function (d) { return getX(d).getTime(); }))],
                });
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [0, 100],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "RESILIENCE", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getContributor(d, 'sleep_recovery'))) !== null && _a !== void 0 ? _a : 0; }, stroke: "#4facfe" // Blue
                                , strokeWidth: 1, curve: curveMonotoneX }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getContributor(d, 'daytime_recovery'))) !== null && _a !== void 0 ? _a : 0; }, stroke: "#00f2fe" // Cyan
                                , strokeWidth: 1, curve: curveMonotoneX }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getContributor(d, 'stress'))) !== null && _a !== void 0 ? _a : 0; }, stroke: "#ff0844" // Red
                                , strokeWidth: 1, curve: curveMonotoneX })] }) }));
            } }) }));
};
// --- Cardiovascular Age Chart ---
export var CardioAgeChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getAge = function (d) { return d.vascular_age || 0; };
                var xScale = scaleTime({
                    range: [0, xMax],
                    domain: [Math.min.apply(Math, data.map(function (d) { return getX(d).getTime(); })), Math.max.apply(Math, data.map(function (d) { return getX(d).getTime(); }))],
                });
                // Dynamic domain for age
                var ages = data.map(getAge).filter(function (a) { return a > 0; });
                var minAge = Math.min.apply(Math, ages);
                var maxAge = Math.max.apply(Math, ages);
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [minAge - 5, maxAge + 5],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "VASCULAR AGE", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getAge(d))) !== null && _a !== void 0 ? _a : 0; }, stroke: theme.line, strokeWidth: 1, curve: curveMonotoneX }), data.map(function (d, i) { return (_jsx("circle", { cx: xScale(getX(d)), cy: yScale(getAge(d)), r: 1.5, fill: theme.background, stroke: theme.line, strokeWidth: 1 }, i)); })] }) }));
            } }) }));
};
// --- VO2 Max Chart ---
export var VO2MaxChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var getValue = function (d) { return d.vo2_max; };
                var xScale = scaleTime({
                    range: [0, xMax],
                    domain: [Math.min.apply(Math, data.map(function (d) { return getX(d).getTime(); })), Math.max.apply(Math, data.map(function (d) { return getX(d).getTime(); }))],
                });
                var values = data.map(getValue);
                var minVal = Math.min.apply(Math, values);
                var maxVal = Math.max.apply(Math, values);
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    domain: [minVal - 5, maxVal + 5],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "VO2 MAX", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getValue(d))) !== null && _a !== void 0 ? _a : 0; }, stroke: "#ff1493", strokeWidth: 2, curve: curveMonotoneX }), data.map(function (d, i) { return (_jsx("circle", { cx: xScale(getX(d)), cy: yScale(getValue(d)), r: 2, fill: theme.background, stroke: "#ff1493", strokeWidth: 1 }, i)); })] }) }));
            } }) }));
};
// --- Sleep Detail Chart (Stacked Durations) ---
export var SleepDetailChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx("div", { style: { width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }, children: _jsx(ParentSize, { children: function (_a) {
                var width = _a.width, height = _a.height;
                if (width < 10 || height < 10)
                    return null;
                var margin = { top: 20, right: 10, bottom: 20, left: 30 };
                var xMax = width - margin.left - margin.right;
                var yMax = height - margin.top - margin.bottom;
                var xScale = scaleBand({
                    range: [0, xMax],
                    round: true,
                    domain: data.map(function (d) { return d.day; }),
                    padding: 0.2,
                });
                // Convert seconds to hours for better readability
                // Stack order: Deep, REM, Light, Awake
                var mm = function (v) { return v / 3600; };
                var yScale = scaleLinear({
                    range: [yMax, 0],
                    round: true,
                    domain: [0, Math.max.apply(Math, data.map(function (d) { return mm(d.total_sleep_duration + d.awake_time); }))],
                });
                return (_jsx(BaseChart, { width: width, height: height, darkMode: darkMode, title: "SLEEP STAGES (HR)", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "1 3", strokeWidth: 0.5 }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'middle',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, numTicks: 4, tickLabelProps: function () { return ({
                                    fill: theme.text,
                                    fontSize: 8,
                                    textAnchor: 'end',
                                    dy: '0.33em',
                                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                                }); } }), data.map(function (d) {
                                var _a;
                                var day = d.day;
                                var x = (_a = xScale(day)) !== null && _a !== void 0 ? _a : 0;
                                var w = xScale.bandwidth();
                                // Calculate heights
                                var deep = mm(d.deep_sleep_duration);
                                var rem = mm(d.rem_sleep_duration);
                                var light = mm(d.light_sleep_duration);
                                var awake = mm(d.awake_time);
                                // Stack bottoms
                                var yLines = [
                                    { h: deep, fill: '#1f77b4' }, // Deep Blue
                                    { h: rem, fill: '#aec7e8' }, // Light Blue
                                    { h: light, fill: '#ffbb78' }, // Light Orange
                                    { h: awake, fill: '#d62728' } // Red (Awake)
                                ];
                                var currentY = yMax;
                                return (_jsx("g", { children: yLines.map(function (item, idx) {
                                        var h = (item.h / (yScale.domain()[1] - yScale.domain()[0])) * yMax;
                                        var y = currentY - h;
                                        currentY = y;
                                        return (_jsx("rect", { x: x, y: y, width: w, height: h, fill: item.fill }, idx));
                                    }) }, "stack-".concat(day)));
                            })] }) }));
            } }) }));
};
// --- Info Cards (Scrollable Lists or Simple Displays) ---
// Using a generic container style that matches the charts
var InfoCardContainer = function (_a) {
    var title = _a.title, darkMode = _a.darkMode, children = _a.children;
    var theme = getTheme(darkMode);
    return (_jsxs("div", { style: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.background,
            color: theme.text,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }, children: [_jsx("div", { style: {
                    position: 'absolute',
                    top: 4,
                    left: 8,
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    opacity: 0.8,
                    zIndex: 10
                }, children: title }), _jsx("div", { style: { marginTop: 20, padding: 10, overflowY: 'auto', flex: 1, fontSize: '11px', fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif' }, children: children })] }));
};
export var RingConfigCard = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    return (_jsxs(InfoCardContainer, { title: "RING CONFIG", darkMode: darkMode, children: [data.map(function (d, i) { return (_jsxs("div", { style: { marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Color:" }), " ", d.color] }), _jsxs("div", { children: [_jsx("strong", { children: "Size:" }), " ", d.size] }), _jsxs("div", { children: [_jsx("strong", { children: "Firmware:" }), " ", d.firmware_version] }), _jsxs("div", { children: [_jsx("strong", { children: "Setup:" }), " ", d.set_up_at.split('T')[0]] })] }, i)); }), data.length === 0 && _jsx("div", { style: { opacity: 0.5 }, children: "No Data" })] }));
};
export var SleepTimeCard = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    return (_jsxs(InfoCardContainer, { title: "SLEEP WINDOWS", darkMode: darkMode, children: [data.map(function (d, i) { return (_jsxs("div", { style: { marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }, children: [_jsx("div", { style: { opacity: 0.7 }, children: d.day }), _jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", d.status] }), d.optimal_bedtime && (_jsxs("div", { children: ["Offset: ", Math.round(d.optimal_bedtime.start_offset / 3600), "h - ", Math.round(d.optimal_bedtime.end_offset / 3600), "h"] })), _jsx("div", { style: { fontSize: '9px', fontStyle: 'italic' }, children: d.recommendation })] }, i)); }), data.length === 0 && _jsx("div", { style: { opacity: 0.5 }, children: "No Data" })] }));
};
export var RestModeCard = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    return (_jsxs(InfoCardContainer, { title: "REST MODE", darkMode: darkMode, children: [data.map(function (d, i) { return (_jsxs("div", { style: { marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }, children: [_jsxs("div", { children: [d.start_day, " -> ", d.end_day || 'Ongoing'] }), d.episodes.map(function (ep, k) { return (_jsxs("div", { style: { paddingLeft: 4, fontSize: '9px' }, children: ["- ", ep.tags.join(', ')] }, k)); })] }, i)); }), data.length === 0 && _jsx("div", { style: { opacity: 0.5 }, children: "No Rest Modes Active" })] }));
};
export var SimpleListCard = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b, title = _a.title, renderItem = _a.renderItem;
    return (_jsxs(InfoCardContainer, { title: title, darkMode: darkMode, children: [data.map(function (d, i) { return (_jsx("div", { style: { marginBottom: 6, borderBottom: '1px solid #333', paddingBottom: 2 }, children: renderItem(d) }, i)); }), data.length === 0 && _jsx("div", { style: { opacity: 0.5 }, children: "No Data" })] }));
};
