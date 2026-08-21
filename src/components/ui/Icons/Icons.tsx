import React, { FC } from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/** Иконки инлайном, а не спрайтом или библиотекой: их меньше десятка,
 *  и каждая тянет на пару строк. Пакет вроде lucide весил бы больше,
 *  чем весь этот файл. `currentColor` — чтобы цвет задавался стилем
 *  родителя, а не пропом. */
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

export const KeyIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M10.7 12.3 21 2m-4 4 3 3m-6-6 3 3" />
  </svg>
);

export const CheckIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const UserIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-3.9 3.6-7 8-7s8 3.1 8 7" />
  </svg>
);

export const CopyIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
  </svg>
);

export const ShieldIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3 4.5 6v6c0 4.6 3.1 8.2 7.5 9 4.4-.8 7.5-4.4 7.5-9V6L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const BoltIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
);

export const ChatIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1-5.4A8 8 0 1 1 21 12Z" />
  </svg>
);

export const ArrowRightIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
);

export const MenuIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronDownIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const AlertIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.3v.2" />
  </svg>
);

/** Бумажный самолётик телеграма. Рисуем контуром, как остальные иконки,
 *  а не фирменным залитым логотипом: залитый круг из брендбука рядом с
 *  линейными иконками читается как чужой элемент. */
export const TelegramIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M21.5 4.3 2.9 11.4c-.8.3-.8 1.4.1 1.6l4.7 1.4 1.8 5.3c.2.7 1.1.9 1.6.3l2.5-2.7 4.7 3.5c.6.4 1.4.1 1.6-.6l3-14.3c.1-.7-.6-1.3-1.4-1z" />
    <path d="m7.7 14.4 10.6-7.6-6.7 9" />
  </svg>
);

/** Пакет с ручкой — блок покупки и ссылка на Маркет. */
export const CartIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16l-1.2 12.1a2 2 0 0 1-2 1.9H7.2a2 2 0 0 1-2-1.9z" />
    <path d="M8.5 10V6.5a3.5 3.5 0 1 1 7 0V10" />
  </svg>
);
