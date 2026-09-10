import React, { FC } from 'react';

export interface IconProps {
  size?: number;
  className?: string;
}

/** Иконки инлайном */
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

export const ArrowLeftIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
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

export const HomeIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Z" />
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

export const RefreshIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
  </svg>
);

export const SupportIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M440-80v-80h320v-284q0-117-81.5-198.5T480-724q-117 0-198.5 81.5T200-444v244h-40q-33 0-56.5-23.5T80-280v-80q0-21 10.5-39.5T120-430l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-801q68 0 129 24t109 66.5Q766-668 797-610t40 126l3 52q19 10 29.5 28t10.5 38v92q0 20-10.5 38T840-208v48q0 33-23.5 56.5T760-80H440Zm-80-280q-17 0-28.5-11.5T320-400q0-17 11.5-28.5T360-440q17 0 28.5 11.5T400-400q0 17-11.5 28.5T360-360Zm240 0q-17 0-28.5-11.5T560-400q0-17 11.5-28.5T600-440q17 0 28.5 11.5T640-400q0 17-11.5 28.5T600-360Z" />
  </svg>
);

export const CardIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-320h640v-160H160v160Z" />
  </svg>
);

export const RocketIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="m98-537 168-168q14-14 33-20t39-2l52 11q-54 64-85 116t-60 126L98-537Zm205 91q23-72 62.5-136T461-702q88-88 201-131.5T873-860q17 98-26 211T716-448q-55 55-120 95.5T459-289L303-446Zm332.5-97q33.5 0 56.5-23t23-56.5q0-33.5-23-56.5t-56.5-23q-33.5 0-56.5 23t-23 56.5q0 33.5 23 56.5t56.5 23ZM551-85l-64-147q74-29 126.5-60T730-377l10 52q4 20-2 39.5T718-252L551-85ZM162-318q35-35 85-35.5t85 34.5q35 35 35 85t-35 85q-25 25-83.5 43T87-74q14-103 32-161t43-83Z" />
  </svg>
);

export const SunIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 492q-117 0-198.5-81.5T200-480q0-117 81.5-198.5T480-760q117 0 198.5 81.5T760-480q0 117-81.5 198.5T480-200Z" />
  </svg>
);

export const MoonIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z" />
  </svg>
);

export const LinkIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
      <path d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z" />
  </svg>
);

export const OpenInNewIcon: FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} viewBox="0 -960 960 960" className={className}>
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
  </svg>
);
