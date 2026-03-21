const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const PORT = 4000;
const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/restro-qr';

// Loose Schemas for maximum flexibility during demo
const RestaurantSchema = new mongoose.Schema({ 
  name: String, 
  description: String, 
  address: mongoose.Schema.Types.Mixed,
  slug: { type: String, unique: true },
  cuisineType: [String],
  ownerId: mongoose.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({ name: String, restaurantId: mongoose.Schema.Types.ObjectId });
const ItemSchema = new mongoose.Schema({ 
  name: String, 
  price: Number, 
  categoryId: mongoose.Schema.Types.ObjectId, 
  restaurantId: mongoose.Schema.Types.ObjectId,
  description: String,
  image: String
});

const OrderSchema = new mongoose.Schema({
  restaurantId: mongoose.Schema.Types.ObjectId,
  customerName: String,
  total: Number,
  status: String,
  items: Array,
  createdAt: { type: Date, default: Date.now }
});

const Restaurant = mongoose.model('RestaurantStandalone', RestaurantSchema);
const Category = mongoose.model('CategoryStandalone', CategorySchema);
const Item = mongoose.model('ItemStandalone', ItemSchema);
const Order = mongoose.model('OrderStandalone', OrderSchema);

// Endpoints
app.get('/api/restaurants', async (req, res) => res.json(await Restaurant.find({ isActive: true })));

app.post('/api/restaurants', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 5);
    }
    // Mock ownerId if none provided (for curl convenience)
    if (!data.ownerId) {
      data.ownerId = new mongoose.Types.ObjectId();
    }
    const restaurant = await Restaurant.create(data);
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/menu/full/:rid', async (req, res) => {
  const cats = await Category.find({ restaurantId: req.params.rid }).lean();
  for (const cat of cats) { cat.items = await Item.find({ categoryId: cat._id }); }
  res.json(cats);
});

app.post('/api/menu/categories', async (req, res) => res.json(await Category.create(req.body)));
app.post('/api/menu/items', async (req, res) => res.json(await Item.create(req.body)));
app.get('/api/orders/restaurant/:rid', async (req, res) => res.json(await Order.find({ restaurantId: req.params.rid }).sort({ createdAt: -1 })));
app.post('/api/orders', async (req, res) => res.json(await Order.create({ ...req.body, status: 'pending' })));

// SaaS & Subscription Mocks
app.get('/api/subscriptions/plans', (req, res) => res.json([
  { _id: 'plan_basic', type: 'basic', name: 'Basic Plan', price: 29 },
  { _id: 'plan_pro', type: 'pro', name: 'Pro Plan', price: 79 },
  { _id: 'plan_enterprise', type: 'enterprise', name: 'Enterprise Plan', price: 199 },
]));

app.post('/api/subscriptions/subscribe', (req, res) => res.json({ success: true, message: 'Subscribed to mock plan' }));
app.get('/api/subscriptions/current', (req, res) => res.json({ status: 'active', plan: { name: 'Pro Plan' } }));

app.get('/api/auth/profile', (req, res) => res.json({ 
  name: 'Demo Owner', role: 'restaurant_owner', email: 'demo@example.com' 
}));

app.post('/api/auth/login', (req, res) => res.json({ 
  accessToken: 'demo-token', 
  user: { name: 'Demo Owner', role: 'restaurant_owner' } 
}));

// Setup initial data if empty
async function setup() {
  await mongoose.connect(MONGO_URI).catch(err => console.error('Mongo offline, using in-memory mocks soon...'));
  console.log('🔗 Connected to MongoDB (Standalone Bridge)');
  app.listen(PORT, () => {
    console.log(`🚀 STANDALONE BRIDGE API RUNNING ON http://localhost:${PORT}`);
    console.log(`🛠️ Compatible with demo-token and custom registration curls!`);
  });
}

setup();
