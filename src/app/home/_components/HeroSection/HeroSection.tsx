import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { BoltIcon, ShieldIcon, UserIcon } from '@/components/ui';
import { KeyForm } from '@/components/units';

import classes from './HeroSection.module.scss';
import { HeroVisual } from '../HeroVisual/HeroVisual';

const advantages = [
  { icon: <BoltIcon size={18} />, text: 'Активация за пару минут' },
  { icon: <UserIcon size={18} />, text: 'Подписка на ваш аккаунт' },
  { icon: <ShieldIcon size={18} />, text: 'Пароль от аккаунта не нужен' },
];

export const HeroSection: FC = () => (
  <section className={classes.hero}>
    <div className={classes.container}>
      <div className={classes.content}>
        <Reveal delay={0}>
          <p className={classes.overline}>{'Активация подписок'}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className={classes.title}>
            <span>{'Подписки'}</span>
            <span className={classes.highlight}>{'на нейросети'}</span>
            <span>{'в одном месте'}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className={classes.description}>
            {'Подключайте популярные AI-сервисы прямо на свой аккаунт. Быстрая активация без передачи пароля и поддержка на каждом этапе.'}
          </p>
        </Reveal>

        <Reveal delay={0.18} className={classes.form}>
          <KeyForm />
        </Reveal>

        <Reveal as="ul" delay={0.24} className={classes.advantages}>
          {advantages.map((item) => (
            <li key={item.text} className={classes.advantage}>
              <span className={classes.advantage_icon}>{item.icon}</span>
              {item.text}
            </li>
          ))}
        </Reveal>
      </div>

      <HeroVisual />
    </div>
  </section>
);
