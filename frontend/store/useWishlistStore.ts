import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  wishlist: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      // विशलिस्ट में आइटम जोड़ना
      addToWishlist: (product) => {
        const { wishlist } = get();
        const isExist = wishlist.find((item: any) => item.id === product.id);
        if (!isExist) {
          set({ wishlist: [...wishlist, product] });
        }
      },

      // विशलिस्ट से हटाना
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        }));
      },

      // चेक करना कि आइटम विशलिस्ट में है या नहीं
      isInWishlist: (productId) => {
        return get().wishlist.some((item: any) => item.id === productId);
      },

      // पूरी विशलिस्ट खाली करना
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "nandani-wishlist-v1", // यूनिक नाम ताकि कार्ट से न टकराए
    }
  )
);