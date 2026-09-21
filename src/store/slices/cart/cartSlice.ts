import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'k30.cart';

export interface CartItem {
  service: string;
  plan: string;
}

export interface CartState {
  item: CartItem | null;
  isReady: boolean;
}

const initialState: CartState = { item: null, isReady: false };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    planChosen: (state, { payload }: PayloadAction<CartItem>) => {
      state.item = payload;
      state.isReady = true;
      cartStorage.write(payload);
    },
    cartCleared: (state) => {
      state.item = null;
      cartStorage.write(null);
    },
    cartHydrated: (state, { payload }: PayloadAction<CartItem | null>) => {
      state.item = payload;
      state.isReady = true;
    },
  },
});

export const { planChosen, cartCleared, cartHydrated } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

export const cartStorage = {
  read(): CartItem | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as Partial<CartItem>;
      if (!parsed?.service || !parsed?.plan) return null;

      return { service: parsed.service, plan: parsed.plan };
    } catch {
      return null;
    }
  },
  write(item: CartItem | null) {
    if (typeof window === 'undefined') return;
    try {
      if (item) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  },
};
