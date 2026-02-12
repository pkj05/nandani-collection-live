import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cart: any[];
  isOpen: boolean;
  addItem: (newItem: any) => boolean;
  removeItem: (variantId: number, sizeId: number | null) => void;
  updateQuantity: (variantId: number, sizeId: number | null, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      // ... addItem logic (NO CHANGE) ...
      addItem: (newItem) => {
        const { cart } = get();
        const existingItem = cart.find(
          (item: any) =>
            item.id === newItem.id &&
            item.variant_id === newItem.variant_id &&
            (newItem.size_id ? item.size_id === newItem.size_id : true)
        );

        if (existingItem) {
          if (existingItem.quantity < newItem.stock) {
            set({
              cart: cart.map((item: any) =>
                item.variant_id === newItem.variant_id && item.size_id === newItem.size_id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
            return true;
          } else {
            return false;
          }
        } else {
          if (newItem.stock > 0) {
            set({ cart: [...cart, newItem] });
            return true;
          }
          return false;
        }
      },

      // ... removeItem (NO CHANGE) ...
      removeItem: (variantId, sizeId) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.variant_id === variantId && item.size_id === sizeId)
          ),
        }));
      },

      // ✅ FIX HERE: Update Quantity Logic Safe Karo
      updateQuantity: (variantId, sizeId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.variant_id === variantId && item.size_id === sizeId) {
              // Ensure quantity is at least 1 and at most item.stock
              const safeQuantity = Math.max(1, Math.min(quantity, item.stock));
              return { ...item, quantity: safeQuantity };
            }
            return item;
          }),
        }));
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "nandani-cart-v3",
    }
  )
);