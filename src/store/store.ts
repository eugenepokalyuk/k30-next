import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { k30Api } from './api/k30Api';
import { activationReducer } from './slices/activation/activationSlice';
import { authReducer } from './slices/auth/authSlice';

export const store = configureStore({
  reducer: {
    [k30Api.reducerPath]: k30Api.reducer,
    activation: activationReducer,
    auth: authReducer,
  },
  // RTK Query держит на middleware кэш, дедупликацию запросов и статусы
  // загрузки — без него хуки работать не будут.
  middleware: (getDefault) => getDefault().concat(k30Api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Без этого RTK Query не узнаёт, что вкладку увели в фон и вернули обратно,
// — и `skipPollingIfUnfocused` в опросе активации превращается из паузы в
// замок.
if (typeof window !== 'undefined') {
  setupListeners(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
