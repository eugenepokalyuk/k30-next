'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import { Stagger, StaggerItem } from '@/components/motion';
import { ArrowRightIcon, CartIcon, KeyIcon, Section } from '@/components/ui';
import { Routes } from '@/utils/consts';

import classes from './TgActions.module.scss';

const actions = [
  {
    href: Routes.Buy,
    icon: CartIcon,
    title: 'Купить подписку',
    description: 'Выберите сервис и тариф — оплата займёт пару минут',
  },
  {
    href: Routes.Activate,
    icon: KeyIcon,
    title: 'Активировать подписку',
    description: 'Ключ уже есть — введите код и получите подписку',
  },
];

export const TgActions: FC = () => (
  <Section>
    <Stagger as="ul" className={classes.grid}>
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <StaggerItem as="li" key={action.href} className={classes.cell}>
            <Link href={action.href} className={classes.card}>
              {/* Иконка и стрелка одной строкой: в колонке стрелка
                  оказывалась отдельным блоком под текстом, и карточка
                  читалась как незаконченная */}
              <span className={classes.head}>
                <span className={classes.icon}>
                  <Icon size={22} />
                </span>

                <ArrowRightIcon size={18} className={classes.arrow} />
              </span>

              <span className={classes.text}>
                <span className={classes.title}>{action.title}</span>
                <span className={classes.description}>
                  {action.description}
                </span>
              </span>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  </Section>
);
