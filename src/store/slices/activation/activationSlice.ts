import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type {
  ActivationDto,
  KeyStateDto,
  ServiceActivationDto,
  TargetOptionDto,
} from '@/store/api/types';

/** Результат проверки ключа, перенесённый с главной на страницу активации.
 *
 *  Держим в сторе, чтобы переход с главной не стоил второго запроса:
 *  инструкция, поля формы и состояние ключа уже приехали с verify-key.
 *  Страница активации всё равно умеет запросить их сама — по прямой
 *  ссылке или после F5 стора нет, и это нормальный путь, а не ошибка.
 *
 *  `targets` здесь принципиальны: это состав формы, и приходит он от
 *  бэкенда, потому что зависит от поставщика конкретной карты. Захардкодить
 *  его на витрине нельзя — один и тот же сервис у разных поставщиков
 *  просит разные данные.
 */
export interface ActivationState {
  code: string | null;
  service: ServiceActivationDto | null;
  key: KeyStateDto | null;
  targets: TargetOptionDto[];
  canActivate: boolean;
  /** Почему активировать нельзя. Пусто, если можно. */
  message: string;
  /** Идущая или завершённая активация. Появляется после запуска, а
   *  также сразу после verify-key, если по ключу уже что-то идёт. */
  activation: ActivationDto | null;
}

const initialState: ActivationState = {
  code: null,
  service: null,
  key: null,
  targets: [],
  canActivate: false,
  message: '',
  activation: null,
};

export const activationSlice = createSlice({
  name: 'activation',
  initialState,
  reducers: {
    keyVerified: (
      state,
      {
        payload,
      }: PayloadAction<{
        code: string;
        service: ServiceActivationDto;
        key: KeyStateDto;
        targets: TargetOptionDto[];
        canActivate: boolean;
        message: string;
        activation: ActivationDto | null;
      }>,
    ) => {
      state.code = payload.code;
      state.service = payload.service;
      state.key = payload.key;
      state.targets = payload.targets;
      state.canActivate = payload.canActivate;
      state.message = payload.message;
      state.activation = payload.activation;
    },

    /** Активация запущена или её статус обновился после опроса. */
    activationUpdated: (state, { payload }: PayloadAction<ActivationDto>) => {
      state.activation = payload;
      state.key = payload.key;
      // Пока идёт или уже прошла — форму показывать нечего.
      state.canActivate = false;
    },

    /** Повтор после неудачи: возвращаем форму, оставляя ключ на месте. */
    activationRetried: (state) => {
      state.activation = null;
      state.canActivate = true;
      state.message = '';
    },

    activationReset: () => initialState,
  },
});

export const {
  keyVerified,
  activationUpdated,
  activationRetried,
  activationReset,
} = activationSlice.actions;

export const activationReducer = activationSlice.reducer;
