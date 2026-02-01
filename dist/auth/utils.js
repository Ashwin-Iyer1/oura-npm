export var OURA_AUTH_URL = 'https://cloud.ouraring.com/oauth/authorize';
export var getOuraAuthUrl = function (_a) {
    var clientId = _a.clientId, redirectUri = _a.redirectUri, _b = _a.scopes, scopes = _b === void 0 ? ['daily', 'personal'] : _b, _c = _a.state, state = _c === void 0 ? 'oura-stats-auth' : _c, _d = _a.responseType, responseType = _d === void 0 ? 'token' : _d;
    var params = new URLSearchParams({
        response_type: responseType,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
        state: state
    });
    return "".concat(OURA_AUTH_URL, "?").concat(params.toString());
};
export var parseAuthCallback = function (hash) {
    if (!hash)
        return null;
    // Remove leading # if present
    var queryString = hash.startsWith('#') ? hash.substring(1) : hash;
    var params = new URLSearchParams(queryString);
    var accessToken = params.get('access_token');
    if (!accessToken)
        return null;
    return {
        accessToken: accessToken,
        expiresIn: parseInt(params.get('expires_in') || '0', 10),
        scope: params.get('scope') || '',
        state: params.get('state') || '',
        tokenType: params.get('token_type') || ''
    };
};
