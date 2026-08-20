'use client';

import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';

import classes from './KeyCode.module.scss';
import { CheckIcon, CopyIcon } from '../Icons/Icons';

interface Props {
  code: string;
  className?: string;
}

/** Код ключа моноширинным с кнопкой «скопировать».
 *
 *  Копирование нужно потому, что код пересылают в поддержку — а набирать
 *  его руками второй раз это ровно тот путь, на котором и появляются
 *  опечатки, из-за которых пишут в поддержку.
 */
export const KeyCode: FC<Props> = ({ code, className }) => {
  const [copied, setCopied] = useState(false);

  // Возврат подписи через две секунды. Таймер чистим: пользователь
  // успевает уйти со страницы активации раньше, чем он сработает.
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Буфер недоступен (http без localhost, отказ в разрешении) —
      // код всё равно виден и выделяется мышью, отдельного сообщения
      // это не стоит.
    }
  };

  return (
    <div className={clsx(classes.wrapper, className)}>
      <code className={classes.code}>{code}</code>
      <button
        type="button"
        className={classes.copy}
        onClick={copy}
        aria-label="Скопировать код ключа"
      >
        {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
      </button>
    </div>
  );
};
