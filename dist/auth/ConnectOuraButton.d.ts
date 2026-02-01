import React from 'react';
import { OuraAuthConfig } from './utils';
interface ConnectOuraButtonProps extends OuraAuthConfig {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const ConnectOuraButton: React.FC<ConnectOuraButtonProps>;
export {};
