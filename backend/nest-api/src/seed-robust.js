const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config();

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/restro-qr';

async function seed() {
  console.log('🌱 Starting Seed Process...');
  const connection = await mongoose.connect(DB_URL);
  const db = connection.connection.db;

  const collections = [
    'users', 'restaurants', 'menucategories', 'menuitems', 
    'orders', 'subscriptionplans', 'subscriptions'
  ];

  console.log('🧹 Clearing data...');
  for (const col of collections) {
    try { await db.collection(col).deleteMany({}); } catch (e) {}
  }

  console.log('🌱 Seeding Plans...');
  await db.collection('subscriptionplans').insertMany([
    {
      type: 'basic',
      name: 'Basic Plan',
      price: 29,
      interval: 'month',
      features: ['Up to 50 Items', 'Standard Analytics', 'Basic QR Templates'],
      limits: { maxItems: 50, maxOrders: 500, maxTables: 10, hasAnalytics: true, hasCustomBranding: false },
      isActive: true, createdAt: new Date()
    },
    {
      type: 'pro',
      name: 'Pro Plan',
      price: 79,
      interval: 'month',
      features: ['Unlimited Items', 'Advanced Analytics', 'Custom Branding', 'Priority Support'],
      limits: { maxItems: 10000, maxOrders: 5000, maxTables: 50, hasAnalytics: true, hasCustomBranding: true },
      isActive: true, createdAt: new Date()
    },
    {
      type: 'enterprise',
      name: 'Enterprise Plan',
      price: 199,
      interval: 'month',
      features: ['All Pro Features', 'Multi-location', 'API Access', 'Dedicated Manager'],
      limits: { maxItems: 100000, maxOrders: 100000, maxTables: 1000, hasAnalytics: true, hasCustomBranding: true },
      isActive: true, createdAt: new Date()
    }
  ]);

  console.log('✅ Seed Successful!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed Failed:', err);
  process.exit(1);
});
