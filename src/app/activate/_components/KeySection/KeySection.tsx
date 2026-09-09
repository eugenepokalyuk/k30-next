'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import { AlertIcon, KeyCode, KeyIcon, SuccessMark } from '@/components/ui';
import { KeyForm } from '@/components/units';

import classes from './KeySection.module.scss';

/** Что показывает правая половина секции */
export type KeyStatus = 'waiting' | 'accepted' | 'rejected';

interface Props {
  /** Код из ссылки. Пусто — показываем форму ввода */
  code: string;
  status: KeyStatus;
  /** Почему ключ не принят: текст с сервера */
  message?: string;
  className?: string;
}

/**
 *  Ключ и его статус: слева ввод или сам код, справа — приняли ли его.
 *
 *  Одна карточка на обе половины, а не две рядом: это один предмет
 *  разговора, и разделяет их линия, а не воздух.
 *
 *  Секция живёт на всех трёх шагах, а не только на первом: код ключа
 *  нужен покупателю и на ожидании (написать в поддержку), и на успехе, а
 *  прыгающая на его месте вёрстка читается как смена страницы
 */
export const KeySection: FC<Props> = ({
  code,
  status,
  message,
  className,
}) => (
  <section className={clsx(classes.section, className)}>
    <div className={classes.key}>
      <span className={classes.key_icon}>
        <KeyIcon size={24} />
      </span>

      <div className={classes.key_body}>
        <h2 className={classes.key_title}>Ваш ключ активации</h2>
        {code ? <KeyCode code={code} /> : <KeyForm label="" />}
      </div>
    </div>

    <div className={clsx(classes.status, classes[status])}>
      {status === 'accepted' ? (
        <SuccessMark />
      ) : (
        <span className={classes.status_icon}>
          <AlertIcon size={20} />
        </span>
      )}

      <div className={classes.status_body}>
        <p className={classes.status_title}>{title(status)}</p>
        <p className={classes.status_text}>{message || text(status)}</p>
      </div>
    </div>
  </section>
);

function title(status: KeyStatus): string {
  if (status === 'accepted') return 'Ключ принят';
  if (status === 'rejected') return 'Ключ не принят';
  return 'Ключ не проверен';
}

function text(status: KeyStatus): string {
  if (status === 'accepted') return 'Можно переходить к активации.';
  if (status === 'rejected') return 'Напишите в поддержку — разберёмся.';
  return 'Введите код из письма — проверим его и откроем активацию.';
}
