const REPORT_QUEUE_MESSAGE_PREFIXES = [
  'Новая жалоба на пост',
  'Вы назначены модератором',
  'Срок SLA истек: отчет',
] as const;

export function isReportQueueNotification(notification: {
  type: string;
  message?: string | null;
}): boolean {
  if (notification.type !== 'SYSTEM' || !notification.message) return false;
  return REPORT_QUEUE_MESSAGE_PREFIXES.some((prefix) =>
    notification.message!.startsWith(prefix),
  );
}

export function moderationPanelHref(reportId?: string | null): string {
  if (reportId) {
    return `/moderation?report=${encodeURIComponent(reportId)}`;
  }
  return '/moderation';
}

export function systemNotificationHref(notification: {
  type: string;
  message?: string | null;
  itemId?: string | null;
  postId?: string | null;
  actorUsername?: string;
}): string {
  if (notification.type !== 'SYSTEM') {
    return notification.actorUsername
      ? `/profile/${notification.actorUsername}`
      : '/interactions';
  }

  if (isReportQueueNotification(notification)) {
    return moderationPanelHref(notification.itemId);
  }

  if (notification.postId) {
    return `/post/${notification.postId}`;
  }

  if (notification.actorUsername) {
    return `/profile/${notification.actorUsername}`;
  }

  return '/interactions';
}
