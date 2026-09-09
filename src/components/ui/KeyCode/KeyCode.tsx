'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import classes from './KeyCode.module.scss';
import { CheckIcon, CopyIcon } from '../Icons/Icons';

interface Props {
  code: string;
  className?: string;
}

export const KeyCode: FC<Props> = ({ code, className }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {}
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
