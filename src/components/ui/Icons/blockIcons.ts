import { FC } from 'react';

import {
  BoltIcon,
  CardIcon,
  CartIcon,
  ChatIcon,
  CheckIcon,
  IconProps,
  KeyIcon,
  RefreshIcon,
  RocketIcon,
  ShieldIcon,
  SupportIcon,
} from './Icons';

const blockIcons: Record<string, FC<IconProps>> = {
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
};

export const getBlockIcon = (name: string): FC<IconProps> =>
  blockIcons[name] ?? BoltIcon;
