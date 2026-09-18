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
  tagTypes: ['Me', 'Orders', 'Activations', 'Payment'],
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

    /** Плитки блока «Почему мы» на главной */
    advantages: builder.query<AdvantageDto[], void>({
      query: () => 'advantages',
    }),

    /**
     *  Те же плитки, но свои у страницы Telegram: одна ручка с фильтром,
     *  два хука — так главная не перечитывает свой блок, когда менеджер
     *  правит телеграмный
     */
    tgAdvantages: builder.query<AdvantageDto[], void>({
      query: () => 'advantages?page=tg',
    }),

    /** Баннеры слайдера на странице Telegram */
    informers: builder.query<InformerDto[], void>({
      query: () => 'informers',
    }),

    /** Правила для покупателей под выбором сервиса */
    buyerRules: builder.query<BuyerRulesDto, void>({
      query: () => 'buyer-rules',
    }),

    /** Сводка заказа и условия покупки для страницы оформления */
    checkout: builder.query<CheckoutDto, { service: string; plan: string }>({
      query: ({ service, plan }) =>
        `checkout?service=${encodeURIComponent(service)}` +
        `&plan=${encodeURIComponent(plan)}`,
    }),

    /** Соглашение или политика конфиденциальности */
    legalPage: builder.query<LegalPageDto, LegalSlug>({
      query: (slug) => `legal/${slug}`,
    }),

    /** Шаги блока «Как это работает» */
    howSteps: builder.query<HowStepDto[], void>({
      query: () => 'how-steps',
    }),

    /** Секция «Купить ключ»: тексты и ссылки на площадки */
    buyBlock: builder.query<BuyBlockDto, void>({
      query: () => 'buy-block',
    }),

    /** Карточки «Телеграм» и «Отзыв» под экраном успеха активации */
    activationPromo: builder.query<ActivationPromoDto, void>({
      query: () => 'activation-promo',
    }),

    /** Секция телеграм-канала: тексты, ссылка и пункты списка */
    telegramBlock: builder.query<TelegramBlockDto, void>({
      query: () => 'telegram-block',
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

    /**
     *  Вход внутри Telegram Mini App: строка initData вместо ожидания в
     *  чате. Токены кладём здесь же, рядом с остальными способами —
     *  место старта сессии должно быть одно
     */
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
          // Что показать, решает экран входа в Mini App
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

    /**
     *  Один заказ по номеру — для страницы оформления.
     *
     *  Заказ заводится без ключа: ключ снимается со склада, когда
     *  подтвердится оплата. Узнать, что это уже случилось, витрине
     *  больше неоткуда, поэтому экран после оформления перечитывает
     *  заказ, пока ключ не появится
     */
    myOrder: builder.query<OrderDto, number>({
      query: (number) => `me/orders/${number}`,
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

    /**
     *  Раздел «Способы оплаты» на странице оформления.
     *
     *  Читается анонимно и до входа: чем можно заплатить — такое же
     *  содержимое витрины, как цена. От ответа зависит, будет ли кнопка
     *  оплаты вообще: пустой список — значит платить нечем, и оформлять
     *  заказ незачем
     */
    paymentMethods: builder.query<PaymentOptionsDto, void>({
      query: () => 'payment-methods',
    }),

    /**
     *  Кнопка «Оплатить»: заводит счёт и отдаёт ссылку на оплату.
     *
     *  Заказа она не создаёт — он появится, когда деньги дойдут. Иначе
     *  кабинет копил бы строки «ждёт оплаты» по каждому, кто передумал
     *  на странице банка
     */
    createPayment: builder.mutation<
      CreatePaymentResponse,
      { service: string; plan: string; method: string }
    >({
      query: (body) => ({ url: 'payments', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),

    /**
     *  Чем кончился счёт — это читает страница, вернувшаяся с оплаты.
     *  Номер заказа и код ключа приезжают здесь же, когда оплата пройдёт
     */
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
