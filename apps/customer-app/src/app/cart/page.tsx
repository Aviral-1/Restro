'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, getTax, getDeliveryFee, getTotal, getItemCount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-secondary">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl mb-6">
          🛒
        </motion.div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-8">Add items from the menu to get started</p>
        <Link href="/menu?restaurantId=demo&table=1" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary pb-40">
      {/* Header */}
      <div className="bg-white border-b border-surface-border sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-secondary">
            ←
          </button>
          <h1 className="text-lg font-bold text-text-primary">
            Your Cart <span className="text-primary-500">({getItemCount()})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {/* Cart Items */}
        <div className="card p-4 space-y-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.menuItemId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-4 ${idx > 0 ? 'border-t border-surface-border pt-4' : ''}`}
            >
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {item.image || '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </span>
                  <h3 className="font-semibold text-sm text-text-primary truncate">{item.name}</h3>
                </div>
                <p className="text-sm font-bold text-text-primary mt-1">₹{item.price * item.quantity}</p>
              </div>
              <div className="flex items-center bg-primary-50 rounded-xl overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  className="px-3 py-2 text-primary-600 font-bold hover:bg-primary-100"
                >
                  −
                </button>
                <span className="px-2 font-bold text-sm text-primary-700">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="px-3 py-2 text-primary-600 font-bold hover:bg-primary-100"
                >
                  +
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add note */}
        <div className="card p-4 mt-4">
          <label className="text-sm font-medium text-text-secondary">Special instructions</label>
          <input
            type="text"
            placeholder="Any special requests? E.g., extra spicy..."
            className="w-full mt-2 p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>

        {/* Bill Summary */}
        <div className="card p-4 mt-4">
          <h3 className="font-bold text-text-primary mb-4">Bill Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">₹{getSubtotal()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">GST (5%)</span>
              <span className="font-medium">₹{getTax()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Delivery Fee</span>
              <span className="font-medium">₹{getDeliveryFee()}</span>
            </div>
            <div className="border-t border-surface-border pt-2 mt-2 flex justify-between text-base">
              <span className="font-bold text-text-primary">Total</span>
              <span className="font-bold text-primary-600">₹{Math.round(getTotal())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-border p-4 z-50">
        <div className="max-w-lg mx-auto">
          <Link href="/checkout">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <span className="bg-white/20 px-3 py-0.5 rounded-lg text-sm">₹{Math.round(getTotal())}</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
