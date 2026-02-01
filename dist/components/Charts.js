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
    return (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("h3", { style: {
                    textAlign: 'left',
                    marginBottom: 20,
                    color: theme.text,
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '16px',
                    fontWeight: 'normal',
                    borderBottom: "1px solid ".concat(darkMode ? '#333' : '#eee'),
                    paddingBottom: '10px'
                }, children: title }), _jsxs("svg", { width: width, height: height, children: [_jsx("rect", { width: width, height: height, fill: theme.background }), children] })] }));
};
// --- Activity Chart ---
export var ActivityChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx(ParentSize, { children: function (_a) {
            var width = _a.width, height = _a.height;
            if (width < 10)
                return null;
            // Margins
            var margin = { top: 20, right: 30, bottom: 40, left: 50 };
            var xMax = width - margin.left - margin.right;
            var yMax = height - margin.top - margin.bottom;
            // Data Accessors
            var getSteps = function (d) { return d.steps; };
            // Scales
            var xScale = scaleBand({
                range: [0, xMax],
                round: true,
                domain: data.map(function (d) { return d.day; }),
                padding: 0.4,
            });
            var yScale = scaleLinear({
                range: [yMax, 0],
                round: true,
                domain: [0, Math.max.apply(Math, data.map(getSteps))],
            });
            return (_jsx(BaseChart, { width: width, height: 350, darkMode: darkMode, title: "Steps (Activity)", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "2 2" }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                fill: theme.text,
                                fontSize: 10,
                                textAnchor: 'middle',
                                fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                            }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                fill: theme.text,
                                fontSize: 10,
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
                            return (_jsx(Bar, { x: barX, y: barY, width: barWidth, height: barHeight, fill: theme.bar, fillOpacity: 0.9 }, "bar-".concat(day)));
                        })] }) }));
        } }));
};
// --- Readiness Chart ---
export var ReadinessChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx(ParentSize, { children: function (_a) {
            var width = _a.width, height = _a.height;
            if (width < 10)
                return null;
            var margin = { top: 20, right: 30, bottom: 40, left: 50 };
            var xMax = width - margin.left - margin.right;
            var yMax = height - margin.top - margin.bottom;
            var getScore = function (d) { return d.score; };
            var xScale = scaleTime({
                range: [0, xMax],
                domain: [Math.min.apply(Math, data.map(function (d) { return getX(d).getTime(); })), Math.max.apply(Math, data.map(function (d) { return getX(d).getTime(); }))],
            });
            var yScale = scaleLinear({
                range: [yMax, 0],
                domain: [40, 100], // Readiness usually 0-100, but zoomed in looks better
            });
            return (_jsx(BaseChart, { width: width, height: 350, darkMode: darkMode, title: "Readiness Score", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(LinearGradient, { id: "area-gradient", from: theme.areaGradientFrom, to: theme.areaGradientTo, toOpacity: 0, fromOpacity: 0.2 }), _jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "2 2" }), _jsx(AxisBottom, { top: yMax, scale: xScale, numTicks: 5, tickFormat: function (d) { return format(d, 'MMM dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                fill: theme.text,
                                fontSize: 10,
                                textAnchor: 'middle',
                                fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                            }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                fill: theme.text,
                                fontSize: 10,
                                textAnchor: 'end',
                                dy: '0.33em',
                                fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                            }); } }), _jsx(AreaClosed, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getScore(d) || 0)) !== null && _a !== void 0 ? _a : 0; }, yScale: yScale, strokeWidth: 0, fill: "url(#area-gradient)", curve: curveMonotoneX }), _jsx(LinePath, { data: data, x: function (d) { var _a; return (_a = xScale(getX(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getScore(d) || 0)) !== null && _a !== void 0 ? _a : 0; }, stroke: theme.line, strokeWidth: 1.5, curve: curveMonotoneX }), data.map(function (d, i) { return (_jsx("circle", { cx: xScale(getX(d)), cy: yScale(getScore(d) || 0), r: 3, fill: theme.background, stroke: theme.line, strokeWidth: 1.5 }, i)); })] }) }));
        } }));
};
// --- Sleep Chart ---
export var SleepChart = function (_a) {
    var data = _a.data, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
    var theme = getTheme(darkMode);
    return (_jsx(ParentSize, { children: function (_a) {
            var width = _a.width, height = _a.height;
            if (width < 10)
                return null;
            var margin = { top: 20, right: 30, bottom: 40, left: 50 };
            var xMax = width - margin.left - margin.right;
            var yMax = height - margin.top - margin.bottom;
            var getScore = function (d) { return d.score; };
            var xScale = scaleBand({
                range: [0, xMax],
                round: true,
                domain: data.map(function (d) { return d.day; }),
                padding: 0.4,
            });
            var yScale = scaleLinear({
                range: [yMax, 0],
                domain: [0, 100],
            });
            return (_jsx(BaseChart, { width: width, height: 350, darkMode: darkMode, title: "Sleep Score", children: _jsxs(Group, { left: margin.left, top: margin.top, children: [_jsx(GridRows, { scale: yScale, width: xMax, height: yMax, stroke: theme.grid, strokeDasharray: "2 2" }), _jsx(AxisBottom, { top: yMax, scale: xScale, tickFormat: function (d) { return format(parseISO(d), 'dd'); }, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                fill: theme.text,
                                fontSize: 10,
                                textAnchor: 'middle',
                                fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                            }); } }), _jsx(AxisLeft, { scale: yScale, stroke: theme.text, tickStroke: theme.text, tickLabelProps: function () { return ({
                                fill: theme.text,
                                fontSize: 10,
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
                            return (_jsx(Bar, { x: barX, y: barY, width: barWidth, height: barHeight, fill: theme.bar, fillOpacity: 0.8, rx: 2 }, "bar-".concat(day)));
                        })] }) }));
        } }));
};
