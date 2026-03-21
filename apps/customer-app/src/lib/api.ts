const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'API request failed');
  }
  return res.json();
}

export const api = {
  // Restaurant
  getRestaurant: (id: string) => fetchApi(`/restaurants/${id}`),
  getRestaurants: () => fetchApi('/restaurants'),

  // Menu
  getFullMenu: (restaurantId: string) => fetchApi(`/menu/full/${restaurantId}`),
  getCategories: (restaurantId: string) => fetchApi(`/menu/categories/${restaurantId}`),
  getItems: (restaurantId: string, categoryId?: string) =>
    fetchApi(`/menu/items/${restaurantId}${categoryId ? `?categoryId=${categoryId}` : ''}`),

  // Orders
  createOrder: (data: any) => fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrder: (id: string) => fetchApi(`/orders/${id}`),
  getOrderByNumber: (num: string) => fetchApi(`/orders/number/${num}`),
  getTrackingLogs: (orderId: string) => fetchApi(`/orders/${orderId}/tracking`),

  // Payments
  createPaymentOrder: (data: any) => fetchApi('/payments/create-order', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data: any) => fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getDashboard: (restaurantId: string) => fetchApi(`/analytics/dashboard/${restaurantId}`),

  // Delivery
  getDeliveryPartners: () => fetchApi('/delivery/partners'),
  getAssignments: (partnerId: string) => fetchApi(`/delivery/assignments/${partnerId}`),
  updateOrderStatus: (orderId: string, status: string) =>
    fetchApi(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  assignDelivery: (orderId: string, deliveryPartnerId: string) =>
    fetchApi(`/orders/${orderId}/assign-delivery`, { method: 'PATCH', body: JSON.stringify({ deliveryPartnerId }) }),
  // Customer & Personalization
  getProfile: (userId: string) =>
    fetchApi(`/customer/profile?userId=${userId}`),
  addAddress: (userId: string, data: any) =>
    fetchApi('/customer/address', { method: 'POST', body: JSON.stringify({ userId, ...data }) }),
  toggleFavorite: (userId: string, itemId: string) =>
    fetchApi('/customer/favorites', { method: 'PATCH', body: JSON.stringify({ userId, itemId }) }),
  getOrderHistory: (userId: string) =>
    fetchApi(`/customer/orders?userId=${userId}`),
};
