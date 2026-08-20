import { configureStore } from '@reduxjs/toolkit';

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
