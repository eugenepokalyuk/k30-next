import type { TargetKind } from '@/store/api/types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const UUID_ANYWHERE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const LOOKALIKES: Record<string, string> = {
  '\u0430': 'a',
  '\u0441': 'c',
  '\u0435': 'e',
  '\u0410': 'A',
  '\u0412': 'B',
  '\u0421': 'C',
  '\u0415': 'E',
};

const MIN_TOKEN_LENGTH = 20;

const ID_KINDS: TargetKind[] = ['account_id', 'org_id', 'user_id'];

function asciiId(value: string): string {
  return (
    value
      .replace(/[\u0430\u0441\u0435\u0410\u0412\u0421\u0415]/g, (char) => LOOKALIKES[char])
      .replace(/[\u2010-\u2015\u2212]/g, '-')
      .replace(/[\u200b-\u200d\ufeff]/g, '')
  );
}

export function normalizeTarget(kind: TargetKind, raw: string): string {
  const value = (raw ?? '').trim();
  if (!value) return '';

  if (ID_KINDS.includes(kind)) {
    const id = asciiId(value);
    const found = id.match(UUID_ANYWHERE);
    return (
      found ? found[0] : id.replace(/^["'`\s]+|["'`,;\s]+$/g, '')
    ).toLowerCase();
  }

  if (kind === 'access_token') {
    if (value.startsWith('{')) {
      const token = readToken(value);
      if (token) return token;
    }
    return value;
  }

  return value;
}

export function validateTarget(kind: TargetKind, raw: string): string | null {
  const value = normalizeTarget(kind, raw);
  if (!value) return 'Заполните это поле';

  if (ID_KINDS.includes(kind)) {
    return UUID.test(value)
      ? null
      : 'Должно выглядеть так: 123e4567-e89b-42d3-a456-426614174000 — 36 символов с дефисами';
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
      return 'В JSON сессии ожидается объект в фигурных скобках';
    }
    if (!readToken(value)) {
      return 'В JSON нет поля accessToken. Похоже, скопирована не та страница или вы вышли из аккаунта — войдите и повторите.';
    }
    return null;
  }

  return null;
}

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
