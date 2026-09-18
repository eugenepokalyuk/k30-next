export type KeyStatus = 'free' | 'issued';
export type ActivationStatus = 'pending' | 'activated';

export interface KeyStateDto {
  code: string;
  service: string;
  service_slug: string;
  plan: string;
  plan_slug: string;
  status: KeyStatus;
  activation_status: ActivationStatus;
  activation_url: string;
  account_email: string;
  issued_at: string | null;
  activated_at: string | null;
}

export type TargetKind = 'access_token' | 'session_json' | 'account_id' | 'org_id' | 'user_id';

export interface TargetOptionDto {
  kind: TargetKind;
  label: string;
  placeholder: string;
  hint: string;
  input: 'text' | 'textarea';
  how_to_url: string;
  how_to_label: string;
  secret: boolean;
  /** Свой пример для этого вида данных; пусто — берётся общий у сервиса */
  example_image: string;
  example_caption: string;
}

export type Blame = 'customer' | 'shop' | 'provider' | '';

export type ActivationState =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'review'
  | 'cancelled'
  | 'unknown';

export interface ActivationDto {
  id: string;
  status: ActivationState;
  status_label: string;
  message: string;
  error: string;
  error_code: string;
  blame: Blame;
  can_retry: boolean;
  can_cancel: boolean;
  account_email: string;
  /** Идентификатор аккаунта, если он у нас есть: сам ввод или разбор JSON */
  account_id: string;
  /** Вид присланных данных и они же в замаскированном виде */
  target_kind: string;
  target_hint: string;
  /** chatgpt, claude, grok, perplexity — чем подписать аккаунт на успехе */
  platform: string;
  activation_url: string;
  queue_position: number | null;
  poll_after: number;
  key: KeyStateDto;
  created_at: string;
  completed_at: string | null;
}

export type FieldInputType = 'textarea' | 'text' | 'email';

export interface ServiceFieldDto {
  name: string;
  label: string;
  placeholder: string;
  hint: string;
  type: FieldInputType;
  required: boolean;
}

/** Тариф внутри сервиса */
export interface PlanDto {
  slug: string;
  short_id: string;
  name: string;
  tagline: string;
  duration_days: number;
  price: string | null;
  is_manual: boolean;
  in_stock: boolean;
}

export interface ServiceDto {
  slug: string;
  name: string;
  tagline: string;
  logo: string | null;
  accent_color: string;
  source_url: string;
  plans: PlanDto[];
  in_stock: boolean;
}

export interface ActivationRuleBlockDto {
  icon: string;
  title: string;
  body: string;
}

export interface ServiceActivationDto extends Omit<
  ServiceDto,
  'in_stock' | 'plans'
> {
  instruction: string;
  instruction_url: string;
  instruction_url_label: string;
  example_image: string | null;
  example_caption: string;
  submit_label: string;
  activation_note: string;
  activation_rules: string;
  rule_blocks: ActivationRuleBlockDto[];
  missing_subscription_help: string;
  fields_schema: ServiceFieldDto[];
}

export interface VerifyKeyResponse {
  success: boolean;
  can_activate?: boolean;
  message?: string;
  error?: string;
  error_code?: string;
  key?: KeyStateDto;
  service?: ServiceActivationDto;
  plan?: PlanDto;
  targets?: TargetOptionDto[];
  stock?: string;
  provider_plan?: string;
  duration_days?: number | null;
  activation?: ActivationDto | null;
}

export interface AccountDto {
  email: string;
  account_id: string;
  subscriptions: string[];
}

export interface CheckAccountResponse {
  success: boolean;
  supported?: boolean;
  error?: string;
  error_code?: string;
  account?: AccountDto | null;
}

export interface ActivateResponse {
  success: boolean;
  error?: string;
  error_code?: string;
  activation?: ActivationDto;
}

export interface ActivationStatusResponse {
  success: boolean;
  activation: ActivationDto;
}

export interface UserDto {
  id: number;
  email: string;
  name: string;
  telegram_username: string;
  date_joined: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: UserDto;
  claimed_orders?: number;
}

export interface TelegramStartDto {
  nonce: string;
  url: string;
  expires_in: number;
}

export type TelegramLoginStatus =
  | 'pending'
  | 'confirmed'
  | 'needs_email'
  | 'needs_code'
  | 'expired';

export interface TelegramStatusResponse extends Partial<AuthResponse> {
  status: TelegramLoginStatus;
}

export interface AuthOptionsDto {
  telegram_support_url: string;
  telegram_login_enabled: boolean;
  email_login_enabled: boolean;
}

export interface EmailCodeRequestDto {
  sent: boolean;
  expires_in: number;
  detail: string;
}

export interface EmailLoginResponse extends AuthResponse {
  registered?: boolean;
}

export interface SiteSettingsDto {
  telegram_channel_url: string;
  telegram_support_url: string;
  telegram_bot_url: string;
  widget_is_enabled: boolean;
  review_yandex_market_url: string;
}

export interface BuyBlockDto {
  is_enabled: boolean;
  title: string;
  text: string;
  telegram_url: string;
  yandex_market_url: string;
}

export interface TelegramBlockItemDto {
  id: number;
  icon: string;
  title: string;
  description: string;
}
export interface ActivationPromoDto {
  is_enabled: boolean;
  telegram_icon: string | null;
  telegram_text: string;
  telegram_button_label: string;
  telegram_url: string;
  review_icon: string | null;
  review_text: string;
  review_button_label: string;
  review_url: string;
}

export interface TelegramBlockDto {
  is_enabled: boolean;
  title: string;
  text: string;
  url: string;
  items: TelegramBlockItemDto[];
}

export type OrderStatus =
  | 'awaiting_payment'
  | 'paid'
  | 'new'
  | 'issued'
  | 'activated'
  | 'cancelled';

export interface FaqEntryDto {
  id: number;
  question: string;
  answer: string;
}

export interface AdvantageDto {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface HowStepDto {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface SubscriptionDto {
  number: number;
  service: string;
  service_slug: string;
  logo: string | null;
  accent_color: string;
  plan: string;
  duration_days: number;
  account_email: string;
  activated_at: string | null;
  expires_at: string | null;
  days_left: number | null;
}

/** Плитка в разделе «Способы оплаты» — состав задаёт админка */
export interface PaymentMethodDto {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 *  Весь раздел «Способы оплаты» целиком, а не только список.
 *
 *  Пустой список отвечает на вопрос «чем платить», но не на вопрос
 *  «почему нечем»: оплату могли выключить на техработы, могли не
 *  настроить вовсе, а могли выключить все способы по одному. Текст для
 *  всех трёх случаев пишет менеджер в админке, а не витрина в вёрстке
 */
export interface PaymentOptionsDto {
  is_enabled: boolean;
  methods: PaymentMethodDto[];
  notice: string;
  unavailable_text: string;
}

export type PaymentStatus =
  | 'pending'
  | 'confirmed'
  | 'canceled'
  | 'chargebacked'
  | 'error';

export interface PaymentDto {
  id: string;
  method: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  status_label: string;
  pay_url: string;
  error: string;

  service: string;
  service_slug: string;
  logo: string | null;
  accent_color: string;
  plan: string;
  plan_slug: string;

  /** Появляются, когда деньги дошли: до оплаты заказа не существует */
  order_number: number | null;
  key_code: string;
  activation_url: string;
  /** Оплачено, а ключа нет: склад был пуст в момент оплаты */
  awaits_key: boolean;

  created_at: string;
}

export interface OrderDto {
  number: number;
  service: string;
  service_slug: string;
  logo: string | null;
  accent_color: string;
  plan: string;
  plan_slug: string;
  price: string | null;
  key_code: string;
  status: OrderStatus;
  status_label: string;
  awaits_key: boolean;
  paid_at: string | null;
  activation_status: ActivationStatus | '';
  activation_url: string;
  account_email: string;
  source: string;
  external_ref: string;
  created_at: string;
}

/**
 *  Ответ кнопки «Оплатить». Заказа в нём нет: он появится, когда деньги
 *  дойдут, — а пока есть только счёт со ссылкой на оплату
 */
export interface CreatePaymentResponse {
  payment: PaymentDto | null;
  error: string;
}

export interface InformerDto {
  id: number;
  image: string;
  title: string;
  url: string;
}

export interface BuyerRuleItemDto {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface BuyerRulesDto {
  is_enabled: boolean;
  title: string;
  text: string;
  items: BuyerRuleItemDto[];
}

export interface CheckoutServiceDto {
  slug: string;
  name: string;
  tagline: string;
  logo: string | null;
  accent_color: string;
}

export interface CheckoutBlockDto {
  key: 'requirements' | 'warranty';
  icon: string;
  title: string;
  body: string;
}

export interface CheckoutDto {
  service: CheckoutServiceDto;
  plan: PlanDto;
  total: string | null;
  blocks: CheckoutBlockDto[];
}

export type LegalSlug = 'terms' | 'privacy';

export interface LegalPageDto {
  slug: LegalSlug;
  title: string;
  body: string;
  updated_at: string;
}

export interface TelegramWebAppResponse extends Partial<AuthResponse> {
  status: 'confirmed' | 'needs_email';
}
