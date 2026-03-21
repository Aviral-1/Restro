const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchApi(endpoint: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'API request failed');
  }
  return res.json();
}

export const api = {
  login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchApi('/auth/profile'),

  getRestaurants: () => fetchApi('/restaurants'),
  getRestaurant: (id: string) => fetchApi(`/restaurants/${id}`),
  createRestaurant: (data: any) => fetchApi('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  updateRestaurant: (id: string, data: any) => fetchApi(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getTables: (id: string) => fetchApi(`/restaurants/${id}/tables`),
  createTable: (id: string, data: any) => fetchApi(`/restaurants/${id}/tables`, { method: 'POST', body: JSON.stringify(data) }),

  getFullMenu: (restaurantId: string) => fetchApi(`/menu/full/${restaurantId}`),
  createCategory: (data: any) => fetchApi('/menu/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => fetchApi(`/menu/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetchApi(`/menu/categories/${id}`, { method: 'DELETE' }),
  createItem: (data: any) => fetchApi('/menu/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: any) => fetchApi(`/menu/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id: string) => fetchApi(`/menu/items/${id}`, { method: 'DELETE' }),

  getOrders: (query?: string) => fetchApi(`/orders${query ? `?${query}` : ''}`),
  getOrdersByRestaurant: (id: string) => fetchApi(`/orders/restaurant/${id}`),
  updateOrderStatus: (id: string, status: string) => fetchApi(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  assignDelivery: (id: string, partnerId: string) => fetchApi(`/orders/${id}/assign-delivery`, { method: 'PATCH', body: JSON.stringify({ deliveryPartnerId: partnerId }) }),

  getDashboard: (restaurantId: string) => fetchApi(`/analytics/dashboard/${restaurantId}`),
  getDeliveryPartners: () => fetchApi('/delivery/partners'),

  // SaaS & Billing
  getPlans: () => fetchApi('/subscriptions/plans'),
  subscribe: (data: { restaurantId: string; planId: string }) => fetchApi('/subscriptions/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentSubscription: (restaurantId: string) => fetchApi(`/subscriptions/current?restaurantId=${restaurantId}`),
};
