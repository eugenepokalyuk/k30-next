import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import {
  authStorage,
  signedIn,
  signedOut,
  tokenRefreshed,
} from '@/store/slices/auth/authSlice';
import type { RootState } from '@/store/store';

import type {
  ActivateResponse,
  ActivationDto,
  ActivationStatusResponse,
  AdvantageDto,
  AuthOptionsDto,
  AuthResponse,
  CheckAccountResponse,
  EmailCodeRequestDto,
  EmailLoginResponse,
  FaqEntryDto,
  HowStepDto,
  OrderDto,
  ServiceDto,
  SiteSettingsDto,
  SubscriptionDto,
  TargetKind,
  TelegramStartDto,
  TelegramStatusResponse,
  UserDto,
  VerifyKeyResponse,
} from './types';

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const { access } = (getState() as RootState).auth;
    if (access) headers.set('Authorization', `Bearer ${access}`);
    return headers;
  },
});

/** Обёртка, которая один раз обновляет access по refresh и повторяет запрос */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  const { refresh } = (api.getState() as RootState).auth;
  if (!refresh) return result;

  const refreshed = await rawBaseQuery(
    { url: 'auth/refresh', method: 'POST', body: { refresh } },
    api,
    extraOptions,
  );

  const data = refreshed.data as
    { access?: string; refresh?: string } | undefined;
  if (!data?.access) {
    authStorage.write(null);
    api.dispatch(signedOut());
    return result;
  }

  api.dispatch(tokenRefreshed({ access: data.access, refresh: data.refresh }));
  if (data.refresh) authStorage.write(data.refresh);

  result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const k30Api = createApi({
  reducerPath: 'k30Api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Me', 'Orders', 'Activations'],
  endpoints: (builder) => ({
    services: builder.query<ServiceDto[], void>({
      query: () => 'services/',
    }),

    /** Шаг 1 */
    verifyKey: builder.mutation<VerifyKeyResponse, string>({
      query: (key) => ({ url: 'verify-key', method: 'POST', body: { key } }),
    }),

    /** Шаг 2 */
    checkAccount: builder.mutation<
      CheckAccountResponse,
      { key: string; kind: TargetKind; value: string }
    >({
      query: (body) => ({ url: 'check-account', method: 'POST', body }),
    }),

    /** Шаг 3 */
    activate: builder.mutation<
      ActivateResponse,
      { key: string; kind: TargetKind; value: string }
    >({
      query: (body) => ({ url: 'activate', method: 'POST', body }),
      // Заказ в кабинете заводится по итогу активации — списки перечитать
      invalidatesTags: ['Orders', 'Activations'],
    }),

    /** Шаг 4 */
    activationStatus: builder.query<ActivationStatusResponse, string>({
      query: (id) => `activations/${id}`,
      providesTags: ['Activations'],
    }),

    cancelActivation: builder.mutation<
      { success: boolean; error: string; activation: ActivationDto },
      string
    >({
      query: (id) => ({ url: `activations/${id}/cancel`, method: 'POST' }),
      invalidatesTags: ['Activations'],
    }),

    /**
     *  Ссылки и подписи витрины из админки
     */
    siteSettings: builder.query<SiteSettingsDto, void>({
      query: () => 'site-settings',
    }),

    /** Частые вопросы с главной */
    faq: builder.query<FaqEntryDto[], void>({
      query: () => 'faq',
    }),

    /** Плитки блока «Почему мы» */
    advantages: builder.query<AdvantageDto[], void>({
      query: () => 'advantages',
    }),

    /** Шаги блока «Как это работает» */
    howSteps: builder.query<HowStepDto[], void>({
      query: () => 'how-steps',
    }),

    /** Что показать на экране входа */
    authOptions: builder.query<AuthOptionsDto, void>({
      query: () => 'auth/options',
    }),

    /** Шаг 1 входа по почте: отправить код */
    requestEmailCode: builder.mutation<EmailCodeRequestDto, string>({
      query: (email) => ({
        url: 'auth/email/request',
        method: 'POST',
        body: { email },
      }),
    }),

    /** Шаг 2: код из письма */
    verifyEmailCode: builder.mutation<
      EmailLoginResponse,
      { email: string; code: string }
    >({
      query: (body) => ({ url: 'auth/email/verify', method: 'POST', body }),

      /**
       *  Токены здесь же, рядом с телеграмным входом: способов войти два,
       *  а место старта сессии должно быть одно
       */
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(signedIn(data));
          authStorage.write(data.refresh);
        } catch {
          // Ошибку показывает форма входа по тексту мутации
        }
      },
    }),

    /** Шаг 1 входа через телеграм: получить одноразовую ссылку на бота */
    telegramLoginStart: builder.mutation<TelegramStartDto, void>({
      query: () => ({ url: 'auth/telegram/start', method: 'POST' }),
    }),

    /** Шаг 2: ждём, пока человек нажмёт «Запустить» в боте */
    telegramLoginStatus: builder.query<TelegramStatusResponse, string>({
      query: (nonce) =>
        `auth/telegram/status?nonce=${encodeURIComponent(nonce)}`,

      /**
       *  Подтверждение приходит в ответе опроса, вход завершается здесь
       */
      async onQueryStarted(_nonce, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status !== 'confirmed' || !data.access || !data.refresh) {
            return;
          }

          dispatch(signedIn(data as AuthResponse));
          authStorage.write(data.refresh);
        } catch {
          // Опрос повторится сам, что показать — решает экран входа
        }
      },
    }),

    me: builder.query<UserDto, void>({
      query: () => 'me',
      providesTags: ['Me'],
    }),

    updateMe: builder.mutation<UserDto, Partial<UserDto>>({
      query: (body) => ({ url: 'me', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),

    myOrders: builder.query<OrderDto[], void>({
      query: () => 'me/orders',
      providesTags: ['Orders'],
    }),

    /** Что работает прямо сейчас */
    mySubscriptions: builder.query<SubscriptionDto[], void>({
      query: () => 'me/subscriptions',
      providesTags: ['Orders'],
    }),

    /** История попыток активации */
    myActivations: builder.query<ActivationDto[], void>({
      query: () => 'me/activations',
      providesTags: ['Activations'],
    }),
  }),
});

export const {
  useServicesQuery,
  useSiteSettingsQuery,
  useFaqQuery,
  useAdvantagesQuery,
  useHowStepsQuery,
  useAuthOptionsQuery,
  useRequestEmailCodeMutation,
  useVerifyEmailCodeMutation,
  useTelegramLoginStartMutation,
  useTelegramLoginStatusQuery,
  useVerifyKeyMutation,
  useCheckAccountMutation,
  useActivateMutation,
  useActivationStatusQuery,
  useCancelActivationMutation,
  useMeQuery,
  useUpdateMeMutation,
  useMyOrdersQuery,
  useMySubscriptionsQuery,
  useMyActivationsQuery,
} = k30Api;
