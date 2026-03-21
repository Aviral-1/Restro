const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchApi(endpoint: string, options: any = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export const api = {
  getStats: () => fetchApi('/super-admin/stats'),
  getTenants: () => fetchApi('/super-admin/tenants'),
  updateTenantStatus: (id: string, status: string) => 
    fetchApi(`/super-admin/tenants/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    }),
  getRevenueChart: () => fetchApi('/super-admin/revenue-chart'),
};
