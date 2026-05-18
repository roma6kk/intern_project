import api from '@/shared/api';

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function getAdminSystemHealth() {
  const { data } = await api.get('/admin/system/health');
  return data;
}
