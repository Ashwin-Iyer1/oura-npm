export interface OuraAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  state?: string;
  responseType?: 'token' | 'code';
}

export const OURA_AUTH_URL = 'https://cloud.ouraring.com/oauth/authorize';

export const getOuraAuthUrl = ({ 
  clientId, 
  redirectUri, 
  scopes = ['daily', 'personal'], 
  state = 'oura-stats-auth',
  responseType = 'token'
}: OuraAuthConfig): string => {
  const params = new URLSearchParams({
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state: state
  });

  return `${OURA_AUTH_URL}?${params.toString()}`;
};

export interface AuthResult {
  accessToken: string;
  expiresIn: number;
  scope: string;
  state: string;
  tokenType: string;
}

export const parseAuthCallback = (hash: string): AuthResult | null => {
  if (!hash) return null;
  
  // Remove leading # if present
  const queryString = hash.startsWith('#') ? hash.substring(1) : hash;
  const params = new URLSearchParams(queryString);
  
  const accessToken = params.get('access_token');
  
  if (!accessToken) return null;

  return {
    accessToken,
    expiresIn: parseInt(params.get('expires_in') || '0', 10),
    scope: params.get('scope') || '',
    state: params.get('state') || '',
    tokenType: params.get('token_type') || ''
  };
};
