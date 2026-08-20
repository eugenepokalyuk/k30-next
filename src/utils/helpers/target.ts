/** Проверка данных активации на стороне витрины.
 *
 *  Зеркало серверной проверки (k30-api, providers/targets.py). Дубль
 *  здесь оправдан не «на всякий случай», а вполне конкретно: у
 *  поставщиков жёсткие лимиты — у одного из них проверка аккаунта
 *  разрешена раз в десять секунд с адреса. Отправлять туда заведомо
 *  негодный ввод значит тратить эти лимиты на опечатки и получать в
 *  ответ 429 вместо подсказки.
 *
 *  Правда при этом остаётся одна — серверная. Здесь проверяется только
 *  форма значения, и любой отказ отсюда покупатель может обойти,
 *  отправив запрос вручную: сервер всё равно проверит заново.
 */

import type { TargetKind } from '@/store/api/types';

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const UUID_ANYWHERE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const MIN_TOKEN_LENGTH = 20;

const ID_KINDS: TargetKind[] = ['account_id', 'org_id', 'user_id'];

/** Приводит ввод к тому виду, в котором его ждёт бэкенд.
 *
 *  Не косметика: из буфера обмена идентификатор приезжает то в
 *  кавычках, то с подписью «account id:», а токен — с переносами строк.
 *  Отвергать такое было бы придирками к тому, что человек скопировал
 *  ровно то, что мы просили.
 */
export function normalizeTarget(kind: TargetKind, raw: string): string {
  const value = (raw ?? '').trim();
  if (!value) return '';

  if (ID_KINDS.includes(kind)) {
    const found = value.match(UUID_ANYWHERE);
    return (found ? found[0] : value.replace(/^["'`\s]+|["'`,;\s]+$/g, '')).toLowerCase();
  }

  if (kind === 'access_token') {
    // Частая ошибка: в поле «токен» вставляют весь JSON сессии.
    // Достаём токен сами вместо того, чтобы просить переделать.
    if (value.startsWith('{')) {
      const token = readToken(value);
      if (token) return token;
    }
    return value;
  }

  return value;
}

/** Что не так с введённым. `null` — всё в порядке. */
export function validateTarget(kind: TargetKind, raw: string): string | null {
  const value = normalizeTarget(kind, raw);
  if (!value) return 'Заполните это поле.';

  if (ID_KINDS.includes(kind)) {
    return UUID.test(value)
      ? null
      : 'Должно выглядеть так: 123e4567-e89b-42d3-a456-426614174000 — 36 символов с дефисами.';
  }

  if (kind === 'access_token') {
    return value.length >= MIN_TOKEN_LENGTH
      ? null
      : 'Не похоже на токен — он длинный и начинается с «eyJ». Скопируйте значение целиком.';
  }

  if (kind === 'session_json') {
    let payload: unknown;
    try {
      payload = JSON.parse(value);
    } catch {
      return 'Это не похоже на JSON сессии. Скопируйте весь текст со страницы целиком, вместе с фигурными скобками.';
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return 'В JSON сессии ожидается объект в фигурных скобках.';
    }
    if (!readToken(value)) {
      return 'В JSON нет поля accessToken. Похоже, скопирована не та страница или вы вышли из аккаунта — войдите и повторите.';
    }
    return null;
  }

  return null;
}

/** Почта из данных, если её видно локально.
 *
 *  Показать покупателю, на какой аккаунт уедет подписка, — самое
 *  полезное, что можно сделать до отправки. Перепутанный аккаунт после
 *  активации уже не отменить.
 *
 *  Подпись JWT не проверяем и проверять не должны: токен не наш, ключа
 *  нет, а нужно отсюда только имя аккаунта для показа.
 */
export function previewEmail(kind: TargetKind, raw: string): string {
  const value = normalizeTarget(kind, raw);
  if (!value) return '';

  if (kind === 'session_json') {
    try {
      const payload = JSON.parse(value) as {
        user?: { email?: string };
      };
      if (payload?.user?.email) return payload.user.email;
    } catch {
      return '';
    }
  }

  const token = kind === 'access_token' ? value : readToken(value);
  return token ? emailFromJwt(token) : '';
}

function readToken(raw: string): string {
  try {
    const payload = JSON.parse(raw) as Record<string, unknown>;
    for (const key of ['accessToken', 'access_token', 'token']) {
      const value = payload?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  } catch {
    return '';
  }
  return '';
}

function emailFromJwt(token: string): string {
  const parts = token.split('.');
  if (parts.length !== 3) return '';
  try {
    const segment = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4);
    const payload = JSON.parse(
      decodeURIComponent(
        atob(padded)
          .split('')
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join(''),
      ),
    ) as Record<string, unknown>;

    const direct = payload.email;
    if (typeof direct === 'string' && direct.includes('@')) return direct;

    const profile = payload['https://api.openai.com/profile'];
    if (profile && typeof profile === 'object') {
      const email = (profile as { email?: unknown }).email;
      if (typeof email === 'string' && email.includes('@')) return email;
    }
  } catch {
    return '';
  }
  return '';
}

/** Почта для показа: «b***r@example.com».
 *
 *  Страницу активации открывают с чужого экрана и присылают в
 *  скриншотах поддержке — целиком почту показывать незачем. Бэкенд
 *  маскирует так же.
 */
export function maskEmail(email: string): string {
  const value = (email ?? '').trim();
  if (!value.includes('@')) return value;

  const at = value.lastIndexOf('@');
  const name = value.slice(0, at);
  const domain = value.slice(at + 1);

  if (name.length <= 2) return `${name.slice(0, 1)}*@${domain}`;
  const stars = '*'.repeat(Math.min(name.length - 2, 4));
  return `${name[0]}${stars}${name[name.length - 1]}@${domain}`;
}
