import 'reflect-metadata';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { SubscriptionPlan, SubscriptionPlanSchema } from './schemas/subscription-plan.schema';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/restro-qr';

async function seed() {
  console.log('🌱 Seeding database...');
  await mongoose.connect(DB_URL);

  const db = mongoose.connection.db!;
  const connection = mongoose.connection; // Get the connection object for models

  // Define models for clearing data using deleteMany
  // Note: These models need to be defined elsewhere in the application for this to work correctly.
  // For the purpose of this seed script, we'll assume they are available or define them minimally.
  // In a real application, you would import your Mongoose models here.
  const userModel = connection.model('User', new mongoose.Schema({}));
  const restaurantModel = connection.model('Restaurant', new mongoose.Schema({}));
  const categoryModel = connection.model('MenuCategory', new mongoose.Schema({}));
  const itemModel = connection.model('MenuItem', new mongoose.Schema({}));
  const orderModel = connection.model('Order', new mongoose.Schema({}));
  const planModel = connection.model('SubscriptionPlan', SubscriptionPlanSchema);

  console.log('🧹 Clearing existing data...');
  await Promise.all([
    userModel.deleteMany({}),
    restaurantModel.deleteMany({}),
    categoryModel.deleteMany({}),
    itemModel.deleteMany({}),
    orderModel.deleteMany({}),
    planModel.deleteMany({}),
    // Add other models here if they are to be cleared this way
    db.dropCollection('tables').catch(() => { }), // Fallback for collections not mapped to models
    db.dropCollection('payments').catch(() => { }),
    db.dropCollection('deliverypartners').catch(() => { }),
    db.dropCollection('trackinglogs').catch(() => { }),
    db.dropCollection('notifications').catch(() => { }),
  ]);

  console.log('🌱 Seeding Subscription Plans...');
  const plans = await planModel.insertMany([
    {
      type: 'basic',
      name: 'Basic Plan',
      price: 29,
      interval: 'month',
      features: ['Up to 50 Items', 'Standard Analytics', 'Basic QR Templates'],
      limits: { maxItems: 50, maxOrders: 500, maxTables: 10, hasAnalytics: true, hasCustomBranding: false },
    },
    {
      type: 'pro',
      name: 'Pro Plan',
      price: 79,
      interval: 'month',
      features: ['Unlimited Items', 'Advanced Analytics', 'Custom Branding', 'Priority Support'],
      limits: { maxItems: 10000, maxOrders: 5000, maxTables: 50, hasAnalytics: true, hasCustomBranding: true },
    },
    {
      type: 'enterprise',
      name: 'Enterprise Plan',
      price: 199,
      interval: 'month',
      features: ['All Pro Features', 'Multi-location', 'API Access', 'Dedicated Manager'],
      limits: { maxItems: 100000, maxOrders: 100000, maxTables: 1000, hasAnalytics: true, hasCustomBranding: true },
    },
  ]);
  console.log('✅ Subscription Plans created dghsdrfghdf hdfhdf fg  gdfgdfghdghdhgdhdhdhdhdhsgsf gsdfghsfgsfgsfdgsgsgsgsg hdfhtfyhdtghysdryhg  dfghdh dthdtyhftghfcg dfvbefbdfh bd  fxdshedth jhfkyo oiyfrouifyouifyo i ');

  // === USERS ===
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await db.collection('users').insertMany([
    {
      name: 'Admin User',
      email: 'admin@restro.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91-9876543210',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Raj Patel',
      email: 'raj@greenleaf.com',
      password: hashedPassword,
      role: 'restaurant_owner',
      phone: '+91-9876543211',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Vikram Singh',
      email: 'vikram@delivery.com',
      password: hashedPassword,
      role: 'delivery_partner',
      phone: '+91-9876543212',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Priya Sharma',
      email: 'priya@customer.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+91-9876543213',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const userIds = users.insertedIds;
  console.log('✅ Users created');

  // === RESTAURANT ===
  const restaurant = await db.collection('restaurants').insertOne({
    name: 'Green Leaf Kitchen',
    slug: 'green-leaf-kitchen',
    logo: '🌿',
    description: 'Fresh, healthy, and delicious meals prepared with locally sourced organic ingredients. Experience the taste of nature!',
    address: {
      street: '42 MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560038',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946,
    },
    contact: {
      phone: '+91-9876543211',
      email: 'raj@greenleaf.com',
      website: 'https://greenleafkitchen.com',
    },
    cuisineType: ['Indian', 'Continental', 'Healthy'],
    operatingHours: [
      { day: 'Monday', open: '10:00', close: '22:00', isClosed: false },
      { day: 'Tuesday', open: '10:00', close: '22:00', isClosed: false },
      { day: 'Wednesday', open: '10:00', close: '22:00', isClosed: false },
      { day: 'Thursday', open: '10:00', close: '22:00', isClosed: false },
      { day: 'Friday', open: '10:00', close: '23:00', isClosed: false },
      { day: 'Saturday', open: '09:00', close: '23:00', isClosed: false },
      { day: 'Sunday', open: '09:00', close: '22:00', isClosed: false },
    ],
    isActive: true,
    ownerId: userIds[1],
    rating: 4.5,
    totalOrders: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const restaurantId = restaurant.insertedId;
  console.log('✅ Restaurant created');

  // === TABLES ===
  const tables: any[] = [];
  for (let i = 1; i <= 10; i++) {
    tables.push({
      restaurantId,
      tableNumber: i,
      capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
      qrCode: `http://localhost:3000/menu?restaurantId=${restaurantId}&table=${i}`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await db.collection('tables').insertMany(tables);
  console.log('✅ Tables created');

  // === MENU CATEGORIES ===
  const categories = await db.collection('menucategories').insertMany([
    { restaurantId, name: 'Starters', description: 'Appetizers and small bites', sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { restaurantId, name: 'Main Course', description: 'Hearty main dishes', sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { restaurantId, name: 'Breads', description: 'Freshly baked breads', sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { restaurantId, name: 'Rice & Biryani', description: 'Rice specialties', sortOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { restaurantId, name: 'Beverages', description: 'Refreshing drinks', sortOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { restaurantId, name: 'Desserts', description: 'Sweet endings', sortOrder: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const catIds = categories.insertedIds;
  console.log('✅ Menu categories created');

  // === MENU ITEMS ===
  const menuItems = [
    // Starters
    { restaurantId, categoryId: catIds[0], name: 'Paneer Tikka', description: 'Cottage cheese marinated in spices and grilled in tandoor', price: 249, image: '🧀', isVeg: true, isAvailable: true, preparationTime: 15, tags: ['bestseller', 'spicy'], sortOrder: 1 },
    { restaurantId, categoryId: catIds[0], name: 'Chicken Wings', description: 'Crispy fried chicken wings with hot sauce', price: 299, image: '🍗', isVeg: false, isAvailable: true, preparationTime: 20, tags: ['spicy', 'popular'], sortOrder: 2 },
    { restaurantId, categoryId: catIds[0], name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 199, image: '🥟', isVeg: true, isAvailable: true, preparationTime: 10, tags: ['crispy'], sortOrder: 3 },
    { restaurantId, categoryId: catIds[0], name: 'Fish Fingers', description: 'Golden fried fish fingers with tartar sauce', price: 349, image: '🐟', isVeg: false, isAvailable: true, preparationTime: 15, tags: ['seafood'], sortOrder: 4 },
    // Main Course
    { restaurantId, categoryId: catIds[1], name: 'Butter Chicken', description: 'Tender chicken in rich creamy tomato gravy', price: 349, image: '🍛', isVeg: false, isAvailable: true, preparationTime: 25, tags: ['bestseller', 'creamy'], sortOrder: 1 },
    { restaurantId, categoryId: catIds[1], name: 'Palak Paneer', description: 'Cottage cheese in smooth spinach gravy', price: 279, image: '🥬', isVeg: true, isAvailable: true, preparationTime: 20, tags: ['healthy', 'popular'], sortOrder: 2 },
    { restaurantId, categoryId: catIds[1], name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with cream and butter', price: 249, image: '🫘', isVeg: true, isAvailable: true, preparationTime: 15, tags: ['creamy', 'comfort'], sortOrder: 3 },
    { restaurantId, categoryId: catIds[1], name: 'Chicken Biryani Bowl', description: 'Fragrant rice with spiced chicken and raita', price: 329, image: '🍚', isVeg: false, isAvailable: true, preparationTime: 30, tags: ['bestseller'], sortOrder: 4 },
    { restaurantId, categoryId: catIds[1], name: 'Mushroom Masala', description: 'Fresh mushrooms in aromatic spicy gravy', price: 259, image: '🍄', isVeg: true, isAvailable: true, preparationTime: 20, tags: ['spicy'], sortOrder: 5 },
    // Breads
    { restaurantId, categoryId: catIds[2], name: 'Butter Naan', description: 'Soft tandoor-baked bread with butter', price: 59, image: '🫓', isVeg: true, isAvailable: true, preparationTime: 8, tags: ['essential'], sortOrder: 1 },
    { restaurantId, categoryId: catIds[2], name: 'Garlic Naan', description: 'Naan topped with garlic and coriander', price: 79, image: '🧄', isVeg: true, isAvailable: true, preparationTime: 8, tags: ['popular'], sortOrder: 2 },
    { restaurantId, categoryId: catIds[2], name: 'Tandoori Roti', description: 'Whole wheat bread from tandoor', price: 39, image: '🫓', isVeg: true, isAvailable: true, preparationTime: 5, tags: ['healthy'], sortOrder: 3 },
    // Rice & Biryani
    { restaurantId, categoryId: catIds[3], name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables and saffron', price: 249, image: '🍚', isVeg: true, isAvailable: true, preparationTime: 25, tags: ['aromatic'], sortOrder: 1 },
    { restaurantId, categoryId: catIds[3], name: 'Mutton Biryani', description: 'Slow-cooked mutton with aromatic basmati rice', price: 399, image: '🥘', isVeg: false, isAvailable: true, preparationTime: 35, tags: ['premium', 'bestseller'], sortOrder: 2 },
    { restaurantId, categoryId: catIds[3], name: 'Jeera Rice', description: 'Cumin-flavored basmati rice', price: 149, image: '🍚', isVeg: true, isAvailable: true, preparationTime: 15, tags: ['basic'], sortOrder: 3 },
    // Beverages
    { restaurantId, categoryId: catIds[4], name: 'Mango Lassi', description: 'Creamy yogurt drink with fresh mango', price: 129, image: '🥭', isVeg: true, isAvailable: true, preparationTime: 5, tags: ['refreshing', 'bestseller'], sortOrder: 1 },
    { restaurantId, categoryId: catIds[4], name: 'Masala Chai', description: 'Traditional Indian spiced tea', price: 69, image: '☕', isVeg: true, isAvailable: true, preparationTime: 5, tags: ['classic'], sortOrder: 2 },
    { restaurantId, categoryId: catIds[4], name: 'Fresh Lime Soda', description: 'Refreshing lime with soda water', price: 89, image: '🍋', isVeg: true, isAvailable: true, preparationTime: 3, tags: ['refreshing'], sortOrder: 3 },
    { restaurantId, categoryId: catIds[4], name: 'Cold Coffee', description: 'Chilled coffee with cream and chocolate', price: 149, image: '🧊', isVeg: true, isAvailable: true, preparationTime: 5, tags: ['popular'], sortOrder: 4 },
    // Desserts
    { restaurantId, categoryId: catIds[5], name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose-flavored sugar syrup', price: 119, image: '🍩', isVeg: true, isAvailable: true, preparationTime: 5, tags: ['classic', 'sweet'], sortOrder: 1 },
    { restaurantId, categoryId: catIds[5], name: 'Rasmalai', description: 'Soft cottage cheese discs in creamy cardamom milk', price: 149, image: '🍮', isVeg: true, isAvailable: true, preparationTime: 5, tags: ['premium'], sortOrder: 2 },
    { restaurantId, categoryId: catIds[5], name: 'Brownie with Ice Cream', description: 'Warm chocolate brownie topped with vanilla ice cream', price: 199, image: '🍫', isVeg: true, isAvailable: true, preparationTime: 10, tags: ['indulgent', 'bestseller'], sortOrder: 3 },
  ];

  const itemsRes = await db.collection('menuitems').insertMany(
    menuItems.map(item => ({ ...item, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log('✅ Menu items created (' + menuItems.length + ' items)');

  // === DELIVERY PARTNER ===
  await db.collection('deliverypartners').insertOne({
    userId: userIds[2],
    name: 'Vikram Singh',
    phone: '+91-9876543212',
    vehicleType: 'bike',
    vehicleNumber: 'KA-01-AB-1234',
    isAvailable: true,
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    totalDeliveries: 42,
    rating: 4.7,
    createdAt: new Date(),
  });
  console.log('✅ Delivery partner created');

  // === DEMO ORDERS ===
  const itemIds = Object.values(itemsRes.insertedIds);
  const statuses = ['delivered', 'delivered', 'delivered', 'preparing', 'confirmed'];
  const orders: any[] = [];

  for (let i = 0; i < 5; i++) {
    const orderItems = [
      { menuItemId: itemIds[0], name: menuItems[0].name, price: menuItems[0].price, quantity: 2, isVeg: true },
      { menuItemId: itemIds[4], name: menuItems[4].name, price: menuItems[4].price, quantity: 1, isVeg: false },
      { menuItemId: itemIds[9], name: menuItems[9].name, price: menuItems[9].price, quantity: 3, isVeg: true },
    ];
    const subtotal = orderItems.reduce((s, item) => s + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = 40;

    orders.push({
      orderNumber: `ORD-DEMO-${String(i + 1).padStart(3, '0')}`,
      restaurantId,
      customerName: `Demo Customer ${i + 1}`,
      customerPhone: `+91-98765432${14 + i}`,
      customerEmail: `customer${i + 1}@demo.com`,
      deliveryAddress: { street: `${100 + i} Demo Street`, city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
      tableNumber: i + 1,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total: subtotal + tax + deliveryFee,
      status: statuses[i],
      paymentStatus: 'paid',
      notes: i === 3 ? 'Extra spicy please' : undefined,
      createdAt: new Date(Date.now() - (4 - i) * 3600000),
      updatedAt: new Date(),
    });
  }

  await db.collection('orders').insertMany(orders);
  console.log('✅ Demo orders created');

  console.log('\n🎉 Seed complete!\n');
  console.log('Demo credentials:');
  console.log('  Admin:    admin@restro.com / password123');
  console.log('  Owner:    raj@greenleaf.com / password123');
  console.log('  Delivery: vikram@delivery.com / password123');
  console.log('  Customer: priya@customer.com / password123');
  console.log(`\n  Restaurant ID: ${restaurantId}`);
  console.log(`  Menu URL: http://localhost:3000/menu?restaurantId=${restaurantId}&table=5`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
