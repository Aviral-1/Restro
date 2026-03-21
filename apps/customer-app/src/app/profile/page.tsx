'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Heart, ChevronRight, 
  LogOut, Plus, Trash2, ShieldCheck,
  Star, Briefcase, Home, Package
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      loadProfile(u._id);
    }
  }, []);

  async function loadProfile(uid: string) {
    try {
      const res = await api.getProfile(uid);
      setUser(res.data || res);
    } catch {} finally { setLoading(false); }
  }

  async function handleAddAddress() {
    if (!newAddress.address || !user) return;
    try {
      await api.addAddress(user._id, newAddress);
      setShowAddressModal(false);
      setNewAddress({ label: 'Home', address: '' });
      loadProfile(user._id);
    } catch (err: any) { alert(err.message); }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-slate-900 pt-16 pb-32 px-6 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl shadow-black/20">
            {user?.name?.[0] || '👤'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">{user?.name || 'GUEST DINER'}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{user?.email || 'Premium Member'}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Total Orders" value="12" icon={Package} />
          <StatBox label="Reward Points" value="1,240" icon={Star} />
        </div>

        {/* Address Book */}
        <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-100 border border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-sm tracking-widest uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              Saved Addresses
            </h3>
            <button onClick={() => setShowAddressModal(true)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors">
              <Plus className="w-4 h-4 shadow-sm" />
            </button>
          </div>
          <div className="space-y-4">
            {user?.addresses?.length > 0 ? user.addresses.map((addr: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                     {addr.label === 'Home' ? <Home className="w-4 h-4 text-slate-400" /> : <Briefcase className="w-4 h-4 text-slate-400" />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900 tracking-tight">{addr.label}</p>
                     <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{addr.address}</p>
                   </div>
                </div>
                {addr.isDefault && <span className="text-[8px] font-black uppercase text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100 italic tracking-widest">Default</span>}
              </div>
            )) : (
              <p className="text-xs text-slate-400 italic font-medium">No saved addresses</p>
            )}
          </div>
        </section>

        {/* Account Settings */}
        <section className="space-y-3">
          <MenuLink icon={Heart} label="Favorite Dishes" />
          <MenuLink icon={ShieldCheck} label="Security & Privacy" />
          <MenuLink icon={LogOut} label="Sign Out" color="text-red-500" onClick={() => {
            localStorage.clear();
            window.location.reload();
          }} />
        </section>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[300] flex items-end sm:items-center justify-center p-6">
             <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white p-8 rounded-[3rem] w-full max-w-sm shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight uppercase italic">Add New Address</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map(l => (
                      <button key={l} onClick={() => setNewAddress({...newAddress, label: l})} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newAddress.label === l ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                  <textarea placeholder="Enter full address details..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none h-32 resize-none focus:border-primary-500 transition-colors" value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} />
                  <div className="flex gap-4 pt-4">
                     <button onClick={() => setShowAddressModal(false)} className="flex-1 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                     <button onClick={handleAddAddress} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-200">Save</button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col justify-between">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-400 italic">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{label}</p>
      </div>
    </div>
  );
}

function MenuLink({ icon: Icon, label, color = "text-slate-600", onClick }: any) {
  return (
    <button onClick={onClick} className="w-full bg-slate-50/50 hover:bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
