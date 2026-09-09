'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import classes from './Field.module.scss';

interface Props {
  label?: string;
  hint?: string;
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
  addon?: React.ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  spellCheck?: boolean;
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
  const id = React.useId();
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
