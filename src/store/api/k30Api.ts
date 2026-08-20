import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import {
  authStorage,
  signedOut,
  tokenRefreshed,
} from '@/store/slices/auth/authSlice';
import type { RootState } from '@/store/store';

import type {
  ActivateResponse,
  ActivationDto,
  ActivationStatusResponse,
  AuthResponse,
  CheckAccountResponse,
  OrderDto,
  ServiceDto,
  TargetKind,
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

    register: builder.mutation<
      AuthResponse,
      { email: string; password: string; name?: string }
    >({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
    }),

    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
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
  useVerifyKeyMutation,
  useCheckAccountMutation,
  useActivateMutation,
  useActivationStatusQuery,
  useCancelActivationMutation,
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useUpdateMeMutation,
  useMyOrdersQuery,
  useMyActivationsQuery,
} = k30Api;
