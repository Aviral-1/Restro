'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, restaurantId, tableNumber, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    street: '',
    city: 'Bangalore',
    zipCode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.customerPhone) {
      alert('Please fill in your name and phone number');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId: restaurantId || 'demo',
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        deliveryAddress: {
          street: form.street || '123 Main Street',
          city: form.city,
          state: 'Karnataka',
          zipCode: form.zipCode || '560001',
        },
        tableNumber,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          isVeg: i.isVeg,
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        deliveryFee: getDeliveryFee(),
        total: Math.round(getTotal()),
        notes: form.notes,
      };

      // Create order
      let order;
      try {
        order = await api.createOrder(orderData);
      } catch {
        // Demo mode: simulate order creation
        order = {
          _id: 'demo-order-' + Date.now(),
          orderNumber: `ORD-DEMO-${Date.now().toString(36).toUpperCase()}`,
          ...orderData,
          status: 'pending',
          paymentStatus: 'pending',
        };
      }

      // Create payment order
      try {
        const payment = await api.createPaymentOrder({
          orderId: order._id,
          amount: Math.round(getTotal()),
        });

        // In production: open Razorpay checkout
        // For demo: simulate payment success
        await api.verifyPayment({
          razorpayOrderId: payment.id,
          razorpayPaymentId: `pay_${Date.now().toString(36)}`,
          razorpaySignature: 'demo_signature',
        });
      } catch {
        // Demo mode: skip payment verification
      }

      clearCart();
      router.push(`/tracking/${order._id}?orderNumber=${order.orderNumber}`);
    } catch (err) {
      console.error('Order error:', err);
      // Even if the API is down, create a demo flow
      clearCart();
      router.push(`/tracking/demo-order?orderNumber=ORD-DEMO-001`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-text-secondary mb-4">No items in cart</p>
        <button onClick={() => router.push('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary pb-32">
      {/* Header */}
      <div className="bg-white border-b border-surface-border sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-secondary">←</button>
          <h1 className="text-lg font-bold text-text-primary">Checkout</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Contact Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm">👤</span>
            Your Details
          </h2>
          <div className="space-y-3">
            <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Full Name *" className="w-full p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300" />
            <input name="customerPhone" value={form.customerPhone} onChange={handleChange} placeholder="Phone Number *" type="tel" className="w-full p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300" />
            <input name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="Email (optional)" type="email" className="w-full p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
        </motion.div>

        {/* Delivery Address */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm">📍</span>
            Delivery Address
          </h2>
          <div className="space-y-3">
            <input name="street" value={form.street} onChange={handleChange} placeholder="Street Address" className="w-full p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300" />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300" />
              <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="PIN Code" className="w-full p-3 bg-surface-secondary rounded-xl text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h2 className="font-bold text-text-primary mb-4">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-sm">
                <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-surface-border pt-2 mt-3 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Subtotal</span><span>₹{getSubtotal()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Tax (5%)</span><span>₹{getTax()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Delivery</span><span>₹{getDeliveryFee()}</span></div>
              <div className="flex justify-between text-base font-bold border-t border-surface-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary-600">₹{Math.round(getTotal())}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm">💳</span>
            Payment
          </h2>
          <div className="space-y-2">
            {['UPI (GPay, PhonePe)', 'Credit / Debit Card', 'Wallet'].map((method, i) => (
              <label key={method} className="flex items-center gap-3 p-3 rounded-xl border border-surface-border hover:bg-primary-50 cursor-pointer transition-colors">
                <input type="radio" name="payment" defaultChecked={i === 0} className="accent-primary-500" />
                <span className="text-sm font-medium">{method}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Place Order */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-border p-4 z-50">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>Pay ₹{Math.round(getTotal())} & Place Order</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
