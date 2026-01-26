import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Product का टाइप डिफाइन कर रहे हैं (TypeScript के लिए)
interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,

      // सामान जोड़ने का लॉजिक
      addItem: (newItem) => set((state) => {
        // चेक करें कि क्या वही प्रोडक्ट (same id + size) पहले से है?
        const existingItem = state.cart.find(
          (item) => item.id === newItem.id && item.size === newItem.size
        );

        if (existingItem) {
          // अगर है, तो सिर्फ क्वांटिटी बढ़ा दो
          return {
            cart: state.cart.map((item) =>
              item.id === newItem.id && item.size === newItem.size
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
            // यहाँ से isOpen: true हटा दिया गया है
          };
        }

        // अगर नया प्रोडक्ट है, तो लिस्ट में जोड़ दो
        // FIX: यहाँ से भी isOpen: true हटा दिया गया है ताकि पहली बार में ड्रॉर न खुले
        return { 
          cart: [...state.cart, newItem] 
        };
      }),

      removeItem: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'nandani-cart-storage', // localStorage में इस नाम से सेव होगा
    }
  )
);