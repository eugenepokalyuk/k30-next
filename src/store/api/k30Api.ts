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
  ActivationPromoDto,
  ActivationStatusResponse,
  AdvantageDto,
  AuthOptionsDto,
  AuthResponse,
  BuyBlockDto,
  BuyerRulesDto,
  CheckAccountResponse,
  CheckoutDto,
  CreatePaymentResponse,
  EmailCodeRequestDto,
  EmailLoginResponse,
  FaqEntryDto,
  HowStepDto,
  InformerDto,
  LegalPageDto,
  LegalSlug,
  OrderDto,
  PaymentDto,
  PaymentOptionsDto,
  ServiceDto,
  SiteSettingsDto,
  SubscriptionDto,
  TargetKind,
  TelegramBlockDto,
  TelegramStartDto,
  TelegramWidgetUser,
  TelegramStatusResponse,
  TelegramWebAppResponse,
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
  tagTypes: ['Me', 'Orders', 'Activations', 'Payment'],
  endpoints: (builder) => ({
    services: builder.query<ServiceDto[], void>({
      query: () => 'services/',
    }),

    verifyKey: builder.mutation<VerifyKeyResponse, string>({
      query: (key) => ({ url: 'verify-key', method: 'POST', body: { key } }),
    }),

    checkAccount: builder.mutation<
      CheckAccountResponse,
      { key: string; kind: TargetKind; value: string }
    >({
      query: (body) => ({ url: 'check-account', method: 'POST', body }),
    }),

    activate: builder.mutation<
      ActivateResponse,
      { key: string; kind: TargetKind; value: string }
    >({
      query: (body) => ({ url: 'activate', method: 'POST', body }),
      invalidatesTags: ['Orders', 'Activations'],
    }),

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

    siteSettings: builder.query<SiteSettingsDto, void>({
      query: () => 'site-settings',
    }),

    faq: builder.query<FaqEntryDto[], void>({
      query: () => 'faq',
    }),

    advantages: builder.query<AdvantageDto[], void>({
      query: () => 'advantages',
    }),

    tgAdvantages: builder.query<AdvantageDto[], void>({
      query: () => 'advantages?page=tg',
    }),

    informers: builder.query<InformerDto[], void>({
      query: () => 'informers',
    }),

    buyerRules: builder.query<BuyerRulesDto, void>({
      query: () => 'buyer-rules',
    }),

    checkout: builder.query<CheckoutDto, { service: string; plan: string }>({
      query: ({ service, plan }) =>
        `checkout?service=${encodeURIComponent(service)}` +
        `&plan=${encodeURIComponent(plan)}`,
    }),

    legalPage: builder.query<LegalPageDto, LegalSlug>({
      query: (slug) => `legal/${slug}`,
    }),

    howSteps: builder.query<HowStepDto[], void>({
      query: () => 'how-steps',
    }),

    buyBlock: builder.query<BuyBlockDto, void>({
      query: () => 'buy-block',
    }),

    activationPromo: builder.query<ActivationPromoDto, void>({
      query: () => 'activation-promo',
    }),

    telegramBlock: builder.query<TelegramBlockDto, void>({
      query: () => 'telegram-block',
    }),

    authOptions: builder.query<AuthOptionsDto, void>({
      query: () => 'auth/options',
    }),

    requestEmailCode: builder.mutation<EmailCodeRequestDto, string>({
      query: (email) => ({
        url: 'auth/email/request',
        method: 'POST',
        body: { email },
      }),
    }),

    verifyEmailCode: builder.mutation<
      EmailLoginResponse,
      { email: string; code: string }
    >({
      query: (body) => ({ url: 'auth/email/verify', method: 'POST', body }),

      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(signedIn(data));
          authStorage.write(data.refresh);
        } catch {
        }
      },
    }),

    telegramWebAppLogin: builder.mutation<
      TelegramWebAppResponse,
      { init_data: string; email?: string }
    >({
      query: (body) => ({
        url: 'auth/telegram/webapp',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status !== 'confirmed' || !data.access || !data.refresh) {
            return;
          }

          dispatch(signedIn(data as AuthResponse));
          authStorage.write(data.refresh);
        } catch {
        }
      },
    }),

    telegramWidgetLogin: builder.mutation<
      TelegramWebAppResponse,
      { telegram: TelegramWidgetUser; email?: string }
    >({
      query: (body) => ({
        url: 'auth/telegram/widget',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status !== 'confirmed' || !data.access || !data.refresh) {
            return;
          }

          dispatch(signedIn(data as AuthResponse));
          authStorage.write(data.refresh);
        } catch {
        }
      },
    }),

    telegramLoginStart: builder.mutation<TelegramStartDto, void>({
      query: () => ({ url: 'auth/telegram/start', method: 'POST' }),
    }),

    telegramLoginStatus: builder.query<TelegramStatusResponse, string>({
      query: (nonce) =>
        `auth/telegram/status?nonce=${encodeURIComponent(nonce)}`,

      async onQueryStarted(_nonce, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status !== 'confirmed' || !data.access || !data.refresh) {
            return;
          }

          dispatch(signedIn(data as AuthResponse));
          authStorage.write(data.refresh);
        } catch {
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

    myOrder: builder.query<OrderDto, number>({
      query: (number) => `me/orders/${number}`,
      providesTags: ['Orders'],
    }),

    mySubscriptions: builder.query<SubscriptionDto[], void>({
      query: () => 'me/subscriptions',
      providesTags: ['Orders'],
    }),

    myActivations: builder.query<ActivationDto[], void>({
      query: () => 'me/activations',
      providesTags: ['Activations'],
    }),

    paymentMethods: builder.query<PaymentOptionsDto, void>({
      query: () => 'payment-methods',
    }),

    createPayment: builder.mutation<
      CreatePaymentResponse,
      { service: string; plan: string; method: string }
    >({
      query: (body) => ({ url: 'payments', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),

    paymentStatus: builder.query<
      { success: boolean; payment: PaymentDto },
      string
    >({
      query: (id) => `payments/${id}`,
      providesTags: ['Payment', 'Orders'],
    }),
  }),
});

export const {
  useServicesQuery,
  useSiteSettingsQuery,
  useFaqQuery,
  useAdvantagesQuery,
  useTgAdvantagesQuery,
  useInformersQuery,
  useBuyerRulesQuery,
  useCheckoutQuery,
  useLegalPageQuery,
  useHowStepsQuery,
  useBuyBlockQuery,
  useTelegramBlockQuery,
  useActivationPromoQuery,
  useAuthOptionsQuery,
  useRequestEmailCodeMutation,
  useVerifyEmailCodeMutation,
  useTelegramWebAppLoginMutation,
  useTelegramLoginStartMutation,
  useTelegramWidgetLoginMutation,
  useTelegramLoginStatusQuery,
  useVerifyKeyMutation,
  useCheckAccountMutation,
  useActivateMutation,
  useActivationStatusQuery,
  useCancelActivationMutation,
  useMeQuery,
  useUpdateMeMutation,
  useMyOrdersQuery,
  useMyOrderQuery,
  useMySubscriptionsQuery,
  useMyActivationsQuery,
  useCreatePaymentMutation,
  usePaymentMethodsQuery,
  usePaymentStatusQuery,
} = k30Api;
