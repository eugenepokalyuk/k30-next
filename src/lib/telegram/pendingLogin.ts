import type { TelegramStartDto } from '@/store/api/types';

const STORAGE_KEY = 'k30.telegram_login';

export const pendingLogin = {
  read(): TelegramStartDto | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as TelegramStartDto;
      return parsed?.nonce ? parsed : null;
    } catch {
      return null;
    }
  },
  write(link: TelegramStartDto | null) {
    if (typeof window === 'undefined') return;
    try {
      if (link) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(link));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  },
};
