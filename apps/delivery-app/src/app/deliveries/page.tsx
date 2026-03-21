'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO_ORDERS = [
  {
    _id: '1',
    orderNumber: 'ORD-DEMO-003',
    customerName: 'Anita Verma',
    customerPhone: '+91-98767',
    restaurantName: 'Green Leaf Kitchen',
    deliveryAddress: { street: '102 Demo Street', city: 'Bangalore', zipCode: '560001' },
    items: [{ name: 'Veg Biryani', quantity: 2 }, { name: 'Raita', quantity: 2 }],
    total: 538,
    status: 'ready',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    _id: '2',
    orderNumber: 'ORD-DEMO-004',
    customerName: 'Vikram Joshi',
    customerPhone: '+91-98768',
    restaurantName: 'Green Leaf Kitchen',
    deliveryAddress: { street: '305 MG Road', city: 'Bangalore', zipCode: '560042' },
    items: [{ name: 'Chicken Wings', quantity: 3 }, { name: 'Cold Coffee', quantity: 2 }],
    total: 1195,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const STATUS_ACTIONS: Record<string, { label: string; next: string; color: string }> = {
  ready: { label: 'Accept & Pick Up', next: 'out_for_delivery', color: 'bg-blue-500 hover:bg-blue-600' },
  out_for_delivery: { label: 'Mark Delivered', next: 'delivered', color: 'bg-primary-500 hover:bg-primary-600' },
};

const STATUS_BADGES: Record<string, string> = {
  ready: 'bg-green-100 text-green-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
};

export default function DeliveriesPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [user, setUser] = useState<any>({ name: 'Vikram Singh' });
  const [isOnline, setIsOnline] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    // Try to load real orders
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/delivery/partners`)
      .then((r) => r.json())
      .then((partners) => {
        if (partners[0]) {
          return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/delivery/assignments/${partners[0]._id}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => { if (data?.length > 0) setOrders(data); })
      .catch(() => {});
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}

    if (newStatus === 'delivered') {
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } else {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    }
    setSelectedOrder(null);
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const todayDelivered = 8; // Demo count

  return (
    <div className="min-h-screen bg-surface-secondary pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-6 rounded-b-[28px]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">Hi, {user?.name?.split(' ')[0] || 'Partner'} 👋</h1>
              <p className="text-primary-100 text-sm">Delivery Partner</p>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isOnline ? 'bg-white text-primary-600' : 'bg-white/20 text-white'
              }`}
            >
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{activeOrders.length}</p>
              <p className="text-xs text-primary-100">Active</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{todayDelivered}</p>
              <p className="text-xs text-primary-100">Delivered</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">₹{(todayDelivered * 40)}</p>
              <p className="text-xs text-primary-100">Earnings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        <h2 className="font-bold text-text-primary mb-4">
          Active Deliveries
          <span className="text-primary-500 ml-1">({activeOrders.length})</span>
        </h2>

        {activeOrders.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-bold text-text-primary mb-2">All caught up!</h3>
            <p className="text-text-secondary text-sm">No active deliveries. New orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {activeOrders.map((order) => {
                const action = STATUS_ACTIONS[order.status];
                const isExpanded = selectedOrder === order._id;

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    className="card overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setSelectedOrder(isExpanded ? null : order._id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs text-text-muted">{order.orderNumber}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl">🛵</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary">{order.customerName}</p>
                          <p className="text-xs text-text-muted truncate">
                            📍 {order.deliveryAddress?.street || 'Address not available'}, {order.deliveryAddress?.city || ''}
                          </p>
                        </div>
                        <p className="font-bold text-primary-600">₹{order.total}</p>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="border-t border-surface-border"
                      >
                        <div className="p-4 space-y-3">
                          <div className="bg-surface-secondary rounded-xl p-3">
                            <p className="text-xs text-text-muted mb-1">Items</p>
                            {order.items?.map((item: any, i: number) => (
                              <p key={i} className="text-sm font-medium">{item.quantity}× {item.name}</p>
                            ))}
                          </div>

                          <div className="bg-surface-secondary rounded-xl p-3">
                            <p className="text-xs text-text-muted mb-1">Customer</p>
                            <p className="text-sm font-medium">{order.customerName}</p>
                            <p className="text-sm text-text-secondary">{order.customerPhone}</p>
                          </div>

                          {/* Map Placeholder */}
                          <div className="bg-primary-50 rounded-xl p-6 text-center border-2 border-dashed border-primary-200">
                            <div className="text-3xl mb-2">🗺️</div>
                            <p className="text-sm text-text-secondary">Google Maps Navigation</p>
                            <p className="text-xs text-text-muted">Add GOOGLE_MAPS_KEY to enable</p>
                          </div>

                          <div className="flex gap-3">
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="flex-1 btn-primary text-center bg-blue-500 hover:bg-blue-600 text-sm py-3"
                            >
                              📞 Call Customer
                            </a>
                            {action && (
                              <button
                                onClick={() => handleStatusChange(order._id, action.next)}
                                className={`flex-1 text-white font-semibold py-3 rounded-xl transition-all text-sm ${action.color}`}
                              >
                                {action.label}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
