export type StoryAsset = {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
};

export type StoryAuthor = {
  id: string;
  username: string;
  profile?: {
    firstName?: string | null;
    avatarUrl?: string | null;
    isPrivate?: boolean;
  };
};

export type StoryItem = {
  id: string;
  createdAt: string | Date;
  expiresAt: string | Date;
  caption?: string | null;
  assets: StoryAsset[];
  seen?: boolean;
};

export type StoriesFeedGroup = {
  author: StoryAuthor;
  stories: StoryItem[];
  hasUnseen: boolean;
  latestCreatedAt?: string | Date;
};

