import { FC } from 'react';

import {
  AlertIcon,
  BoltIcon,
  CardIcon,
  CartIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  IconProps,
  InfoIcon,
  KeyIcon,
  RefreshIcon,
  RocketIcon,
  ShieldIcon,
  SupportIcon,
  UserIcon,
} from './Icons';

const blockIcons: Record<string, FC<IconProps>> = {
  alert: AlertIcon,
  bolt: BoltIcon,
  shield: ShieldIcon,
  refresh: RefreshIcon,
  support: SupportIcon,
  key: KeyIcon,
  check: CheckIcon,
  chat: ChatIcon,
  cart: CartIcon,
  card: CardIcon,
  rocket: RocketIcon,
  info: InfoIcon,
  clock: ClockIcon,
  user: UserIcon,
};

export const hasBlockIcon = (name: string): boolean => name in blockIcons;

export const getBlockIcon = (name: string): FC<IconProps> =>
  blockIcons[name] ?? BoltIcon;
