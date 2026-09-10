'use client';

import React, { FC } from 'react';

import { Button, CalloutCard, SupportIcon } from '@/components/ui';
import { useSupportBlockQuery } from '@/store/api/k30Api';
import { SupportTelegram } from '@/utils/consts';

import classes from './SupportSection.module.scss';

/**
 *  «Что-то пошло не так» под формой активации. Секция, а не строка:
 *  читают её в тот момент, когда активация не удалась, и человеку нужен
 *  человек — на такой странице ссылка в поддержку заметна ровно
 *  настолько, насколько её видно.
 *
 *  Тексты и пункты правятся в админке. Ручка не ответила — остаётся
 *  прежняя строка со ссылкой из кода: экран, на котором сервер молчит, —
 *  это как раз тот случай, когда покупателю нужна поддержка, и остаться
 *  на нём вовсе без контакта нельзя
 */
export const SupportSection: FC = () => {
  const { data, isError } = useSupportBlockQuery();

  if (isError) {
    return (
      <p className={classes.fallback}>
        Что-то пошло не так?{' '}
        <a
          href={SupportTelegram}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.fallback_link}
        >
          Напишите в поддержку
        </a>{' '}
        и приложите код ключа.
      </p>
    );
  }

  if (!data?.is_enabled || !data.url) return null;

  return (
    <CalloutCard
      overline={data.overline}
      title={data.title}
      text={data.text}
      items={data.items}
    >
      <Button href={data.url} external size="large">
        <SupportIcon size={18} />
        {data.button_label || 'Написать в поддержку'}
      </Button>
    </CalloutCard>
  );
};
