import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoginModalOpen: false,
      setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
      login: (userData, token) => set({ user: userData, token, isLoginModalOpen: false }),
      logout: () => set({ user: null, token: null }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
    }),
    {
      name: 'auth-storage', // name of item in the storage (must be unique)
    }
  )
);
