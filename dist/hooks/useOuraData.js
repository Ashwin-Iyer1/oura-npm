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
import { useState, useEffect } from 'react';
import axios from 'axios';
export var useOuraData = function (_a) {
    var accessToken = _a.accessToken, startDate = _a.startDate, endDate = _a.endDate, _b = _a.useSandbox, useSandbox = _b === void 0 ? true : _b, baseUrl = _a.baseUrl;
    var _c = useState(null), data = _c[0], setData = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var headers, params, heartRateParams, finalBaseUrl, _a, activityRes, readinessRes, sleepRes, stressRes, spo2Res, resilienceRes, cardioAgeRes, heartRateRes, sleepDocRes, sleepTimeRes, sessionRes, workoutRes, tagRes, enhancedTagRes, restModeRes, ringConfigRes, vo2MaxRes, err_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!accessToken)
                            return [2 /*return*/];
                        setLoading(true);
                        setError(null);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 4, 5]);
                        headers = { Authorization: "Bearer ".concat(accessToken) };
                        params = { start_date: startDate, end_date: endDate };
                        heartRateParams = {
                            start_datetime: "".concat(startDate, "T00:00:00"),
                            end_datetime: "".concat(endDate, "T23:59:59")
                        };
                        finalBaseUrl = baseUrl || (useSandbox
                            ? 'https://api.ouraring.com/v2/sandbox/usercollection'
                            : 'https://api.ouraring.com/v2/usercollection');
                        return [4 /*yield*/, Promise.all([
                                axios.get("".concat(finalBaseUrl, "/daily_activity"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/daily_readiness"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/daily_sleep"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/daily_stress"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/daily_spo2"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/daily_resilience"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/daily_cardiovascular_age"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/heartrate"), { headers: headers, params: heartRateParams }),
                                axios.get("".concat(finalBaseUrl, "/sleep"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/sleep_time"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/session"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/workout"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/tag"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/enhanced_tag"), { headers: headers, params: params }),
                                axios.get("".concat(finalBaseUrl, "/rest_mode_period"), { headers: headers, params: params }),
                                // ring_configuration is not available in sandbox
                                !useSandbox
                                    ? axios.get("".concat(finalBaseUrl, "/ring_configuration"), { headers: headers, params: params })
                                    : Promise.resolve({ data: { data: [] } }),
                                axios.get("".concat(finalBaseUrl, "/vO2_max"), { headers: headers, params: params })
                            ])];
                    case 2:
                        _a = _c.sent(), activityRes = _a[0], readinessRes = _a[1], sleepRes = _a[2], stressRes = _a[3], spo2Res = _a[4], resilienceRes = _a[5], cardioAgeRes = _a[6], heartRateRes = _a[7], sleepDocRes = _a[8], sleepTimeRes = _a[9], sessionRes = _a[10], workoutRes = _a[11], tagRes = _a[12], enhancedTagRes = _a[13], restModeRes = _a[14], ringConfigRes = _a[15], vo2MaxRes = _a[16];
                        setData({
                            activity: activityRes.data.data,
                            readiness: readinessRes.data.data,
                            sleep: sleepRes.data.data,
                            daily_stress: stressRes.data.data,
                            daily_spo2: spo2Res.data.data,
                            daily_resilience: resilienceRes.data.data,
                            daily_cardiovascular_age: cardioAgeRes.data.data,
                            heart_rate: heartRateRes.data.data,
                            sleep_documents: sleepDocRes.data.data,
                            sleep_time: sleepTimeRes.data.data,
                            session: sessionRes.data.data,
                            workout: workoutRes.data.data,
                            tag: tagRes.data.data,
                            enhanced_tag: enhancedTagRes.data.data,
                            rest_mode_period: restModeRes.data.data,
                            ring_configuration: ringConfigRes.data.data,
                            vo2_max: vo2MaxRes.data.data
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _c.sent();
                        setError(err_1.message || 'Failed to fetch Oura data');
                        console.error('Oura API Error:', ((_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data) || err_1.message);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [accessToken, startDate, endDate, useSandbox, baseUrl]);
    return { data: data, loading: loading, error: error };
};
