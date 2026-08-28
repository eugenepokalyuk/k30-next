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
  'access_token' | 'session_json' | 'account_id' | 'org_id' | 'user_id';

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
export interface ServiceActivationDto extends Omit<
  ServiceDto,
  'in_stock' | 'plans'
> {
  instruction: string;
  instruction_url: string;
  instruction_url_label: string;
  submit_label: string;
  activation_note: string;
  /** Правила, которые покупатель подтверждает до ввода данных. Пусто —
   *  окна с правилами нет и подтверждать нечего. */
  activation_rules: string;
  /** Памятка «ключ активирован, а подписки нет» — своя у каждого сервиса. */
  missing_subscription_help: string;
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
  /** Сколько прошлых покупок привязалось к кабинету при этом входе.
   *  Заказы с Маркета заводятся до того, как покупатель впервые вошёл, —
   *  без этой цифры непонятно, откуда в «пустом» кабинете история. */
  claimed_orders?: number;
}

/** Заявка на вход через бота: ссылка, по которой открывается телеграм.
 *
 *  Вход диплинком, а не штатным Login Widget телеграма: виджету нужен
 *  домен, привязанный в BotFather, а витрина живёт на GitHub Pages.
 */
export interface TelegramStartDto {
  nonce: string;
  url: string;
  /** Сколько секунд заявка ещё годна. Дальше нужна новая ссылка. */
  expires_in: number;
}

export type TelegramLoginStatus =
  | 'pending'
  | 'confirmed'
  /** Бот спросил почту у того, кто пришёл впервые. */
  | 'needs_email'
  /** Почта названа, и бот ждёт код из письма: без него адрес ничего не
   *  доказывает — назвать чужой может кто угодно. */
  | 'needs_code'
  | 'expired';

/** Ответ опроса заявки. Пока ждём — только `status`; после подтверждения
 *  приезжает обычная пара токенов с профилем. */
export interface TelegramStatusResponse extends Partial<AuthResponse> {
  status: TelegramLoginStatus;
}

/** Что показать на экране входа. Отдельная ручка от настроек витрины:
 *  форме входа не нужен весь блок ссылок и подписей. */
export interface AuthOptionsDto {
  telegram_support_url: string;
  /** У бота не прописан токен — входить через телеграм нечем, и кнопку
   *  показывать нельзя. */
  telegram_login_enabled: boolean;
  /** Не «включён ли вход по почте», а «уходят ли письма»: без SMTP код
   *  печатается в журнал сервера, и покупатель будет ждать письмо,
   *  которого не будет. */
  email_login_enabled: boolean;
}

/** Ответ на запрос кода. Одинаков для известного и неизвестного адреса —
 *  иначе форма входа превращается в справочник наших покупателей. */
export interface EmailCodeRequestDto {
  sent: boolean;
  /** Сколько секунд код годен. */
  expires_in: number;
  detail: string;
}

/** Успешный вход по коду. `registered` — адрес был новым, и кабинет
 *  завёлся только что: отдельного экрана регистрации у нас нет. */
export interface EmailLoginResponse extends AuthResponse {
  registered?: boolean;
}

/** Ссылки и подписи витрины из админки.
 *
 *  Раньше это лежало в переменных окружения фронта, и смена ссылки на
 *  телеграм означала пересборку статики. Теперь менеджер правит их сам.
 */
export interface SiteSettingsDto {
  telegram_channel_url: string;
  telegram_support_url: string;
  telegram_bot_url: string;
  /** Показывать ли круглую кнопку телеграма в углу страницы. */
  widget_is_enabled: boolean;
  buy_is_enabled: boolean;
  buy_title: string;
  buy_text: string;
  buy_telegram_url: string;
  buy_yandex_market_url: string;
  /** Страница отзывов на Маркете — предлагается после успешной активации. */
  review_yandex_market_url: string;
}

export type OrderStatus = 'new' | 'issued' | 'activated' | 'cancelled';

/** Вопрос и ответ из блока «Частые вопросы». Порядок задаёт бэкенд —
 *  витрина показывает список как пришёл. */
export interface FaqEntryDto {
  id: number;
  question: string;
  answer: string;
}

/** Живая подписка: то, чем покупатель может пользоваться прямо сейчас.
 *
 *  Отдельно от заказа, хотя строка в базе та же. Заказ отвечает на «что
 *  я покупал», подписка — на «что у меня работает и сколько осталось».
 *  Второй вопрос в кабинете задают чаще, и ради него не нужны ни номер
 *  заказа, ни источник, ни код ключа.
 */
export interface SubscriptionDto {
  number: number;
  service: string;
  service_slug: string;
  /** Цвет сервиса из админки — им подсвечивается карточка. */
  accent_color: string;
  plan: string;
  /** Срок тарифа целиком: из него и days_left считается полоса. */
  duration_days: number;
  account_email: string;
  activated_at: string | null;
  expires_at: string | null;
  /** Ноль — истекает сегодня. */
  days_left: number | null;
}

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
