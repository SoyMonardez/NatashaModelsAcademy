import { create } from 'zustand';

interface Model {
  id: string;
  name: string;
  category: string;
  // more properties to map from DB
}

interface AppState {
  modelCart: Model[];
  addToCart: (model: Model) => void;
  removeFromCart: (modelId: string) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>((set) => ({
  modelCart: [],
  addToCart: (model) => set((state) => {
    // Prevent duplicates
    if (state.modelCart.find(m => m.id === model.id)) return state;
    return { modelCart: [...state.modelCart, model] };
  }),
  removeFromCart: (modelId) => set((state) => ({
    modelCart: state.modelCart.filter((m) => m.id !== modelId)
  })),
  clearCart: () => set({ modelCart: [] })
}));
