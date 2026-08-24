import type { Transition, Variants } from 'framer-motion';

/** Кривые и длительности анимаций — одни на весь сайт. Кривая
 *  `ease_out` продублирована в tokens.scss для CSS-переходов. */
export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const duration = {
  /** Отклик на нажатие, смена подписи. */
  fast: 0.18,
  /** Появление блока, раскрытие ответа. */
  base: 0.34,
  /** Крупные объекты: панель меню, герой. */
  slow: 0.5,
} as const;

export const transition: Transition = { duration: duration.base, ease };

/** Насколько блок должен войти в экран, чтобы начать появляться.
 *  `once` обязателен: иначе анимация переигрывается на каждом проходе. */
export const viewport = { once: true, amount: 0.2 } as const;

/** Появление снизу вверх — базовый жест всей витрины. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition },
};

/** Родитель, раскрывающий детей по очереди. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};
