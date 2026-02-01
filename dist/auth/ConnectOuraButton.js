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
import { jsx as _jsx } from "react/jsx-runtime";
import { getOuraAuthUrl } from './utils';
export var ConnectOuraButton = function (_a) {
    var clientId = _a.clientId, redirectUri = _a.redirectUri, scopes = _a.scopes, state = _a.state, responseType = _a.responseType, className = _a.className, style = _a.style, children = _a.children;
    var handleLogin = function () {
        var url = getOuraAuthUrl({ clientId: clientId, redirectUri: redirectUri, scopes: scopes, state: state, responseType: responseType });
        window.location.href = url;
    };
    return (_jsx("button", { onClick: handleLogin, className: className, style: __assign({ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }, style), children: children || 'Connect Oura Ring' }));
};
