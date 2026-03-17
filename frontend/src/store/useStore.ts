import { create } from 'zustand';

interface Model {
  id: string;
  name: string;
  category: string;
  // more properties to map from DB
}

interface AppState {
  modelCart: Model[];
  fetchCart: () => Promise<void>;
  addToCart: (model: Model) => Promise<void>;
  removeFromCart: (modelId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  modelCart: [],
  fetchCart: async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        // Backend returns cartItems which contain a model property
        const models = data.map((item: any) => ({
          ...item.model,
          id: item.model.id // ensures id is correct
        }));
        set({ modelCart: models });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  },
  addToCart: async (model) => {
    // Add locally first
    set((state) => {
      if (state.modelCart.find(m => m.id === model.id)) return state;
      return { modelCart: [...state.modelCart, model] };
    });

    // Sync with backend if logged in
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: model.id })
      });
    } catch (error) {
      console.error('Error adding to backend cart:', error);
    }
  },
  removeFromCart: async (modelId) => {
    set((state) => ({
      modelCart: state.modelCart.filter((m) => m.id !== modelId)
    }));

    try {
      await fetch(`/api/cart/${modelId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error removing from backend cart:', error);
    }
  },
  clearCart: async () => {
    set({ modelCart: [] });
    try {
      await fetch('/api/cart', { method: 'DELETE' });
    } catch (error) {
      console.error('Error clearing backend cart:', error);
    }
  }
}));
