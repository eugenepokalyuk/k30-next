import type { RootState } from '@/store/store';

export const selectActivation = (state: RootState) => state.activation;

/** Данные для конкретного кода */
export const selectActivationFor = (code: string) => (state: RootState) =>
  state.activation.code === code ? state.activation : null;
