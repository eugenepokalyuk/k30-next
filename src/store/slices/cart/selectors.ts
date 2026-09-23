import type { RootState } from '@/store/store';

export const selectCartItem = (state: RootState) => state.cart.item;
export const selectCartReady = (state: RootState) => state.cart.isReady;
export const selectCartPromo = (state: RootState) => state.cart.promo;
