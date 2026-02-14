import { create } from 'zustand';
import { authApi } from '../services/api';

const useAuthStore = create((set) => ({
    isAuthenticated: !!localStorage.getItem('adminToken'),
    admin: null,
    loading: false,

    login: async (username, password) => {
        set({ loading: true });
        try {
            const response = await authApi.login({ username, password });
            const { token, username: adminUsername, name } = response.data.data;

            localStorage.setItem('adminToken', token);
            set({
                isAuthenticated: true,
                admin: { username: adminUsername, name },
                loading: false
            });

            return response.data;
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        set({ isAuthenticated: false, admin: null });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            set({ isAuthenticated: false });
            return false;
        }

        try {
            const response = await authApi.verify();
            const isValid = response.data.data;
            if (!isValid) {
                localStorage.removeItem('adminToken');
                set({ isAuthenticated: false });
            }
            return isValid;
        } catch {
            localStorage.removeItem('adminToken');
            set({ isAuthenticated: false });
            return false;
        }
    },
}));

export default useAuthStore;
