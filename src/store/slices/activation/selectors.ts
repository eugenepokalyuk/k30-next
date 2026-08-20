import type { RootState } from '@/store/store';

export const selectActivation = (state: RootState) => state.activation;

/** Данные для конкретного кода. Если в сторе лежит другой ключ (перешли
 *  по чужой ссылке, поменяли код в адресной строке) — считаем, что
 *  ничего нет, и страница запросит всё заново. */
export const selectActivationFor = (code: string) => (state: RootState) =>
  state.activation.code === code ? state.activation : null;
