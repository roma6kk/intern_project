import api from '@/shared/api';

export type AdminUserFilters = {
  search?: string;
  role?: 'USER' | 'MODERATOR' | 'ADMIN';
  state?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  page?: number;
  limit?: number;
};

export async function listAdminUsers(filters: AdminUserFilters = {}) {
  const { data } = await api.get('/admin/users', { params: filters });
  return data;
}

export async function updateUserRole(
  userId: string,
  payload: { role: 'USER' | 'MODERATOR' | 'ADMIN'; reason?: string },
) {
  const { data } = await api.patch(`/admin/users/${userId}/role`, payload);
  return data;
}

export async function createUserWarning(userId: string, payload: { reason: string }) {
  const { data } = await api.post(`/admin/users/${userId}/warnings`, payload);
  return data;
}

export async function suspendUser(
  userId: string,
  payload: { until: string; reason: string },
) {
  const { data } = await api.post(`/admin/users/${userId}/suspend`, payload);
  return data;
}

export async function unsuspendUser(userId: string, payload: { reason?: string } = {}) {
  const { data } = await api.post(`/admin/users/${userId}/unsuspend`, payload);
  return data;
}

export async function getUserAdminHistory(userId: string) {
  const { data } = await api.get(`/admin/users/${userId}/history`);
  return data;
}

export type BulkAdminAction = 'WARN' | 'SUSPEND' | 'UNSUSPEND' | 'ROLE';

export async function bulkAdminUsers(payload: {
  userIds: string[];
  action: BulkAdminAction;
  warn?: { reason: string };
  suspend?: { until: string; reason: string };
  unsuspend?: { reason?: string };
  rolePayload?: { role: 'USER' | 'MODERATOR' | 'ADMIN'; reason?: string };
}) {
  const { data } = await api.post('/admin/users/bulk', payload);
  return data as {
    succeeded: string[];
    failed: { userId: string; error: string }[];
    total: number;
  };
}
