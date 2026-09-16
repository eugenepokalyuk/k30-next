import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TelegramMode = 'unknown' | 'browser' | 'mini_app';

/** Что мешает бесшовному входу — если мешает */
export type TelegramAuthState =
  | 'idle'
  | 'signing_in'
  | 'needs_email'
  | 'signed_in'
  | 'failed';

export interface TelegramState {
  mode: TelegramMode;
  auth: TelegramAuthState;
  initData: string;
  error: string;
}

const initialState: TelegramState = {
  mode: 'unknown',
  auth: 'idle',
  initData: '',
  error: '',
};

export const telegramSlice = createSlice({
  name: 'telegram',
  initialState,
  reducers: {
    modeDetected: (
      state,
      { payload }: PayloadAction<{ mode: TelegramMode; initData?: string }>,
    ) => {
      state.mode = payload.mode;
      state.initData = payload.initData ?? '';
    },
    webAppAuthStarted: (state) => {
      state.auth = 'signing_in';
      state.error = '';
    },
    webAppNeedsEmail: (state) => {
      state.auth = 'needs_email';
    },
    webAppSignedIn: (state) => {
      state.auth = 'signed_in';
      state.error = '';
    },
    webAppAuthFailed: (state, { payload }: PayloadAction<string>) => {
      state.auth = 'failed';
      state.error = payload;
    },
  },
});

export const {
  modeDetected,
  webAppAuthStarted,
  webAppNeedsEmail,
  webAppSignedIn,
  webAppAuthFailed,
} = telegramSlice.actions;

export const telegramReducer = telegramSlice.reducer;
