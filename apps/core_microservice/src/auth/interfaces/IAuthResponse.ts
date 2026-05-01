export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email?: string | null;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    accountState: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
    suspendedUntil?: string | null;
    escalationLevel?: number;
  };
}
