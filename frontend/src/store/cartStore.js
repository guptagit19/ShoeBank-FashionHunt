import { create } from 'zustand';
import { cartApi } from '../services/api';

const useCartStore = create((set, get) => ({
    cart: null,
    loading: false,
    error: null,

    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const response = await cartApi.get();
            set({ cart: response.data.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    addToCart: async (item) => {
        set({ loading: true, error: null });
        try {
            const response = await cartApi.add(item);
            set({ cart: response.data.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    updateQuantity: async (itemId, quantity) => {
        set({ loading: true, error: null });
        try {
            const response = await cartApi.update(itemId, quantity);
            set({ cart: response.data.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
        }
    },

    removeItem: async (itemId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartApi.remove(itemId);
            set({ cart: response.data.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
        }
    },

    clearCart: async () => {
        set({ loading: true, error: null });
        try {
            await cartApi.clear();
            set({ cart: null, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
        }
    },

    getItemCount: () => {
        const cart = get().cart;
        return cart?.totalItems || 0;
    },
}));

export default useCartStore;
