'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { api } from '../../lib/api';
import Link from 'next/link';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg: boolean;
  preparationTime: number;
  tags: string[];
}

interface MenuCategory {
  _id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

function MenuContent() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId') || '';
  const table = searchParams.get('table');

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const { items, addItem, updateQuantity, getItemCount, getTotal, setRestaurant: setCartRestaurant } = useCartStore();

  useEffect(() => {
    if (!restaurantId) return;
    setCartRestaurant(restaurantId, table ? parseInt(table) : null);

    async function loadMenu() {
      try {
        const [restData, menuData] = await Promise.all([
          api.getRestaurant(restaurantId).catch(() => ({
            name: 'Green Leaf Kitchen',
            description: 'Fresh, healthy, and delicious meals',
            logo: '🌿',
            cuisineType: ['Indian', 'Continental'],
            rating: 4.5,
          })),
          api.getFullMenu(restaurantId).catch(() => getDemoMenu()),
        ]);
        setRestaurant(restData);
        setMenu(menuData);
        if (menuData.length > 0) setActiveCategory(menuData[0]._id || menuData[0].name);
      } catch {
        setRestaurant({
          name: 'Green Leaf Kitchen',
          description: 'Fresh, healthy, and delicious meals',
          logo: '🌿',
          cuisineType: ['Indian', 'Continental'],
          rating: 4.5,
        });
        setMenu(getDemoMenu());
        const demoMenu = getDemoMenu();
        if (demoMenu.length > 0) setActiveCategory(demoMenu[0]._id || demoMenu[0].name);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [restaurantId]);

  const getItemQuantity = (menuItemId: string) => {
    const item = items.find((i) => i.menuItemId === menuItemId);
    return item?.quantity || 0;
  };

  const handleAddItem = (item: MenuItem) => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: item.discountPrice || item.price,
      image: item.image,
      isVeg: item.isVeg,
    });
  };

  const filteredMenu = menu.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-6 rounded-b-[28px]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
              {restaurant?.logo || '🍽️'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{restaurant?.name || 'Restaurant'}</h1>
              <p className="text-primary-100 text-sm">
                {restaurant?.cuisineType?.join(' • ') || 'Multi-cuisine'}
                {table && <span className="ml-2">• Table {table}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-100">
            <span>⭐ {restaurant?.rating || 4.5}</span>
            <span>•</span>
            <span>🕐 20-30 min</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Search */}
        <div className="relative -mt-5 mb-4">
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 shadow-elevated text-sm border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        </div>

        {/* Category Tabs */}
        <div ref={categoryScrollRef} className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mb-4">
          {menu.map((cat) => (
            <button
              key={cat._id || cat.name}
              onClick={() => setActiveCategory(cat._id || cat.name)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === (cat._id || cat.name)
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-text-secondary border border-surface-border hover:bg-primary-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {filteredMenu.map((category) => (
            <div key={category._id || category.name}>
              {(!activeCategory || activeCategory === (category._id || category.name) || searchQuery) && (
                <>
                  <h2 className="text-lg font-bold text-text-primary mb-3 mt-4">
                    {category.name}
                    <span className="text-sm font-normal text-text-muted ml-2">
                      ({category.items.length})
                    </span>
                  </h2>
                  <AnimatePresence>
                    {category.items.map((item, idx) => {
                      const qty = getItemQuantity(item._id);
                      return (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="card p-4 mb-3 flex gap-4"
                        >
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}>
                                <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                              </span>
                              {item.tags?.includes('bestseller') && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                  ⭐ Bestseller
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-text-primary">{item.name}</h3>
                            <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-bold text-text-primary">₹{item.discountPrice || item.price}</span>
                              {item.discountPrice && (
                                <span className="text-sm text-text-muted line-through">₹{item.price}</span>
                              )}
                            </div>
                          </div>

                          {/* Image + Add */}
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center text-4xl mb-2 overflow-hidden">
                              {item.image || '🍽️'}
                            </div>
                            {qty === 0 ? (
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAddItem(item)}
                                className="bg-white border-2 border-primary-500 text-primary-600 font-bold text-sm px-6 py-1.5 rounded-xl hover:bg-primary-50 transition-colors -mt-5 shadow-md"
                              >
                                ADD
                              </motion.button>
                            ) : (
                              <div className="flex items-center bg-primary-500 rounded-xl -mt-5 shadow-md overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item._id, qty - 1)}
                                  className="text-white font-bold px-3 py-1.5 hover:bg-primary-600"
                                >
                                  −
                                </button>
                                <span className="text-white font-bold px-2 text-sm">{qty}</span>
                                <button
                                  onClick={() => updateQuantity(item._id, qty + 1)}
                                  className="text-white font-bold px-3 py-1.5 hover:bg-primary-600"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Cart */}
      {getItemCount() > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-primary-500 text-white px-4 py-4 shadow-sticky z-50"
        >
          <Link href="/cart">
            <div className="max-w-lg mx-auto flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold">{getItemCount()} item{getItemCount() > 1 ? 's' : ''}</span>
                <span className="mx-2">|</span>
                <span className="font-bold">₹{Math.round(getTotal())}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                View Cart
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function getDemoMenu(): MenuCategory[] {
  return [
    {
      _id: 'cat1', name: 'Starters', description: 'Appetizers', items: [
        { _id: 'item1', name: 'Paneer Tikka', description: 'Cottage cheese marinated in spices and grilled', price: 249, image: '🧀', isVeg: true, preparationTime: 15, tags: ['bestseller'] },
        { _id: 'item2', name: 'Chicken Wings', description: 'Crispy fried wings with hot sauce', price: 299, image: '🍗', isVeg: false, preparationTime: 20, tags: ['spicy'] },
        { _id: 'item3', name: 'Spring Rolls', description: 'Crispy vegetable rolls with sweet chili sauce', price: 199, image: '🥟', isVeg: true, preparationTime: 10, tags: [] },
      ],
    },
    {
      _id: 'cat2', name: 'Main Course', description: 'Hearty mains', items: [
        { _id: 'item4', name: 'Butter Chicken', description: 'Tender chicken in rich creamy tomato gravy', price: 349, image: '🍛', isVeg: false, preparationTime: 25, tags: ['bestseller'] },
        { _id: 'item5', name: 'Palak Paneer', description: 'Cottage cheese in smooth spinach gravy', price: 279, image: '🥬', isVeg: true, preparationTime: 20, tags: [] },
        { _id: 'item6', name: 'Dal Makhani', description: 'Black lentils slow-cooked with cream and butter', price: 249, image: '🫘', isVeg: true, preparationTime: 15, tags: [] },
      ],
    },
    {
      _id: 'cat3', name: 'Breads', description: 'Fresh breads', items: [
        { _id: 'item7', name: 'Butter Naan', description: 'Soft tandoor-baked bread with butter', price: 59, image: '🫓', isVeg: true, preparationTime: 8, tags: [] },
        { _id: 'item8', name: 'Garlic Naan', description: 'Naan topped with garlic and coriander', price: 79, image: '🧄', isVeg: true, preparationTime: 8, tags: [] },
      ],
    },
    {
      _id: 'cat4', name: 'Beverages', description: 'Drinks', items: [
        { _id: 'item9', name: 'Mango Lassi', description: 'Creamy yogurt drink with fresh mango', price: 129, image: '🥭', isVeg: true, preparationTime: 5, tags: ['bestseller'] },
        { _id: 'item10', name: 'Masala Chai', description: 'Traditional Indian spiced tea', price: 69, image: '☕', isVeg: true, preparationTime: 5, tags: [] },
      ],
    },
    {
      _id: 'cat5', name: 'Desserts', description: 'Sweet endings', items: [
        { _id: 'item11', name: 'Gulab Jamun', description: 'Soft dumplings in rose sugar syrup', price: 119, image: '🍩', isVeg: true, preparationTime: 5, tags: [] },
        { _id: 'item12', name: 'Brownie Ice Cream', description: 'Warm brownie with vanilla ice cream', price: 199, image: '🍫', isVeg: true, preparationTime: 10, tags: ['bestseller'] },
      ],
    },
  ];
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>}>
      <MenuContent />
    </Suspense>
  );
}
