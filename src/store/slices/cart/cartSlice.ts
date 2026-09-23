import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'k30.cart';

export interface CartItem {
  service: string;
  plan: string;
}

export interface CartState {
  item: CartItem | null;
  promo: string;
  isReady: boolean;
}

export interface StoredCart {
  item: CartItem | null;
  promo: string;
}

const initialState: CartState = { item: null, promo: '', isReady: false };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    planChosen: (state, { payload }: PayloadAction<CartItem>) => {
      state.item = payload;
      state.isReady = true;
      cartStorage.write({ item: payload, promo: state.promo });
    },
    promoApplied: (state, { payload }: PayloadAction<string>) => {
      state.promo = payload;
      cartStorage.write({ item: state.item, promo: payload });
    },
    promoCleared: (state) => {
      state.promo = '';
      cartStorage.write({ item: state.item, promo: '' });
    },
    cartCleared: (state) => {
      state.item = null;
      state.promo = '';
      cartStorage.write(null);
    },
    cartHydrated: (state, { payload }: PayloadAction<StoredCart>) => {
      state.item = payload.item;
      state.promo = payload.promo;
      state.isReady = true;
    },
  },
});

export const {
  planChosen,
  promoApplied,
  promoCleared,
  cartCleared,
  cartHydrated,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

export const cartStorage = {
  read(): StoredCart {
    const empty: StoredCart = { item: null, promo: '' };
    if (typeof window === 'undefined') return empty;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;

      const parsed = JSON.parse(raw) as Partial<CartItem> & { promo?: string };
      const promo = typeof parsed?.promo === 'string' ? parsed.promo : '';

      if (!parsed?.service || !parsed?.plan) return { item: null, promo };

      return { item: { service: parsed.service, plan: parsed.plan }, promo };
    } catch {
      return empty;
    }
  },
  write(cart: StoredCart | null) {
    if (typeof window === 'undefined') return;
    try {
      if (!cart?.item && !cart?.promo) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...cart.item, promo: cart.promo }),
      );
    } catch {
    }
  },
};
