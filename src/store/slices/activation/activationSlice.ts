import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type {
  ActivationDto,
  KeyStateDto,
  ServiceActivationDto,
  TargetOptionDto,
} from '@/store/api/types';

export interface ActivationState {
  code: string | null;
  service: ServiceActivationDto | null;
  key: KeyStateDto | null;
  targets: TargetOptionDto[];
  canActivate: boolean;
  message: string;
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

    activationUpdated: (state, { payload }: PayloadAction<ActivationDto>) => {
      state.activation = payload;
      state.key = payload.key;
      state.canActivate = false;
    },

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
