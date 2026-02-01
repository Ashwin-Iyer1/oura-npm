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
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
var THEME = {
    light: {
        textColor: '#666',
        gridColor: 'rgba(0, 0, 0, 0.05)',
        tooltipBg: 'rgba(255, 255, 255, 0.9)',
        tooltipText: '#333',
        borderColor: '#e5e5e5',
        colors: {
            primary: 'rgba(136, 132, 216, 0.5)',
            primaryBorder: 'rgb(136, 132, 216)',
            secondary: 'rgba(130, 202, 157, 0.5)',
            secondaryBorder: 'rgb(130, 202, 157)',
            accent: 'rgba(255, 115, 0, 0.2)',
            accentBorder: 'rgb(255, 115, 0)',
        }
    },
    dark: {
        textColor: '#a0a0a0',
        gridColor: '#333',
        tooltipBg: '#050505',
        tooltipText: '#00ff9d',
        borderColor: '#333',
        colors: {
            primary: 'rgba(0, 243, 255, 0.2)', // Neon Cyan
            primaryBorder: '#00f3ff',
            secondary: 'rgba(0, 255, 157, 0.2)', // Neon Green
            secondaryBorder: '#00ff9d',
            accent: 'rgba(255, 0, 85, 0.2)', // Neon Pink
            accentBorder: '#ff0055',
        }
    }
};
var getCommonOptions = function (darkMode) {
    var theme = darkMode ? THEME.dark : THEME.light;
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme.textColor,
                    font: {
                        family: darkMode ? '"Courier New", Courier, monospace' : undefined
                    }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: theme.tooltipBg,
                titleColor: theme.tooltipText,
                bodyColor: theme.tooltipText,
                borderColor: theme.borderColor,
                borderWidth: 1,
                titleFont: {
                    family: darkMode ? '"Courier New", Courier, monospace' : undefined
                },
                bodyFont: {
                    family: darkMode ? '"Courier New", Courier, monospace' : undefined
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: theme.textColor,
                    font: {
                        family: darkMode ? '"Courier New", Courier, monospace' : undefined
                    }
                }
            },
            y: {
                grid: {
                    color: theme.gridColor,
                    tickBorderDash: darkMode ? [5, 5] : [],
                },
                ticks: {
                    color: theme.textColor,
                    font: {
                        family: darkMode ? '"Courier New", Courier, monospace' : undefined
                    }
                },
                border: {
                    dash: darkMode ? [5, 5] : [],
                    color: theme.borderColor
                }
            }
        }
    };
};
export var ActivityChart = function (_a) {
    var _b;
    var data = _a.data, _c = _a.darkMode, darkMode = _c === void 0 ? false : _c;
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return new Date(a.day).getTime() - new Date(b.day).getTime(); });
    var theme = darkMode ? THEME.dark : THEME.light;
    var chartData = {
        labels: sortedData.map(function (d) { return format(parseISO(d.day), 'MMM d'); }),
        datasets: [
            {
                type: 'bar',
                label: 'Steps',
                data: sortedData.map(function (d) { return d.steps; }),
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primaryBorder,
                borderWidth: 1,
                yAxisID: 'y',
                order: 2,
            },
            {
                type: 'line',
                label: 'Active Calories',
                data: sortedData.map(function (d) { return d.active_calories; }),
                borderColor: theme.colors.secondaryBorder,
                backgroundColor: theme.colors.secondary,
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y1',
                order: 1,
                pointBackgroundColor: theme.colors.secondaryBorder,
                pointBorderColor: '#000',
            },
        ],
    };
    var options = __assign(__assign({}, getCommonOptions(darkMode)), { scales: __assign(__assign({}, getCommonOptions(darkMode).scales), { y: __assign(__assign({}, (_b = getCommonOptions(darkMode).scales) === null || _b === void 0 ? void 0 : _b.y), { type: 'linear', display: true, position: 'left' }), y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: theme.textColor,
                    font: {
                        family: darkMode ? '"Courier New", Courier, monospace' : undefined
                    }
                },
                border: {
                    display: false // hide right border
                }
            } }) });
    return (_jsxs("div", { style: { width: '100%', height: 350, padding: '10px' }, children: [_jsx("h3", { style: {
                    marginBottom: 10,
                    textAlign: 'center',
                    color: theme.textColor,
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : undefined,
                    textTransform: darkMode ? 'uppercase' : 'none',
                    letterSpacing: darkMode ? '2px' : 'normal'
                }, children: "Activity Trends" }), _jsx("div", { style: { position: 'relative', height: '300px' }, children: _jsx(Chart, { type: 'bar', data: chartData, options: options }) })] }));
};
export var ReadinessChart = function (_a) {
    var _b;
    var data = _a.data, _c = _a.darkMode, darkMode = _c === void 0 ? false : _c;
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return new Date(a.day).getTime() - new Date(b.day).getTime(); });
    var theme = darkMode ? THEME.dark : THEME.light;
    var chartData = {
        labels: sortedData.map(function (d) { return format(parseISO(d.day), 'MMM d'); }),
        datasets: [
            {
                label: 'Readiness Score',
                data: sortedData.map(function (d) { return d.score; }),
                borderColor: theme.colors.accentBorder,
                backgroundColor: function (context) {
                    var ctx = context.chart.ctx;
                    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    if (darkMode) {
                        gradient.addColorStop(0, 'rgba(255, 0, 85, 0.5)');
                        gradient.addColorStop(1, 'rgba(255, 0, 85, 0)');
                    }
                    else {
                        gradient.addColorStop(0, 'rgba(255, 115, 0, 0.2)');
                        gradient.addColorStop(1, 'rgba(255, 115, 0, 0)');
                    }
                    return gradient;
                },
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: theme.colors.accentBorder,
                pointBorderColor: darkMode ? '#000' : '#fff',
            },
        ],
    };
    var options = __assign(__assign({}, getCommonOptions(darkMode)), { scales: __assign(__assign({}, getCommonOptions(darkMode).scales), { y: __assign(__assign({}, (_b = getCommonOptions(darkMode).scales) === null || _b === void 0 ? void 0 : _b.y), { min: 40, max: 100 }) }) });
    return (_jsxs("div", { style: { width: '100%', height: 350, padding: '10px' }, children: [_jsx("h3", { style: {
                    marginBottom: 10,
                    textAlign: 'center',
                    color: theme.textColor,
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : undefined,
                    textTransform: darkMode ? 'uppercase' : 'none',
                    letterSpacing: darkMode ? '2px' : 'normal'
                }, children: "Readiness Score" }), _jsx("div", { style: { position: 'relative', height: '300px' }, children: _jsx(Line, { data: chartData, options: options }) })] }));
};
export var SleepChart = function (_a) {
    var _b;
    var data = _a.data, _c = _a.darkMode, darkMode = _c === void 0 ? false : _c;
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return new Date(a.day).getTime() - new Date(b.day).getTime(); });
    var theme = darkMode ? THEME.dark : THEME.light;
    var chartData = {
        labels: sortedData.map(function (d) { return format(parseISO(d.day), 'MMM d'); }),
        datasets: [
            {
                type: 'bar',
                label: 'Sleep Score',
                data: sortedData.map(function (d) { return d.score; }),
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primaryBorder,
                borderWidth: 1,
                yAxisID: 'y',
                order: 2,
            },
            {
                type: 'line',
                label: 'Total Sleep (h)',
                data: sortedData.map(function (d) { return d.contributors.total_sleep ? (d.contributors.total_sleep / 3600) : 0; }),
                borderColor: theme.colors.secondaryBorder,
                backgroundColor: theme.colors.secondary,
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y1',
                order: 1,
                pointBackgroundColor: theme.colors.secondaryBorder,
                pointBorderColor: darkMode ? '#000' : '#fff',
            },
        ],
    };
    var options = __assign(__assign({}, getCommonOptions(darkMode)), { scales: __assign(__assign({}, getCommonOptions(darkMode).scales), { y: __assign({ type: 'linear', display: true, position: 'left', min: 0, max: 100 }, (_b = getCommonOptions(darkMode).scales) === null || _b === void 0 ? void 0 : _b.y), y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Hours',
                    color: theme.textColor,
                    font: {
                        family: darkMode ? '"Courier New", Courier, monospace' : undefined
                    }
                },
                ticks: {
                    color: theme.textColor,
                    font: {
                        family: darkMode ? '"Courier New", Courier, monospace' : undefined
                    }
                },
                border: {
                    display: false
                }
            } }) });
    return (_jsxs("div", { style: { width: '100%', height: 350, padding: '10px' }, children: [_jsx("h3", { style: {
                    marginBottom: 10,
                    textAlign: 'center',
                    color: theme.textColor,
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : undefined,
                    textTransform: darkMode ? 'uppercase' : 'none',
                    letterSpacing: darkMode ? '2px' : 'normal'
                }, children: "Sleep Score & Duration" }), _jsx("div", { style: { position: 'relative', height: '300px' }, children: _jsx(Chart, { type: 'bar', data: chartData, options: options }) })] }));
};
