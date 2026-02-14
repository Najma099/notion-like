import { Request } from 'express';
import { AuthUser } from './user';
import { Keystore } from '@prisma/client';

export interface ProtectedRequest extends Request {
    pageId: number;
    workspaceId: number;
    userRole: string;
    user: AuthUser;
    keystore: Keystore;
    accessToken: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken?: string; 
}
