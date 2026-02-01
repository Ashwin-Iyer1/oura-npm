import React from 'react';
import { getOuraAuthUrl, OuraAuthConfig } from './utils';

interface ConnectOuraButtonProps extends OuraAuthConfig {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ConnectOuraButton: React.FC<ConnectOuraButtonProps> = ({ 
  clientId, 
  redirectUri, 
  scopes, 
  state,
  responseType,
  className,
  style,
  children 
}) => {
  const handleLogin = () => {
    const url = getOuraAuthUrl({ clientId, redirectUri, scopes, state, responseType });
    window.location.href = url;
  };

  return (
    <button 
      onClick={handleLogin}
      className={className}
      style={{
        padding: '10px 20px',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        ...style
      }}
    >
      {children || 'Connect Oura Ring'}
    </button>
  );
};
