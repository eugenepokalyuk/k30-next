import type { RootState } from '@/store/store';

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthorized = (state: RootState) =>
  Boolean(state.auth.access);
export const selectIsAuthReady = (state: RootState) => state.auth.isReady;
