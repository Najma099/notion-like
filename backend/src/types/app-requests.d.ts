import { Request } from 'express';
import { AuthUser } from './user';

export interface ProtectedRequest extends Request {
    user: AuthUser;
    accessToken?: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken?: string; 
}
