'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Store, CreditCard, TrendingUp, 
  MapPin, Bell, Settings, Search,
  ArrowUpRight, ArrowDownRight, MoreVertical
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const DEMO_DATA = {
  stats: [
    { label: 'Total Revenue', value: '$124,500', trend: '+12.5%', icon: TrendingUp, color: 'text-primary-500 bg-primary-50' },
    { label: 'Total Restaurants', value: '1,240', trend: '+8.2%', icon: Store, color: 'text-blue-500 bg-blue-50' },
    { label: 'Active Subscriptions', value: '450', trend: '+4.1%', icon: CreditCard, color: 'text-purple-500 bg-purple-50' },
    { label: 'Growth Rate', value: '18.4%', trend: '+2.3%', icon: Users, color: 'text-orange-500 bg-orange-50' },
  ],
  revenue: [
    { date: 'Mon', revenue: 4000 },
    { date: 'Tue', revenue: 3000 },
    { date: 'Wed', revenue: 2000 },
    { date: 'Thu', revenue: 2780 },
    { date: 'Fri', revenue: 1890 },
    { date: 'Sat', revenue: 2390 },
    { date: 'Sun', revenue: 3490 },
  ],
  restaurants: [
    { id: 1, name: 'Burger King', plan: 'Enterprise', status: 'approved', revenue: '$12,400' },
    { id: 2, name: 'Pizza Hut', plan: 'Pro', status: 'pending', revenue: '$8,200' },
    { id: 3, name: 'Starbucks', plan: 'Basic', status: 'approved', revenue: '$4,500' },
    { id: 4, name: 'KFC', plan: 'Enterprise', status: 'approved', revenue: '$15,100' },
  ]
};

import { api } from '@/lib/api';

  const [tenants, setTenants] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, tenantsRes, revenueRes] = await Promise.all([
        api.getStats(),
        api.getTenants(),
        api.getRevenueChart(),
      ]);

      const formattedStats = [
        { label: 'Total Revenue', value: `₹${statsRes.totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: TrendingUp, color: 'text-primary-500 bg-primary-50' },
        { label: 'Total Restaurants', value: statsRes.totalRestaurants.toString(), trend: '+8.2%', icon: Store, color: 'text-blue-500 bg-blue-50' },
        { label: 'Active Subscriptions', value: statsRes.activeSubscriptions.toString(), trend: '+4.1%', icon: CreditCard, color: 'text-purple-500 bg-purple-50' },
        { label: 'Total Customers', value: statsRes.totalCustomers.toString(), trend: '+2.3%', icon: Users, color: 'text-orange-500 bg-orange-50' },
      ];

      setStats(formattedStats);
      setTenants(tenantsRes);
      setRevenueData(revenueRes);
    } catch (err) {
      console.error('Failed to load platform data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, status: string) {
    try {
      await api.updateTenantStatus(id, status);
      loadData();
    } catch (err: any) { alert(err.message); }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full shadow-lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-xl text-white shadow-xl shadow-primary-200">
              🏢
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 tracking-tighter">PLATFORM</h1>
              <p className="text-[10px] text-primary-500 font-black italic uppercase tracking-widest">Global Terminal</p>
            </div>
          </div>
          <nav className="space-y-2">
            <SidebarItem icon={TrendingUp} label="Insights" active />
            <SidebarItem icon={Store} label="Tenants" />
            <SidebarItem icon={Users} label="Users" />
            <SidebarItem icon={CreditCard} label="Billing" />
            <SidebarItem icon={Settings} label="System" />
          </nav>
        </div>
        <div className="mt-auto p-8">
           <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-12 -mt-12" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">SERVER HEALTH</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <p className="text-sm font-bold tracking-tight">All clusters optimal</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Control Center</h2>
            <p className="text-sm text-slate-400 font-medium tracking-wide mt-1">Real-time ecosystem orchestration</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg">🔑</div>
               <div>
                 <p className="text-xs font-black text-slate-900 uppercase">Super Admin</p>
                 <p className="text-[9px] text-primary-500 font-black italic uppercase tracking-widest">Root Access</p>
               </div>
            </div>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl relative shadow-sm hover:shadow-xl transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black text-primary-600 px-3 py-1 bg-primary-50 rounded-full border border-primary-100 italic tracking-widest uppercase">{stat.trend}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </motion.div>
          ))}
        </section>

        {/* Charts and AI */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
                <select className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                  <option>Live Metrics</option>
                  <option>Historical Data</option>
                </select>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-12 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">📈</div>
                REVENUE VELOCITY
             </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  />
                  {mounted && <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-100 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8">✨</div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 italic">PREDICTIVE GROWTH</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic mb-8">AI suggests a <span className="text-white font-bold underline decoration-primary-500">24% surge</span> in Enterprise signups over the next 14 days based on current pipeline velocity.</p>
              <button className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-white/5 hover:bg-primary-500 hover:text-white transition-all transform active:scale-95">Optimize Strategy</button>
            </div>
          </div>
        </section>

        {/* Tenant Table */}
        <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg">🛡️</div>
                 TENANT ECOSYSTEM
              </h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">Lifecycle Management</p>
            </div>
            <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline italic">Export Registry</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Restaurant</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Joined</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tenants.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-50 group-hover:scale-105 transition-transform">🥘</div>
                        <div>
                          <p className="font-bold text-slate-900 uppercase tracking-tighter">{t.name}</p>
                          <p className="text-[10px] text-primary-500 font-black italic uppercase tracking-widest">Enterprise Tier</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs font-bold text-slate-500 italic">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${t.status === 'active' ? 'bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-900">{t.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleStatusUpdate(t._id, t.status === 'active' ? 'suspended' : 'active')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${t.status === 'active' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                           {t.status === 'active' ? 'Suspend' : 'Activate'}
                         </button>
                         <button className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600">
                           <MoreVertical className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary-50 text-primary-500 font-bold shadow-sm' : 'text-text-secondary hover:bg-gray-50'}`}>
      <Icon className="w-5 h-5 font-bold" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
