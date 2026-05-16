export type User = {
  id?: string;
  username?: string;
  role?: 'USER' | 'MODERATOR' | 'ADMIN';
  accountState?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  profile?: {
    firstName?: string;
    avatarUrl?: string;
  };
  account?: {
    username?: string;
  };
};

export interface Account {
  id: string;
  userId: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  passwordHash?: string;
  updatedAt?: Date;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  secondName?: string;
  avatarUrl?: string;
  bio?: string;
  birthday?: Date;
  isPrivate: boolean;
}
