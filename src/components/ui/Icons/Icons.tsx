import React, { FC } from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/** Иконки инлайном. `currentColor` — цвет задаётся стилем родителя. */
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  stroke: 'currentColor',
  'aria-hidden': true,
  focusable: false,
});

export const KeyIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M365-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-85 155q-100 0-170-70T40-480q0-100 70-170t170-70q81 0 141.5 46T506-560h335l79 79-140 160-100-79-80 80-80-80h-14q-25 72-87 116t-139 44Z" />
  </svg>
);

export const CheckIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>
);

export const UserIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
  </svg>
);

export const CopyIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Z" />
  </svg>
);

export const ShieldIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Z" />
  </svg>
);

export const BoltIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="m320-80 40-280H160l360-520h80l-40 320h240L400-80h-80Z" />
  </svg>
);

export const ChatIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm160-320h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Z" />
  </svg>
);

export const ArrowRightIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
  </svg>
);

export const MenuIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
  </svg>
);

export const CloseIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export const ChevronDownIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
  </svg>
);

export const AlertIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z" />
  </svg>
);

export const TelegramIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <path
      fillRule="evenodd"
      d="M2.02726 10.4496L21.515 3.11835C22.4042 2.72589 23.2638 3.32745 22.9241 4.65602L19.6058 19.9126C19.3739 20.9978 18.7045 21.2551 17.7725 20.7544L12.7175 17.1118L10.2873 19.4172C9.82934 19.8484 9.31155 19.3777 9.35459 18.7502L9.62013 14.8793L9.61793 14.8782H9.62013L18.5857 7.17477L6.78654 13.54L1.78326 12.0173C0.704998 11.6946 0.697304 10.9708 2.02726 10.4496Z"
    />
  </svg>
);

export const CartIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM208-800h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Z" />
  </svg>
);
