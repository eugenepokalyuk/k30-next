/** Контракты бэкенда как есть, в snake_case.
 *
 *  Переименовывать чужой контракт на нашей стороне не будем: при
 *  расхождении с Django не найти концов, а поля видно один в один в
 *  сетевой вкладке и в сериализаторах.
 *
 *  Важное свойство этих типов: слова «поставщик», «987ai», «CDK» здесь
 *  не встречаются. Витрина не знает, у кого закуплен ключ, и не должна
 *  знать — бэкенд отдаёт один и тот же ответ независимо от поставщика.
 *  Всё, что различается, приезжает данными: список полей формы, темп
 *  опроса, тексты ошибок.
 */

export type KeyStatus = 'free' | 'issued';
export type ActivationStatus = 'pending' | 'activated';

/** Состояние ключа. Настоящего значения здесь нет и не будет — бэкенд
 *  его не отдаёт даже залогиненному покупателю. */
export interface KeyStateDto {
  code: string;
  service: string;
  service_slug: string;
  /** Тариф внутри сервиса: «Pro», «Max 5x», «Go». Покупателю показываем
   *  вместе с сервисом — «Claude Max 5x». */
  plan: string;
  plan_slug: string;
  status: KeyStatus;
  activation_status: ActivationStatus;
  activation_url: string;
  account_email: string;
  issued_at: string | null;
  activated_at: string | null;
}

/** Вид данных, которые просит поставщик. Формат и проверки — общие с
 *  бэкендом (providers/targets.py), см. utils/helpers/target.ts. */
export type TargetKind =
  | 'access_token'
  | 'session_json'
  | 'account_id'
  | 'org_id'
  | 'user_id';

/** Описание одного варианта заполнения формы.
 *
 *  Приходит от бэкенда и зависит от того, что поставщик готов принять
 *  для конкретной карты. Ключ «Claude Pro» от одного поставщика просит
 *  org_id, такой же ключ от другого — user_id; витрина рисует что дали.
 */
export interface TargetOptionDto {
  kind: TargetKind;
  label: string;
  placeholder: string;
  hint: string;
  input: 'text' | 'textarea';
  /** Страница, с которой копируется значение. Пусто — кнопки не будет. */
  how_to_url: string;
  how_to_label: string;
  /** Секрет доступа к аккаунту: не логируем, не показываем целиком. */
  secret: boolean;
}

/** Кто виноват в ошибке. От этого зависит тон и предлагаемое действие:
 *  «проверьте данные» против «мы уже видим ошибку». */
export type Blame = 'customer' | 'shop' | 'provider' | '';

export type ActivationState =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'review'
  | 'cancelled'
  | 'unknown';

/** Асинхронная активация: то, что опрашивает экран ожидания. */
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
  activation_url: string;
  queue_position: number | null;
  /** Через сколько секунд спросить снова. Темп диктует бэкенд: у
   *  поставщиков разные лимиты, и витрине про них знать нечего. */
  poll_after: number;
  key: KeyStateDto;
  created_at: string;
  completed_at: string | null;
}

export type FieldInputType = 'textarea' | 'text' | 'email';

/** Поле из админки сервиса. Осталось от прежней схемы формы — состав
 *  формы теперь приходит в `targets`. */
export interface ServiceFieldDto {
  name: string;
  label: string;
  placeholder: string;
  hint: string;
  type: FieldInputType;
  required: boolean;
}

/** Тариф внутри сервиса. Ключ покупается именно на тариф: Claude Pro и
 *  Claude Max 5x — разный товар и разная цена. */
export interface PlanDto {
  slug: string;
  short_id: string;
  name: string;
  tagline: string;
  duration_days: number;
  /** Цена в рублях. Строка, а не число: DRF отдаёт Decimal строкой,
   *  чтобы копейки не поехали через float. `null` — цена не назначена,
   *  показываем «по запросу». */
  price: string | null;
  /** Ни один поставщик не активирует такой тариф по API — выдаёт
   *  менеджер руками. Витрина не предлагает по нему автоактивацию. */
  is_manual: boolean;
  /** Есть ли свободные ключи прямо сейчас. Точный остаток бэкенд не
   *  отдаёт намеренно — по нему видны обороты. */
  in_stock: boolean;
}

export interface ServiceDto {
  slug: string;
  name: string;
  tagline: string;
  logo: string | null;
  accent_color: string;
  source_url: string;
  /** Тарифы сервиса, уже отсортированные бэкендом. */
  plans: PlanDto[];
  /** Есть ли свободные ключи хоть по одному тарифу. */
  in_stock: boolean;
}

/** Сервис со всем, что нужно странице активации. Инструкция приезжает
 *  уже с подставленным кодом ключа — собирать её на клиенте нечем. */
export interface ServiceActivationDto
  extends Omit<ServiceDto, 'in_stock' | 'plans'> {
  instruction: string;
  instruction_url: string;
  instruction_url_label: string;
  submit_label: string;
  activation_note: string;
  fields_schema: ServiceFieldDto[];
}

export interface VerifyKeyResponse {
  success: boolean;
  /** Ключ найден, но активировать по нему нельзя: уже активирован, идёт
   *  активация или поставщик отказал. Причина — в `message`. */
  can_activate?: boolean;
  message?: string;
  error?: string;
  error_code?: string;
  key?: KeyStateDto;
  service?: ServiceActivationDto;
  /** Тариф из нашего каталога — то, что купили. */
  plan?: PlanDto;
  /** Что спросить у покупателя. Первый вариант — рекомендованный. */
  targets?: TargetOptionDto[];
  /** Остаток у поставщика: 'high' | 'low' | 'none' | число | ''. */
  stock?: string;
  /** Как тариф называет сам поставщик («go», «plus»). Для разбора
   *  расхождений с нашим каталогом, показывать не нужно. */
  provider_plan?: string;
  duration_days?: number | null;
  /** Активация уже идёт — открываем экран ожидания сразу. */
  activation?: ActivationDto | null;
}

export interface AccountDto {
  email: string;
  account_id: string;
  /** Что уже есть на аккаунте: «ChatGPT Plus до 2026-09-01». */
  subscriptions: string[];
}

export interface CheckAccountResponse {
  success: boolean;
  /** Поставщик такой проверки не умеет — шаг просто пропускается. */
  supported: boolean;
  error?: string;
  error_code?: string;
  account: AccountDto | null;
}

export interface ActivateResponse {
  success: boolean;
  error?: string;
  error_code?: string;
  activation: ActivationDto;
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
}

export type OrderStatus = 'new' | 'issued' | 'activated' | 'cancelled';

export interface OrderDto {
  number: number;
  service: string;
  service_slug: string;
  plan: string;
  plan_slug: string;
  key_code: string;
  status: OrderStatus;
  status_label: string;
  activation_status: ActivationStatus | '';
  activation_url: string;
  account_email: string;
  source: string;
  external_ref: string;
  created_at: string;
}
