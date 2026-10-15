var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useId, useState } from 'react';
/** Responsive SVG with truthful gaps and an equivalent keyboard date inspector. */
export function TimeSeriesChart(_a) {
    var _b, _c;
    var data = _a.data, label = _a.label, _d = _a.unit, unit = _d === void 0 ? '' : _d, domain = _a.domain, _e = _a.color, color = _e === void 0 ? '#688b7a' : _e, _f = _a.darkMode, darkMode = _f === void 0 ? false : _f, _g = _a.formatValue, formatValue = _g === void 0 ? function (value) { return value.toFixed(0); } : _g;
    var id = useId();
    var _h = useState(null), selected = _h[0], setSelected = _h[1];
    var valid = data.filter(function (point) { return point.value !== null && Number.isFinite(point.value); });
    var minimum = (_b = domain === null || domain === void 0 ? void 0 : domain[0]) !== null && _b !== void 0 ? _b : 0;
    var maximum = (_c = domain === null || domain === void 0 ? void 0 : domain[1]) !== null && _c !== void 0 ? _c : Math.max.apply(Math, __spreadArray([1], valid.map(function (point) { return point.value; }), false)) * 1.1;
    var width = 900, height = 280, left = 44, right = 18, top = 18, bottom = 34;
    var x = function (index) { return left + (data.length <= 1 ? (width - left - right) / 2 : index / (data.length - 1) * (width - left - right)); };
    var y = function (value) { return top + (1 - (value - minimum) / Math.max(1, maximum - minimum)) * (height - top - bottom); };
    var index = Math.min(selected !== null && selected !== void 0 ? selected : data.length - 1, data.length - 1);
    var point = data[index];
    var ink = darkMode ? '#dce5e3' : '#334947';
    var muted = darkMode ? '#9caeab' : '#657d76';
    var grid = darkMode ? '#293c39' : '#dce5df';
    var path = '', connected = false;
    data.forEach(function (point, index) {
        if (point.value === null || !Number.isFinite(point.value)) {
            connected = false;
            return;
        }
        path += "".concat(connected ? 'L' : 'M').concat(x(index).toFixed(2), ",").concat(y(point.value).toFixed(2), " ");
        connected = true;
    });
    var formatDay = function (day) { return new Date("".concat(day, "T12:00:00Z")).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); };
    if (!valid.length)
        return _jsxs("p", { role: "status", style: { padding: 32, color: muted }, children: ["No observations available for ", label.toLowerCase(), " in this range."] });
    return _jsxs("div", { style: { color: ink, width: '100%' }, children: [_jsxs("svg", { viewBox: "0 0 ".concat(width, " ").concat(height), style: { width: '100%', display: 'block', overflow: 'visible' }, role: "img", "aria-labelledby": "".concat(id, "-title ").concat(id, "-desc"), onPointerMove: function (event) {
                    var rect = event.currentTarget.getBoundingClientRect();
                    var relative = (event.clientX - rect.left) / rect.width * width;
                    setSelected(Math.max(0, Math.min(data.length - 1, Math.round((relative - left) / (width - left - right) * (data.length - 1)))));
                }, children: [_jsx("title", { id: "".concat(id, "-title"), children: "".concat(label, " over ").concat(data.length, " days") }), _jsx("desc", { id: "".concat(id, "-desc"), children: "Gaps indicate missing observations. Use the date slider below to inspect each value." }), [0, 1, 2, 3, 4].map(function (step) { var value = minimum + (maximum - minimum) * step / 4; return _jsxs("g", { children: [_jsx("line", { x1: left, x2: width - right, y1: y(value), y2: y(value), stroke: grid, strokeDasharray: "3 5" }), _jsx("text", { x: left - 10, y: y(value) + 4, textAnchor: "end", fill: muted, fontSize: 11, children: formatValue(value) })] }, step); }), _jsx("path", { d: path, stroke: color, fill: "none", strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" }), data.map(function (point, pointIndex) { return point.value !== null && Number.isFinite(point.value) ? _jsx("circle", { cx: x(pointIndex), cy: y(point.value), r: pointIndex === index ? 5 : data.length <= 14 ? 2.5 : 0, fill: color }, point.day) : null; }), point && _jsx("line", { x1: x(index), x2: x(index), y1: top, y2: height - bottom, stroke: muted, strokeDasharray: "3 5", opacity: .6 }), [0, Math.floor((data.length - 1) / 2), data.length - 1].filter(function (value, index, all) { return all.indexOf(value) === index; }).map(function (tick) { return _jsx("text", { x: x(tick), y: height - 9, fill: muted, fontSize: 11, textAnchor: tick === 0 ? 'start' : tick === data.length - 1 ? 'end' : 'middle', children: formatDay(data[tick].day) }, tick); })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 12, marginTop: 12 }, children: [_jsx("label", { htmlFor: "".concat(id, "-inspect"), children: "Inspect a day" }), _jsx("input", { id: "".concat(id, "-inspect"), type: "range", min: 0, max: Math.max(0, data.length - 1), value: Math.max(0, index), onChange: function (event) { return setSelected(Number(event.target.value)); }, "aria-valuetext": point ? "".concat(formatDay(point.day), ": ").concat(point.value === null ? 'No observation' : "".concat(formatValue(point.value), " ").concat(unit)) : 'No data', style: { accentColor: color, flex: '1 1 140px', maxWidth: 260 } }), _jsx("output", { htmlFor: "".concat(id, "-inspect"), style: { marginLeft: 'auto', color: muted }, children: point ? "".concat(formatDay(point.day), " \u00B7 ").concat(point.value === null ? 'No observation' : "".concat(formatValue(point.value), " ").concat(unit)) : 'No data' })] })] });
}
