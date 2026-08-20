import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { Button, ChatIcon, Section } from '@/components/ui';
import { SupportTelegram } from '@/utils/consts';

import classes from './FaqSection.module.scss';
import { FaqItem } from './FaqItem';

const questions = [
  {
    question: 'Нужен ли пароль от моего аккаунта?',
    answer:
      'Нет. Для активации нужен токен сессии со страницы самого сервиса — он даёт право выдать подписку, но не даёт доступа к переписке и настройкам. Пароль мы не спрашиваем никогда.',
  },
  {
    question: 'Ключ не подходит — что делать?',
    answer:
      'Проверьте, что скопировали код целиком, включая последний символ после дефиса. Если код набран верно, а ключ не находится, напишите в поддержку — мы найдём его по номеру заказа.',
  },
  {
    question: 'Можно активировать ключ второй раз?',
    answer:
      'Нет. Ключ одноразовый: после активации он привязан к аккаунту, на который выдана подписка. Если активация прошла не на тот аккаунт, напишите в поддержку сразу.',
  },
  {
    question: 'Сколько ждать подписку после активации?',
    answer:
      'Обычно она появляется сразу. Если сервис не видит подписку, выйдите из аккаунта и зайдите снова или очистите кеш страницы — так она подтягивается быстрее.',
  },
  {
    question: 'Зачем нужен личный кабинет?',
    answer:
      'В нём видно все ваши покупки и их статусы: какой ключ к какому сервису, активирован он или ещё ждёт. Активировать ключ можно и без кабинета.',
  },
];

export const FaqSection: FC = () => (
  <Section id="faq" overline="Вопросы" title="Частые вопросы">
    <div className={classes.layout}>
      <Reveal as="ul" className={classes.list}>
        {questions.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </Reveal>

      <Reveal as="aside" delay={0.1} className={classes.support}>
        <span className={classes.support_icon}>
          <ChatIcon size={22} />
        </span>
        <p className={classes.support_title}>Не нашли ответ?</p>
        <p className={classes.support_text}>
          Напишите в телеграм — отвечаем и помогаем довести активацию до конца.
        </p>
        <Button href={SupportTelegram} external variant="outlined" size="small">
          Написать в поддержку
        </Button>
      </Reveal>
    </div>
  </Section>
);
