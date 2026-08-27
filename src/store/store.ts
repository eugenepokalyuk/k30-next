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

// Без этого RTK Query не узнаёт, что вкладку увели в фон и вернули
// обратно, — и `skipPollingIfUnfocused` в опросе активации превращается
// из паузы в замок.
//
// Флаг «вкладка на виду» RTK Query вычисляет один раз, при создании
// стора (`focused: isDocumentVisible()`), а дальше двигает только по
// событиям, на которые подписывает `setupListeners`. Не подписаны —
// значение застывает навсегда. Открыли ссылку из мессенджера в фоновой
// вкладке (обычное дело: ссылку присылают, её открывают, читают дальше)
// — стор создался при `hidden`, опрос статуса не начинался вовсе, и
// экран ожидания висел, что бы ни отвечал бэкенд. Помогала только
// перезагрузка страницы.
//
// Только в браузере: на сервере ни `document`, ни `window` нет, а стор
// импортируется и при сборке статики.
if (typeof window !== 'undefined') {
  setupListeners(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
