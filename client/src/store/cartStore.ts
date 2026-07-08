import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User } from '@lumen-x-deli/shared';

interface State {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  
  // Cart operations
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, variantId?: string, customBuildId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string, customBuildId?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist operations
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth operations
  setUser: (user: User | null) => void;
  logoutStore: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      user: null,

      addToCart: (item) => {
        const cart = get().cart;
        const qty = item.quantity ?? 1;

        const existingIndex = cart.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantId === item.variantId &&
            i.customBuildId === item.customBuildId
        );

        if (existingIndex > -1) {
          const updatedCart = [...cart];
          updatedCart[existingIndex].quantity += qty;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, { ...item, quantity: qty } as CartItem] });
        }
      },

      removeFromCart: (productId, variantId, customBuildId) => {
        set({
          cart: get().cart.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.variantId === variantId &&
                i.customBuildId === customBuildId
              )
          ),
        });
      },

      updateQuantity: (productId, quantity, variantId, customBuildId) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId, customBuildId);
          return;
        }

        set({
          cart: get().cart.map((i) =>
            i.productId === productId &&
            i.variantId === variantId &&
            i.customBuildId === customBuildId
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some((p) => p.id === product.id);

        if (exists) {
          set({ wishlist: wishlist.filter((p) => p.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p.id === productId);
      },

      setUser: (user) => set({ user }),

      logoutStore: () => set({ user: null, cart: [] }),
    }),
    {
      name: 'lumen-x-deli-storage', // localStorage key
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }),
    }
  )
);
