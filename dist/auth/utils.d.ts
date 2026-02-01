export interface OuraAuthConfig {
    clientId: string;
    redirectUri: string;
    scopes?: string[];
    state?: string;
    responseType?: 'token' | 'code';
}
export declare const OURA_AUTH_URL = "https://cloud.ouraring.com/oauth/authorize";
export declare const getOuraAuthUrl: ({ clientId, redirectUri, scopes, state, responseType }: OuraAuthConfig) => string;
export interface AuthResult {
    accessToken: string;
    expiresIn: number;
    scope: string;
    state: string;
    tokenType: string;
}
export declare const parseAuthCallback: (hash: string) => AuthResult | null;
