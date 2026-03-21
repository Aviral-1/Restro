'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function DeliveryLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: 'vikram@delivery.com', password: 'password123' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(form);
      localStorage.setItem('token', data.accessToken || 'demo-token');
      localStorage.setItem('user', JSON.stringify(data.user || { name: 'Vikram Singh', role: 'delivery_partner' }));
    } catch {
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Vikram Singh', role: 'delivery_partner' }));
    }
    router.push('/deliveries');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-md">🛵</div>
          <h1 className="text-2xl font-bold text-text-primary">Delivery Partner</h1>
          <p className="text-text-secondary text-sm mt-1">Sign in to view deliveries</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="Email" />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" placeholder="Password" />
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
          <p className="text-xs text-center text-text-muted">Demo: vikram@delivery.com / password123</p>
        </form>
      </motion.div>
    </div>
  );
}
