export interface TelegramWebApp {
  initData: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  ready: () => void;
  expand: () => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export const getWebApp = (): TelegramWebApp | null => {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
};

export const isInsideTelegram = (): boolean =>
  Boolean(getWebApp()?.initData);

export const openExternal = (url: string) => {
  const app = getWebApp();

  if (!app?.initData) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  if (/^https?:\/\/t\.me\//i.test(url)) app.openTelegramLink(url);
  else app.openLink(url);
};
