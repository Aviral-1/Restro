'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Suspense } from 'react';

const STAGES = [
  { key: 'pending', label: 'Order Placed', icon: '📋', description: 'Restaurant has received your order' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', description: 'Restaurant confirmed your order' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', description: 'Chef is preparing your food' },
  { key: 'ready', label: 'Ready', icon: '📦', description: 'Order is ready for pickup' },
  { key: 'out_for_delivery', label: 'On the Way', icon: '🛵', description: 'Delivery partner is on the way' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', description: 'Order delivered successfully!' },
];

function TrackingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const orderNumber = searchParams.get('orderNumber') || 'ORD-DEMO-001';

  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderData = await api.getOrder(orderId);
        setOrder(orderData);
        setCurrentStatus(orderData.status);
        const logs = await api.getTrackingLogs(orderId);
        setTrackingLogs(logs);
      } catch {
        // Demo mode
        setCurrentStatus('preparing');
        setTrackingLogs([
          { status: 'pending', message: 'Order placed', createdAt: new Date(Date.now() - 600000) },
          { status: 'confirmed', message: 'Restaurant confirmed', createdAt: new Date(Date.now() - 300000) },
          { status: 'preparing', message: 'Chef is cooking', createdAt: new Date() },
        ]);
      }
    }
    loadOrder();

    // Demo: simulate status progression
    const timer = setTimeout(() => {
      setCurrentStatus((prev) => {
        const idx = STAGES.findIndex((s) => s.key === prev);
        if (idx < STAGES.length - 1) return STAGES[idx + 1].key;
        return prev;
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, [orderId]);

  const currentStageIdx = STAGES.findIndex((s) => s.key === currentStatus);
  const isDelivered = currentStatus === 'delivered';

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-8 rounded-b-[28px]">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <motion.div
              animate={isDelivered ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }}
              transition={{ repeat: isDelivered ? 0 : Infinity, duration: 2 }}
              className="text-5xl mb-4"
            >
              {STAGES[currentStageIdx]?.icon || '📋'}
            </motion.div>
            <h1 className="text-xl font-bold">{STAGES[currentStageIdx]?.label || 'Processing'}</h1>
            <p className="text-primary-100 text-sm mt-1">{STAGES[currentStageIdx]?.description}</p>
            <p className="text-primary-200 text-xs mt-3 font-mono">Order #{orderNumber}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-4">
        {/* ETA */}
        {!isDelivered && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-4 text-center">
            <p className="text-sm text-text-secondary">Estimated delivery time</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">25-35 min</p>
          </motion.div>
        )}

        {/* Progress Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="font-bold text-text-primary mb-4">Order Progress</h3>
          <div className="space-y-0">
            {STAGES.map((stage, idx) => {
              const isComplete = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div key={stage.key} className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isComplete ? '#22C55E' : '#E5E7EB',
                        scale: isCurrent ? 1.2 : 1,
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    >
                      {isComplete ? (
                        <span className="text-white text-xs">✓</span>
                      ) : (
                        <span className="text-text-muted text-xs">{idx + 1}</span>
                      )}
                    </motion.div>
                    {idx < STAGES.length - 1 && (
                      <div className={`w-0.5 h-10 ${isComplete ? 'bg-primary-400' : 'bg-gray-200'} transition-colors duration-500`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5">
                    <p className={`font-semibold text-sm ${isComplete ? 'text-text-primary' : 'text-text-muted'}`}>
                      {stage.label}
                      {isCurrent && !isDelivered && (
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2 text-primary-500">●</motion.span>
                      )}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Delivered Actions */}
        {isDelivered && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-5 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-lg text-text-primary mb-2">Enjoy your meal!</h3>
            <p className="text-text-secondary text-sm mb-5">Thank you for ordering with Restro QR</p>
            <Link href="/" className="btn-primary inline-block">Order Again</Link>
          </motion.div>
        )}

        {/* Help */}
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">📞</div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-text-primary">Need help?</p>
            <p className="text-xs text-text-secondary">Contact restaurant support</p>
          </div>
          <button className="text-primary-600 font-semibold text-sm">Call</button>
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>}>
      <TrackingContent />
    </Suspense>
  );
}
