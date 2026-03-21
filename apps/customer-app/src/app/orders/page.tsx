'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle2, Package, MapPin, RefreshCcw } from 'lucide-react';
import { api } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      loadOrders(u._id);
    }
  }, []);

  async function loadOrders(uid: string) {
    try {
      const res = await api.getOrderHistory(uid);
      setOrders(res.data || res);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="p-6 pt-12">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase flex items-center gap-3">
           <ClipboardList className="w-6 h-6 text-primary-600" />
           DINING HISTORY
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">Track your culinary journey</p>
      </div>

      <div className="px-6 space-y-4">
        {orders.length > 0 ? orders.map((order, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={order._id} 
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">🥘</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{order.restaurantId?.name || 'Restaurant'}</p>
                  <p className="text-[10px] text-slate-400 font-bold italic uppercase">{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-sm font-black text-primary-600">₹{order.total}</p>
                 <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest italic border ${
                   order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                 }`}>
                   {order.status}
                 </span>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between group-hover:bg-primary-50/20 transition-colors">
               <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3" />
                    <span className="text-[10px] font-bold italic tracking-wider">{order.items?.length || 0} Items</span>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold italic tracking-wider">
                      {mounted ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
               </div>
               <button className="flex items-center gap-1 text-primary-600 font-black text-[9px] uppercase tracking-widest italic hover:underline">
                  <RefreshCcw className="w-3 h-3" />
                  RE-ORDER
               </button>
            </div>
          </motion.div>
        )) : (
          <div className="py-24 text-center">
             <div className="text-6xl mb-6 opacity-20 filter grayscale">📦</div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No orders yet</p>
             <button className="mt-4 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 italic transition-transform active:scale-95">Explore Menu</button>
          </div>
        )}
      </div>
    </div>
  );
}
