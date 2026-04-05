import api from '@/shared/api';
import type {
  CreateReportPayload,
  ListReportsParams,
  ModerationAction,
  ReportPriority,
  ReportStatus,
} from '../model/types';

export async function createReport(payload: CreateReportPayload) {
  const { data } = await api.post('/reports', payload);
  return data;
}

export async function listReports(params?: ListReportsParams) {
  const { data } = await api.get('/reports', {
    params: params && Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
    ),
  });
  return data;
}

export async function updateReport(
  id: string,
  payload: {
    status: ReportStatus;
    action?: ModerationAction;
    resolutionNote?: string;
    warningReason?: string;
  },
) {
  const { data } = await api.patch(`/reports/${id}`, payload);
  return data;
}

export async function assignReport(
  id: string,
  payload: { assignedModeratorId: string | null },
) {
  const { data } = await api.patch(`/reports/${id}/assign`, payload);
  return data;
}

export async function updateReportPriority(
  id: string,
  payload: { priority: ReportPriority },
) {
  const { data } = await api.patch(`/reports/${id}/priority`, payload);
  return data;
}
