'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isVeg: boolean;
}

interface CartState {
  restaurantId: string | null;
  tableNumber: number | null;
  items: CartItem[];
  setRestaurant: (restaurantId: string, tableNumber: number | null) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      tableNumber: null,
      items: [],

      setRestaurant: (restaurantId, tableNumber) => set({ restaurantId, tableNumber }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.menuItemId === item.menuItemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItemId === item.menuItemId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.menuItemId !== menuItemId),
        })),

      updateQuantity: (menuItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.menuItemId !== menuItemId) };
          }
          return {
            items: state.items.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            ),
          };
        }),

      clearCart: () => set({ items: [], restaurantId: null, tableNumber: null }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getTax: () => Math.round(get().getSubtotal() * 0.05 * 100) / 100,
      getDeliveryFee: () => (get().items.length > 0 ? 40 : 0),
      getTotal: () => get().getSubtotal() + get().getTax() + get().getDeliveryFee(),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'restro-cart' }
  )
);
