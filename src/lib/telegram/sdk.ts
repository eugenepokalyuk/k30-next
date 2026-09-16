/**
 *  Тонкая обёртка над скриптом Telegram Mini App
 */

export interface TelegramWebApp {
  /** Подписанная строка с данными покупателя; в браузере пустая */
  initData: string;
  /** 'android', 'ios', 'tdesktop', 'weba'… либо 'unknown' вне Telegram */
  platform: string;
  colorScheme: 'light' | 'dark';
  /** Сообщает Telegram, что интерфейс отрисован и заставку можно убрать */
  ready: () => void;
  /** Разворачивает окно на всю высоту: по умолчанию оно в половину экрана */
  expand: () => void;
  /** Открывает внешнюю ссылку системным браузером, а не внутри окна */
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  /** Открывает ссылку t.me внутри самого Telegram */
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

/**
 *  Внутри ли мы Telegram.
 *
 *  Признак — непустая `initData`, а не наличие самого объекта: скрипт
 *  Telegram подключён на всех страницах и в обычном браузере создаёт
 *  `WebApp` тоже, только без данных. Проверять по `platform` тоже
 *  нельзя: в веб-версии Telegram она совпадает с браузерной
 */
export const isInsideTelegram = (): boolean =>
  Boolean(getWebApp()?.initData);

/**
 *  Открыть ссылку так, как ожидает окружение.
 *
 *  Внутри Mini App обычный `target="_blank"` либо не срабатывает, либо
 *  открывает страницу поверх приложения без кнопки «назад». Telegram
 *  просит разделять: ссылки t.me — своим методом, остальные — системным
 *  браузером
 */
export const openExternal = (url: string) => {
  const app = getWebApp();

  if (!app?.initData) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  if (/^https?:\/\/t\.me\//i.test(url)) app.openTelegramLink(url);
  else app.openLink(url);
};
