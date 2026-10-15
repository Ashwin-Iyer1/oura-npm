var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
export var COLLECTION_ENDPOINTS = {
    activity: 'daily_activity', readiness: 'daily_readiness', sleep: 'daily_sleep',
    daily_stress: 'daily_stress', daily_spo2: 'daily_spo2', daily_resilience: 'daily_resilience',
    daily_cardiovascular_age: 'daily_cardiovascular_age', heart_rate: 'heartrate',
    sleep_documents: 'sleep', sleep_time: 'sleep_time', session: 'session', workout: 'workout',
    tag: 'tag', enhanced_tag: 'enhanced_tag', rest_mode_period: 'rest_mode_period',
    ring_configuration: 'ring_configuration', vo2_max: 'vO2_max',
};
export function emptyOuraData() {
    return Object.fromEntries(Object.keys(COLLECTION_ENDPOINTS).map(function (key) { return [key, []]; }));
}
function validDay(day) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
        return false;
    var date = new Date("".concat(day, "T00:00:00Z"));
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}
export function validateDateRange(start, end) {
    if (!validDay(start) || !validDay(end))
        throw new Error('Use valid dates in YYYY-MM-DD format.');
    if (start > end)
        throw new Error('The start date must be on or before the end date.');
}
function abortError() { var error = new Error('The request was canceled.'); error.name = 'AbortError'; return error; }
/** Fetch complete collections independently. One denied scope cannot erase successful data. */
export function fetchOuraData(options) {
    return __awaiter(this, void 0, void 0, function () {
        var useSandbox, baseUrl, fetchImpl, collections, _i, collections_1, key, data, errors;
        var _this = this;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    validateDateRange(options.startDate, options.endDate);
                    if ((_a = options.signal) === null || _a === void 0 ? void 0 : _a.aborted)
                        throw abortError();
                    useSandbox = (_b = options.useSandbox) !== null && _b !== void 0 ? _b : true;
                    baseUrl = (options.baseUrl || "https://api.ouraring.com/v2/".concat(useSandbox ? 'sandbox/' : '', "usercollection")).replace(/\/$/, '');
                    fetchImpl = options.fetchImpl || fetch;
                    collections = Array.from(new Set(options.collections || Object.keys(COLLECTION_ENDPOINTS)));
                    for (_i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
                        key = collections_1[_i];
                        if (!Object.prototype.hasOwnProperty.call(COLLECTION_ENDPOINTS, key))
                            throw new Error("Unknown Oura collection: ".concat(key));
                    }
                    data = emptyOuraData();
                    errors = {};
                    return [4 /*yield*/, Promise.all(collections.map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                            var controller, abort, timer, params, items, seenTokens, pages, response, body, next, error_1;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (key === 'ring_configuration' && useSandbox)
                                            return [2 /*return*/];
                                        controller = new AbortController();
                                        abort = function () { return controller.abort(); };
                                        (_a = options.signal) === null || _a === void 0 ? void 0 : _a.addEventListener('abort', abort, { once: true });
                                        if ((_b = options.signal) === null || _b === void 0 ? void 0 : _b.aborted)
                                            abort();
                                        timer = setTimeout(abort, (_c = options.timeoutMs) !== null && _c !== void 0 ? _c : 15000);
                                        _f.label = 1;
                                    case 1:
                                        _f.trys.push([1, 7, 8, 9]);
                                        params = new URLSearchParams();
                                        if (key === 'heart_rate') {
                                            params.set('start_datetime', "".concat(options.startDate, "T00:00:00Z"));
                                            params.set('end_datetime', "".concat(options.endDate, "T23:59:59Z"));
                                        }
                                        else if (key !== 'ring_configuration') {
                                            params.set('start_date', options.startDate);
                                            params.set('end_date', options.endDate);
                                        }
                                        items = [];
                                        seenTokens = new Set();
                                        pages = 0;
                                        _f.label = 2;
                                    case 2:
                                        if (controller.signal.aborted)
                                            throw abortError();
                                        return [4 /*yield*/, fetchImpl("".concat(baseUrl, "/").concat(COLLECTION_ENDPOINTS[key], "?").concat(params), {
                                                headers: options.accessToken ? { Authorization: "Bearer ".concat(options.accessToken) } : {},
                                                signal: controller.signal,
                                            })];
                                    case 3:
                                        response = _f.sent();
                                        if (!response.ok)
                                            throw new Error("Request failed (HTTP ".concat(response.status, ")."));
                                        return [4 /*yield*/, response.json()];
                                    case 4:
                                        body = _f.sent();
                                        if (!body || typeof body !== 'object' || !('data' in body) || !Array.isArray(body.data))
                                            throw new Error('The collection response is not a data array.');
                                        items.push.apply(items, body.data);
                                        next = 'next_token' in body ? body.next_token : undefined;
                                        if (next === null || next === undefined || next === '')
                                            return [3 /*break*/, 6];
                                        if (typeof next !== 'string' || seenTokens.has(next) || ++pages >= 100)
                                            throw new Error('Pagination did not complete safely.');
                                        seenTokens.add(next);
                                        params.set('next_token', next);
                                        _f.label = 5;
                                    case 5: return [3 /*break*/, 2];
                                    case 6:
                                        data[key] = items;
                                        return [3 /*break*/, 9];
                                    case 7:
                                        error_1 = _f.sent();
                                        if ((_d = options.signal) === null || _d === void 0 ? void 0 : _d.aborted)
                                            return [2 /*return*/];
                                        errors[key] = controller.signal.aborted ? 'The collection request timed out.' : error_1 instanceof Error ? error_1.message : 'The collection request failed.';
                                        return [3 /*break*/, 9];
                                    case 8:
                                        clearTimeout(timer);
                                        (_e = options.signal) === null || _e === void 0 ? void 0 : _e.removeEventListener('abort', abort);
                                        return [7 /*endfinally*/];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _d.sent();
                    if ((_c = options.signal) === null || _c === void 0 ? void 0 : _c.aborted)
                        throw abortError();
                    return [2 /*return*/, { data: data, errors: errors }];
            }
        });
    });
}
