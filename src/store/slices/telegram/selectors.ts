import type { RootState } from '@/store/store';

export const selectTelegram = (state: RootState) => state.telegram;

export const selectIsMiniApp = (state: RootState) =>
  state.telegram.mode === 'mini_app';

export const selectIsModeKnown = (state: RootState) =>
  state.telegram.mode !== 'unknown';

export const selectWebAppAuth = (state: RootState) => state.telegram.auth;
