'use client';

import React, { FC, useId } from 'react';
import clsx from 'clsx';

import classes from './Field.module.scss';

interface Props {
  label?: string;
  hint?: string;
  /** Текст ошибки под полем. Пусто — блок не рендерится и вёрстка не прыгает. */
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'textarea';
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
  /** Правый угол поля: кнопка «вставить», счётчик, иконка. */
  addon?: React.ReactNode;
  /** Раскладка клавиатуры на телефоне. */
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  /** Автозаглавные на мобильной клавиатуре: 'characters' для кодов. */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  spellCheck?: boolean;
  /** Подпись на клавише ввода: 'go', 'send', 'next'. */
  enterKeyHint?: React.HTMLAttributes<HTMLInputElement>['enterKeyHint'];
}

export const Field: FC<Props> = ({
  label,
  hint,
  error,
  placeholder,
  value,
  onChange,
  type = 'text',
  name,
  autoComplete,
  disabled,
  rows = 6,
  className,
  inputClassName,
  addon,
  inputMode,
  autoCapitalize,
  spellCheck,
  enterKeyHint,
}) => {
  const id = useId();
  const hintId = `${id}-hint`;

  const shared = {
    id,
    name,
    value,
    placeholder,
    disabled,
    autoComplete,
    inputMode,
    autoCapitalize,
    spellCheck,
    enterKeyHint,
    'aria-invalid': Boolean(error),
    // Подсказку и ошибку связываем с полем: скринридер прочитает их
    // вместе с подписью, а не отдельным текстом непонятно про что.
    'aria-describedby': error || hint ? hintId : undefined,
    className: clsx(classes.control, inputClassName, {
      [classes.invalid]: Boolean(error),
    }),
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
  };

  return (
    <div className={clsx(classes.field, className)}>
      {label && (
        <label className={classes.label} htmlFor={id}>
          {label}
        </label>
      )}

      <div className={classes.control_wrapper}>
        {type === 'textarea' ? (
          <textarea {...shared} rows={rows} />
        ) : (
          <input {...shared} type={type} />
        )}
        {addon && <div className={classes.addon}>{addon}</div>}
      </div>

      {(error || hint) && (
        <p
          id={hintId}
          className={clsx(classes.hint, { [classes.error]: Boolean(error) })}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
};
