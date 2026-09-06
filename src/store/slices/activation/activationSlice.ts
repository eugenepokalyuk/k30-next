import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type {
  ActivationDto,
  KeyStateDto,
  ServiceActivationDto,
  TargetOptionDto,
} from '@/store/api/types';

/** Результат проверки ключа, перенесённый с главной на страницу активации */
export interface ActivationState {
  code: string | null;
  service: ServiceActivationDto | null;
  key: KeyStateDto | null;
  targets: TargetOptionDto[];
  canActivate: boolean;
  /** Почему активировать нельзя */
  message: string;
  /** Идущая или завершённая активация */
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

    /** Активация запущена или её статус обновился после опроса */
    activationUpdated: (state, { payload }: PayloadAction<ActivationDto>) => {
      state.activation = payload;
      state.key = payload.key;
      // Пока идёт или уже прошла — форму показывать нечего
      state.canActivate = false;
    },

    /** Повтор после неудачи: возвращаем форму, оставляя ключ на месте */
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
