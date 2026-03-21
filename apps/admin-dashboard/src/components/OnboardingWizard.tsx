'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Store, MapPin, CreditCard, 
  ArrowRight, ArrowLeft, Loader2, Sparkles 
} from 'lucide-react';
import { api } from '@/lib/api';

interface OnboardingWizardProps {
  onComplete: (data: any) => void;
}

const PLANS = [
  { id: 'basic', name: 'Basic', price: '$29', features: ['Up to 50 Items', 'Standard Analytics', 'Basic QR Templates'], color: 'border-blue-200 bg-blue-50/30' },
  { id: 'pro', name: 'Pro', price: '$79', features: ['Unlimited Items', 'Advanced Analytics', 'Custom Branding', 'Priority Support'], color: 'border-primary-200 bg-primary-50/30', recommended: true },
  { id: 'enterprise', name: 'Enterprise', price: '$199', features: ['All Pro Features', 'Multi-location', 'API Access', 'Dedicated Manager'], color: 'border-purple-200 bg-purple-50/30' },
];

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    cuisine: 'Multi-cuisine',
    plan: 'pro'
  });
  const [createdRestaurant, setCreatedRestaurant] = useState<any>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create Restaurant
      const restaurant = await api.createRestaurant({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        cuisineType: [formData.cuisine]
      });

      // 2. Get Plans and Subscribe
      const plans = await api.getPlans();
      const selectedPlan = plans.find((p: any) => p.type === formData.plan) || plans[0];
      
      if (selectedPlan) {
        await api.subscribe({
          restaurantId: restaurant._id,
          planId: selectedPlan._id
        });
      }

      setCreatedRestaurant(restaurant);
      nextStep(); // Go to step 4: Success
    } catch (error: any) {
      console.error('Onboarding failed:', error);
      alert(error.message || 'Failed to setup restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 flex">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`flex-1 transition-all duration-500 ${s <= step ? 'bg-primary-500' : 'bg-transparent'}`} 
            />
          ))}
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                    <Store className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tight">Restaurant Identity</h2>
                </div>
                <p className="text-text-secondary">Let's start with the basics. What should we call your place?</p>
                
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary italic">Restaurant Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. The Golden Spatula" 
                      className="input text-lg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary italic">Bio / Tagline</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Tell customers what makes you special..." 
                      className="input h-32 resize-none pt-4"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tight">Locate & Reach</h2>
                </div>
                <p className="text-text-secondary italic">Where can customers find your delicious food?</p>
                
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary">Physical Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="Full street address, city, state" 
                      className="input" 
                    />
                  </div>
                  <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center group cursor-pointer">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform">📍</div>
                      <p className="text-xs text-text-muted font-bold italic">Interactive Map Coming Soon</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tight">Choose Your Plan</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {PLANS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setFormData({...formData, plan: p.id})}
                      className={`relative p-5 rounded-2xl border-2 transition-all text-left flex flex-col h-full ${formData.plan === p.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-100 hover:border-primary-200'}`}
                    >
                      {p.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> BEST VALUE
                        </div>
                      )}
                      <h4 className="font-bold text-text-primary mb-1 uppercase tracking-tight">{p.name}</h4>
                      <p className="text-2xl font-bold text-primary-600 mb-4">{p.price}<span className="text-xs text-text-muted font-normal">/mo</span></p>
                      <ul className="space-y-2 flex-1">
                        {p.features.map((f, i) => (
                          <li key={i} className="text-xs text-text-secondary flex items-start gap-2 italic">
                            <Check className="w-3 h-3 text-primary-500 shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                  <Check className="w-12 h-12" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-text-primary mb-2 uppercase tracking-tight">Ready to Launch!</h2>
                <p className="text-text-secondary max-w-sm mx-auto italic">Your restaurant profile is set and your {formData.plan} plan is active. Let's start serving customers!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            {step > 1 && step < 4 ? (
              <button onClick={prevStep} className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold italic transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                onClick={nextStep} 
                disabled={!formData.name && step === 1}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 3 ? (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finish Setup <Sparkles className="w-4 h-4" /></>}
              </button>
            ) : (
              <button onClick={() => onComplete(createdRestaurant)} className="btn-primary w-full">
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
