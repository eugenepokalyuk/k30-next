import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { k30Api } from './api/k30Api';
import { activationReducer } from './slices/activation/activationSlice';
import { authReducer } from './slices/auth/authSlice';
import { cartReducer } from './slices/cart/cartSlice';
import { telegramReducer } from './slices/telegram/telegramSlice';

export const store = configureStore({
  reducer: {
    [k30Api.reducerPath]: k30Api.reducer,
    activation: activationReducer,
    auth: authReducer,
    cart: cartReducer,
    telegram: telegramReducer,
  },
  middleware: (getDefault) => getDefault().concat(k30Api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

if (typeof window !== 'undefined') {
  setupListeners(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
