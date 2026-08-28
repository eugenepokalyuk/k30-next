import React, { FC } from 'react';

import { Stagger, StaggerItem } from '@/components/motion';
import { Section } from '@/components/ui';

import classes from './HowSection.module.scss';

const steps = [
  {
    title: 'Оплачиваете',
    text: 'На Яндекс Маркете или в телеграме. Ключ приходит сразу после оплаты — ждать менеджера не нужно',
  },
  {
    title: 'Вводите ключ',
    text: 'Вставляете код в поле на главной. Мы сами определяем, от какого сервиса ключ и что делать дальше',
  },
  {
    title: 'Подтверждаете аккаунт',
    text: 'По инструкции копируете токен или ID аккаунта со страницы сервиса. Пароль от аккаунта мы не спрашиваем и не храним',
  },
  {
    title: 'Пользуетесь',
    text: 'Подписка появляется на вашем аккаунте. Заказ и его статус остаются в личном кабинете',
  },
];

/** Четыре шага сценария. */
export const HowSection: FC = () => (
  <Section
    id="how"
    overline="Порядок действий"
    title="Как это работает"
    description="Четыре шага от оплаты до работающей подписки."
  >
    <Stagger as="ol" className={classes.list}>
      {steps.map((step, index) => (
        <StaggerItem as="li" key={step.title} className={classes.item}>
          <span className={classes.number} aria-hidden>
            {index + 1}
          </span>

          <div className={classes.body}>
            <h3 className={classes.title}>{step.title}</h3>
            <p className={classes.text}>{step.text}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  </Section>
);
