export type Notification = {
  id: string;
  isRead: boolean;
  type: string;
  recipientId: string;
  actorId: string;
  itemId?: string;
  postId?: string;
  createdAt: string;
};
