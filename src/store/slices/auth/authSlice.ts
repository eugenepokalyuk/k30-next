import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthResponse, UserDto } from '@/store/api/types';

/** Ключ в localStorage. Только refresh: access живёт в памяти и
 *  протухает за полчаса, класть его на диск смысла нет. */
const STORAGE_KEY = 'k30.refresh';

export interface AuthState {
  access: string | null;
  refresh: string | null;
  user: UserDto | null;
  /** false, пока не прочитали localStorage и не обменяли refresh на
   *  access. До этого «не залогинен» — ещё не ответ, и кабинет не должен
   *  успеть отправить пользователя на страницу входа. */
  isReady: boolean;
}

const initialState: AuthState = {
  access: null,
  refresh: null,
  user: null,
  isReady: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Успешный вход или регистрация. */
    signedIn: (state, { payload }: PayloadAction<AuthResponse>) => {
      state.access = payload.access;
      state.refresh = payload.refresh;
      state.user = payload.user;
      state.isReady = true;
    },
    /** Обновление пары по refresh — профиль при этом не меняется. */
    tokenRefreshed: (
      state,
      { payload }: PayloadAction<{ access: string; refresh?: string }>,
    ) => {
      state.access = payload.access;
      if (payload.refresh) state.refresh = payload.refresh;
    },
    profileLoaded: (state, { payload }: PayloadAction<UserDto>) => {
      state.user = payload;
    },
    /** Прочитали localStorage: токен есть или его нет. */
    hydrated: (state, { payload }: PayloadAction<string | null>) => {
      state.refresh = payload;
      state.isReady = payload === null;
    },
    ready: (state) => {
      state.isReady = true;
    },
    signedOut: () => ({ ...initialState, isReady: true }),
  },
});

export const {
  signedIn,
  tokenRefreshed,
  profileLoaded,
  hydrated,
  ready,
  signedOut,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

/** Чтение и запись refresh-токена.
 *
 *  Вынесено сюда, а не размазано по компонентам: доступ к localStorage
 *  падает в приватном режиме Safari и в SSR, и проверка нужна одна.
 */
export const authStorage = {
  read(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  write(token: string | null) {
    if (typeof window === 'undefined') return;
    try {
      if (token) window.localStorage.setItem(STORAGE_KEY, token);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Приватный режим или запрет хранилища: вход продолжит работать,
      // просто не переживёт перезагрузку вкладки.
    }
  },
};
