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
  AuthOptionsDto,
  AuthResponse,
  CheckAccountResponse,
  EmailCodeRequestDto,
  EmailLoginResponse,
  OrderDto,
  ServiceDto,
  SiteSettingsDto,
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

/** Обёртка, которая один раз обновляет access по refresh и повторяет запрос.
 *
 *  Access живёт полчаса, а вкладку с кабинетом держат открытой днями —
 *  без этого покупателя выкидывало бы на страницу входа посреди работы.
 *  Повтор ровно один: если и он получил 401, значит refresh мёртв, и
 *  дальше крутиться незачем.
 */
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

    /** Шаг 1. Мутация, а не запрос: у ввода кода нет смысла в кэше —
     *  повторная проверка должна идти на сервер, статус ключа меняется. */
    verifyKey: builder.mutation<VerifyKeyResponse, string>({
      query: (key) => ({ url: 'verify-key', method: 'POST', body: { key } }),
    }),

    /** Шаг 2. Что за аккаунт нам принесли — до того, как карта потрачена.
     *  Умеют не все поставщики; когда не умеют, приходит
     *  `supported: false`, и шаг просто пропускается. */
    checkAccount: builder.mutation<
      CheckAccountResponse,
      { key: string; kind: TargetKind; value: string }
    >({
      query: (body) => ({ url: 'check-account', method: 'POST', body }),
    }),

    /** Шаг 3. Запуск активации.
     *
     *  Возвращает не результат, а задачу: у всех поставщиков активация
     *  асинхронная и занимает до двух минут. Дальше — `activationStatus`.
     */
    activate: builder.mutation<
      ActivateResponse,
      { key: string; kind: TargetKind; value: string }
    >({
      query: (body) => ({ url: 'activate', method: 'POST', body }),
      // Заказ в кабинете заводится по итогу активации — списки перечитать.
      invalidatesTags: ['Orders', 'Activations'],
    }),

    /** Шаг 4. Опрос статуса.
     *
     *  Запрос, а не мутация: это чтение, и RTK Query сам не даст двум
     *  открытым вкладкам дублировать его. Темп опроса задаёт бэкенд
     *  полем `poll_after` — см. useActivationPolling.
     */
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

    /** Ссылки и подписи витрины из админки: телеграм, блок покупки,
     *  круглая кнопка в углу. Читается анонимно — это содержимое
     *  страницы, такое же публичное, как список сервисов. */
    siteSettings: builder.query<SiteSettingsDto, void>({
      query: () => 'site-settings',
    }),

    /** Что показать на экране входа. Отдельно от настроек витрины:
     *  форме входа не нужен весь блок ссылок и подписей. */
    authOptions: builder.query<AuthOptionsDto, void>({
      query: () => 'auth/options',
    }),

    /** Шаг 1 входа по почте: отправить код.
     *
     *  Ответ одинаков для известного и неизвестного адреса. Разный
     *  ответ превратил бы форму входа в способ выяснить, кто у нас
     *  зарегистрирован.
     */
    requestEmailCode: builder.mutation<EmailCodeRequestDto, string>({
      query: (email) => ({
        url: 'auth/email/request',
        method: 'POST',
        body: { email },
      }),
    }),

    /** Шаг 2: код из письма. Он же регистрация — неизвестный адрес с
     *  верным кодом заводит кабинет, отдельного экрана для этого нет. */
    verifyEmailCode: builder.mutation<
      EmailLoginResponse,
      { email: string; code: string }
    >({
      query: (body) => ({ url: 'auth/email/verify', method: 'POST', body }),

      /** Токены кладём здесь же, рядом с телеграмным входом: способов
       *  войти два, а место, где начинается сессия, должно быть одно —
       *  иначе следующий способ снова забудет записать refresh на диск.
       */
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(signedIn(data));
          authStorage.write(data.refresh);
        } catch {
          // Неверный код и сеть — оба случая показывает форма входа по
          // тексту ошибки мутации, второй раз объяснять их нечем.
        }
      },
    }),

    /** Шаг 1 входа через телеграм: получить одноразовую ссылку на бота.
     *
     *  Мутация, а не запрос: каждый вызов заводит новую заявку с новым
     *  nonce, и кэшировать её нельзя — просроченная ссылка ведёт в бота,
     *  который на неё уже не ответит.
     */
    telegramLoginStart: builder.mutation<TelegramStartDto, void>({
      query: () => ({ url: 'auth/telegram/start', method: 'POST' }),
    }),

    /** Шаг 2: ждём, пока человек нажмёт «Запустить» в боте.
     *
     *  Опрос, а не webhook: витрина — статика на Pages, принимать
     *  входящие ей нечем. Темп задаёт экран входа через pollingInterval.
     */
    telegramLoginStatus: builder.query<TelegramStatusResponse, string>({
      query: (nonce) =>
        `auth/telegram/status?nonce=${encodeURIComponent(nonce)}`,

      /** Подтверждение приходит в ответе опроса — и вход завершается
       *  здесь же, а не в компоненте.
       *
       *  Токены выдаются ровно один раз: бэкенд гасит заявку сразу
       *  после выдачи, и второй опрос по тому же nonce вернёт «не
       *  найдено». Пропустить этот ответ нельзя, поэтому забираем его
       *  там, где он гарантированно виден, — а не в эффекте экрана,
       *  который к этому моменту может уже размонтироваться.
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
          // Сеть или просроченная заявка: опрос повторится сам, а что
          // показать — решает экран входа по статусу.
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

    /** История попыток активации. Отвечает на «почему не заработало» —
     *  вопрос, с которым чаще всего приходят в поддержку. */
    myActivations: builder.query<ActivationDto[], void>({
      query: () => 'me/activations',
      providesTags: ['Activations'],
    }),
  }),
});

export const {
  useServicesQuery,
  useSiteSettingsQuery,
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
  useMyActivationsQuery,
} = k30Api;
