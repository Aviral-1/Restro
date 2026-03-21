'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <span className="text-5xl">🍽️</span>
        </motion.div>

        <h1 className="text-4xl font-extrabold text-text-primary mb-4">
          Restro <span className="text-primary-500">QR</span>
        </h1>
        <p className="text-lg text-text-secondary mb-10 leading-relaxed">
          Scan the QR code at your table to browse the menu, order food, and track your delivery — all from your phone.
        </p>

        {/* CTA */}
        <Link href="/menu?restaurantId=demo&table=1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary text-lg px-10 py-4 shadow-elevated w-full sm:w-auto"
          >
            View Demo Menu →
          </motion.button>
        </Link>

        {/* Features */}
        <div className="mt-14 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: '📱', label: 'Scan QR' },
            { icon: '🛒', label: 'Order Food' },
            { icon: '📍', label: 'Track Live' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-2 text-2xl">
                {f.icon}
              </div>
              <span className="text-sm font-medium text-text-secondary">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
