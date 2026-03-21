const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = {
  async getDeliveryPartner(id: string) {
    const res = await fetch(`${API_URL}/delivery/partners/${id}`);
    if (!res.ok) throw new Error('Failed to fetch partner');
    return res.json();
  },
  async getAssignments(partnerId: string) {
    const res = await fetch(`${API_URL}/delivery/assignments?partnerId=${partnerId}`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },
  async updateDeliveryStatus(orderId: string, status: string) {
    const res = await fetch(`${API_URL}/delivery/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },
  async login(credentials: any) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  }
};
