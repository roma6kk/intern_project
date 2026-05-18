export type CreateReportPayload = {
  postId?: string;
  commentId?: string;
  reason: string;
};

export type ReportStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
export type ModerationAction = 'NONE' | 'HIDE' | 'DELETE' | 'WARN';
export type ReportPriority = 'LOW' | 'NORMAL' | 'HIGH';

export type ListReportsParams = {
  status?: ReportStatus;
  priority?: ReportPriority;
  assignedModeratorId?: string;
  overdue?: boolean;
};
