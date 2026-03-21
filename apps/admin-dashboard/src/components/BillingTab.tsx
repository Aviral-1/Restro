'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Check, Shield, Zap, 
  ArrowUpRight, Clock, AlertCircle, Sparkles
} from 'lucide-react';
import { api } from '../lib/api';

export default function BillingTab({ restaurantId }: { restaurantId: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const [plansData, subData] = await Promise.all([
          api.getPlans(),
          api.getCurrentSubscription(restaurantId)
        ]);
        setPlans(plansData.data || []);
        setSubscription(subData.data);
      } catch (err) {
        console.error('Billing load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBilling();
  }, [restaurantId]);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const currentPlan = subscription?.planId || plans.find(p => p.type === 'pro'); // Fallback to pro for demo

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Current Plan Header */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider italic">Active Plan</span>
              {subscription?.cancelAtPeriodEnd && <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase italic">Canceling soon</span>}
            </div>
            <h2 className="text-4xl font-bold text-text-primary uppercase tracking-tight">{currentPlan?.name || 'Pro Plan'}</h2>
            <p className="text-text-secondary italic">Next billing date: 24 April 2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600 mb-1">${currentPlan?.price || 79}<span className="text-sm text-text-muted font-normal">/mo</span></p>
            <button className="text-primary-500 font-bold hover:underline flex items-center gap-1 justify-end italic">
              View Invoices <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Usage Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UsageCard 
          label="Menu Items" 
          used={12} 
          total={currentPlan?.limits?.maxItems || 50} 
          icon={Zap}
        />
        <UsageCard 
          label="Total Orders" 
          used={450} 
          total={currentPlan?.limits?.maxOrders || 500} 
          icon={Clock}
          critical
        />
        <UsageCard 
          label="Tables" 
          used={8} 
          total={currentPlan?.limits?.maxTables || 10} 
          icon={Shield}
        />
      </section>

      {/* Plan Selection */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan._id} 
              className={`p-6 rounded-3xl border-2 transition-all ${plan.type === currentPlan?.type ? 'border-primary-500 bg-primary-50/20' : 'border-gray-100 hover:border-primary-200'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg uppercase tracking-tight">{plan.name}</h4>
                {plan.type === currentPlan?.type && <Check className="w-5 h-5 text-primary-500" strokeWidth={3} />}
              </div>
              <p className="text-2xl font-bold text-text-primary mb-6">${plan.price}<span className="text-xs text-text-muted font-normal">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2 italic">
                    <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                disabled={plan.type === currentPlan?.type}
                className={`w-full py-3 rounded-xl font-bold transition-all ${plan.type === currentPlan?.type ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}
              >
                {plan.type === currentPlan?.type ? 'Current Plan' : 'Switch Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Method */}
      <section className="card p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-text-secondary" />
            </div>
            <div>
              <h4 className="font-bold text-text-primary italic">Payment Method</h4>
              <p className="text-sm text-text-secondary">Visa ending in •••• 4242</p>
            </div>
          </div>
          <button className="text-primary-500 font-bold hover:underline italic">Edit</button>
        </div>
      </section>
    </div>
  );
}

function UsageCard({ label, used, total, icon: Icon, critical = false }: any) {
  const percentage = Math.min((used / total) * 100, 100);
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-text-secondary">
          <Icon className="w-5 h-5 font-bold" />
        </div>
        {critical && percentage > 80 && (
          <div className="flex items-center gap-1 text-red-500 animate-pulse uppercase tracking-tight">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold">Limit Near</span>
          </div>
        )}
      </div>
      <p className="text-text-secondary text-sm font-medium italic">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-2xl font-bold text-text-primary">{used}</h3>
        <span className="text-text-muted text-sm italic">/ {total}</span>
      </div>
      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full rounded-full ${critical && percentage > 80 ? 'bg-red-500' : 'bg-primary-500'}`}
        />
      </div>
    </div>
  );
}
