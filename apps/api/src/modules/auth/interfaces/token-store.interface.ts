export interface TokenStore {
  allow(userId: string, token: string, exp?: number): Promise<void>;
  isAllowed(userId: string, token: string): Promise<boolean>;
  revoke(userId: string, token: string): Promise<void>;
  blacklist(token: string, exp?: number, userId?: string): Promise<void>;
}

export const TOKEN_STORE = 'TOKEN_STORE';
