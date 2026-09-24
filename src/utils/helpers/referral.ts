const STORAGE_KEY = 'k30.ref';

export const referralStorage = {
  read(): string {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  },
  write(code: string | null) {
    if (typeof window === 'undefined') return;
    try {
      if (code) window.localStorage.setItem(STORAGE_KEY, code);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  },
};
