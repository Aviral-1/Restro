'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, ClipboardList, UtensilsCrossed, 
  QrCode, CreditCard, User, LogOut, 
  ChevronRight, ArrowUpRight, CheckCircle2, 
  Settings, Bell, Search, Filter,
  PieChart, TrendingUp, Users, Package
} from 'lucide-react';
import { api } from '@/lib/api';
import OnboardingWizard from '@/components/OnboardingWizard';
import BillingTab from '@/components/BillingTab';

// Demo data for when API is unavailable
const DEMO_ANALYTICS = {
  totalOrders: 156,
  totalRevenue: 48750,
  averageOrderValue: 312,
  topSellingItems: [
    { name: 'Butter Chicken', count: 45, revenue: 15705 },
    { name: 'Paneer Tikka', count: 38, revenue: 9462 },
    { name: 'Mango Lassi', count: 34, revenue: 4386 },
    { name: 'Brownie Ice Cream', count: 28, revenue: 5572 },
    { name: 'Mutton Biryani', count: 22, revenue: 8778 },
  ],
  insights: [
    '🌟 "Butter Chicken" is your bestseller with 45 orders',
    '⏰ Peak ordering time is 20:00 with 28 orders',
    '🔄 34 repeat customers — consider a loyalty program',
    '💰 Average order value is ₹312 — try bundling items',
    '📈 Strong order volume! Consider expanding your menu',
  ],
  repeatCustomers: 34,
};

const DEMO_ORDERS = [
  { _id: '1', orderNumber: 'ORD-001', customerName: 'Priya Sharma', customerPhone: '+91-98765', total: 876, status: 'pending', createdAt: '2026-03-21T10:00:00.000Z' },
  { _id: '2', orderNumber: 'ORD-002', customerName: 'Rahul Kumar', customerPhone: '+91-98766', total: 528, status: 'preparing', createdAt: '2026-03-21T10:05:00.000Z' },
];

const TAB_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'orders', label: 'Orders', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'menu', label: 'Menu', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'qr', label: 'QR Codes', icon: <QrCode className="w-4 h-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-green-100 text-green-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const NEXT_STATUS: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'qr' | 'billing'>('overview');
  const [analytics, setAnalytics] = useState<any>(DEMO_ANALYTICS);
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS);
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState('all');
  
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItem, setNewItem] = useState({ name: '', price: 0, categoryId: '', description: '', image: '🍽️' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    loadData();
  }, []);

  async function loadData() {
    try {
      const restaurants = await api.getRestaurants();
      if (restaurants.length > 0) {
        const rid = restaurants[0]._id;
        setRestaurantId(rid);
        const [analyticsData, ordersData, menuData] = await Promise.all([
          api.getDashboard(rid).catch(() => DEMO_ANALYTICS),
          api.getOrdersByRestaurant(rid).catch(() => DEMO_ORDERS),
          api.getFullMenu(rid).catch(() => []),
        ]);
        setAnalytics(analyticsData);
        if (ordersData.length > 0) setOrders(ordersData);
        if (menuData.length > 0) setCategories(menuData);
      }
    } catch (err) {
      console.error('Load data failed:', err);
    }
  }

  async function handleAddCategory() {
    if (!newCategoryName || !restaurantId) return;
    try {
      await api.createCategory({ name: newCategoryName, restaurantId });
      setNewCategoryName('');
      setShowAddCategory(false);
      loadData();
    } catch (err: any) { alert(err.message); }
  }

  async function handleAddItem() {
    if (!newItem.name || !newItem.categoryId || !restaurantId) return;
    try {
      await api.createItem({ ...newItem, restaurantId });
      setNewItem({ name: '', price: 0, categoryId: '', description: '', image: '🍽️' });
      setShowAddItem(false);
      loadData();
    } catch (err: any) { alert(err.message); }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {}
  }

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence>
        {!restaurantId && (
          <OnboardingWizard 
            onComplete={(res) => {
              setRestaurantId(res._id);
              loadData();
            }} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">RESTRO ADMIN</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">SaaS Cloud Terminal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search orders..." className="bg-transparent text-sm font-medium outline-none w-48" />
            </div>
            <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
              <button className="relative p-2 text-slate-400 hover:text-primary-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{user?.name || 'Manager'}</p>
                  <p className="text-[10px] text-primary-500 font-black italic">PRO ENTERPRISE</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 group-hover:border-primary-200 transition-all">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {TAB_ITEMS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Live Orders" value={analytics.totalOrders} icon={Package} trend="+12% today" color="text-blue-600" bg="bg-blue-50" />
                <StatCard label="Total Revenue" value={`₹${analytics.totalRevenue?.toLocaleString()}`} icon={TrendingUp} trend="+₹4,200 today" color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="Avg Order" value={`₹${analytics.averageOrderValue}`} icon={PieChart} trend="+5% this week" color="text-violet-600" bg="bg-violet-50" />
                <StatCard label="Retention" value={`${analytics.repeatCustomers}%`} icon={Users} trend="Top performing" color="text-amber-600" bg="bg-amber-50" />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Orders Panel */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                       <ClipboardList className="w-5 h-5 text-primary-600" />
                       LATEST ORDERS
                    </h3>
                    <button className="text-xs font-bold text-primary-600 hover:underline tracking-tight uppercase">View All</button>
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="group p-4 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 rounded-3xl border border-transparent transition-all flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-lg shadow-sm border border-slate-100">🥘</div>
                           <div>
                             <p className="font-bold text-slate-900 text-sm tracking-tight">{order.customerName}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.orderNumber} • {formatTime(order.createdAt)}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="font-bold text-slate-900 text-sm">₹{order.total}</p>
                           <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest italic border ${STATUS_COLORS[order.status]}`}>
                             {order.status.replace(/_/g, ' ')}
                           </span>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights & Onboarding status */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-lg font-bold tracking-tight mb-8 flex items-center gap-2">
                       <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-lg">✨</div>
                       AI STRATEGY
                    </h3>
                    <div className="space-y-6 flex-1">
                      {analytics.insights?.slice(0, 3).map((insight: string, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-1 h-auto bg-white/20 rounded-full" />
                          <p className="text-xs font-medium text-slate-300 leading-relaxed italic">{insight}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">QUICK ACTION</p>
                       <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5">
                         Optimize Menu
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <BillingTab restaurantId={restaurantId || ''} />
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {['all', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map((f) => (
                  <button 
                    key={f} 
                    onClick={() => setOrderFilter(f)} 
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      orderFilter === f 
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300' 
                        : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {f} <span className="ml-2 text-[8px] bg-slate-100 group-hover:bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">{orders.filter(o => f === 'all' || o.status === f).length}</span>
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100 transition-all group">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-black text-slate-300 tracking-tighter italic">{order.orderNumber}</span>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest italic border ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </div>
                    <div className="mb-8">
                      <p className="text-lg font-bold text-slate-900 tracking-tight">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{formatTime(order.createdAt)}</p>
                    </div>
                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-xl font-black text-primary-600">₹{order.total}</p>
                      {NEXT_STATUS[order.status] && (
                        <button 
                          onClick={() => handleStatusChange(order._id, NEXT_STATUS[order.status])} 
                          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                        >
                          Mark {NEXT_STATUS[order.status]}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">MENU COLLECTIONS</h2>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em] mt-1">Manage categories and items</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setShowAddCategory(true)} className="px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">+ Add Category</button>
                    <button onClick={() => setShowAddItem(true)} className="px-6 py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all">+ New Item</button>
                  </div>
               </div>
               <div className="space-y-12">
                 {categories.map((cat: any) => (
                   <div key={cat._id} className="space-y-6">
                     <div className="flex items-center gap-4">
                       <span className="text-2xl">📁</span>
                       <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase tracking-widest">{cat.name}</h3>
                       <div className="h-[1px] flex-1 bg-slate-100" />
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat.items?.length || 0} ITEMS</p>
                     </div>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {cat.items?.length > 0 ? cat.items.map((item: any) => (
                         <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-100 transition-all">
                           <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-50 group-hover:scale-105 transition-transform">{item.image || '🥗'}</div>
                           <div className="flex-1 min-w-0">
                             <p className="font-bold text-slate-900 tracking-tight">{item.name}</p>
                             <p className="text-primary-600 font-black text-sm mt-1">₹{item.price}</p>
                           </div>
                           <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600">✎</button>
                              <button className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-red-300 hover:text-red-500">×</button>
                           </div>
                         </div>
                       )) : (
                         <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                           <p className="text-xs text-slate-400 font-bold uppercase italic tracking-widest">Category Empty</p>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'qr' && (
            <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">QR GENERATOR</h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em] mt-2 mb-8">Download high-density codes for your tables</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                   {Array.from({ length: 10 }, (_, i) => i + 1).map((tableNum) => (
                     <div key={tableNum} className="group bg-slate-50 rounded-[2rem] p-6 text-center border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all">
                       <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200 group-hover:border-primary-400 transition-colors">
                         <div className="p-4 bg-slate-50 rounded-xl">
                            <QrCode className="w-12 h-12 text-slate-300 group-hover:text-primary-500 transition-colors" strokeWidth={1} />
                         </div>
                       </div>
                       <p className="font-bold text-slate-900 tracking-tight">TABLE {tableNum}</p>
                       <button className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Export</button>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Modals */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[300] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-white">
            <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight flex items-center gap-3">
               <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">📁</div>
               NEW CATEGORY
            </h3>
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                 <input autoFocus type="text" placeholder="e.g. Continental Roast" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-primary-500 transition-colors font-bold text-sm tracking-tight" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
               </div>
               <div className="flex gap-4 pt-4">
                 <button onClick={() => setShowAddCategory(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
                 <button onClick={handleAddCategory} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-100">Create</button>
               </div>
            </div>
          </motion.div>
        </div>
      )}

      {showAddItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[300] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-white">
            <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight flex items-center gap-3">
               <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">✨</div>
               CREATE ITEM
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Title</label>
                <input type="text" placeholder="Signature Bowl" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-primary-500 transition-colors font-bold text-sm" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input type="number" placeholder="499" className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-primary-500 transition-colors font-bold text-sm" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-primary-500 transition-colors font-bold text-sm italic" value={newItem.categoryId} onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}>
                    <option value="">Choose...</option>
                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea placeholder="Ingredients, spice level..." className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:border-primary-500 transition-colors font-bold text-sm h-32 resize-none pt-4" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
              </div>
              <div className="flex gap-4 pt-6">
                <button onClick={() => setShowAddItem(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Discard</button>
                <button onClick={handleAddItem} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all">Save Dish</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-2xl hover:shadow-slate-100 transition-all cursor-pointer">
      <div className={`w-14 h-14 ${bg} rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</h4>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        <p className={`text-[10px] font-bold italic mt-2 ${color}`}>{trend}</p>
      </div>
    </div>
  );
}
