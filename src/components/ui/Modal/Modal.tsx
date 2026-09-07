'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import classes from './Modal.module.scss';

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  title: string;
  isDismissible?: boolean;
  size?: 'default' | 'wide';
  onClose?: () => void;
  className?: string;
}

export const Modal: FC<Props> = ({
  isOpen,
  title,
  isDismissible = true,
  size = 'default',
  onClose,
  className,
  children,
}) => {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !isDismissible) return;

    const onBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) onClose?.();
    };

    dialog.addEventListener('click', onBackdrop);
    return () => dialog.removeEventListener('click', onBackdrop);
  }, [isDismissible, onClose]);

  return (
    <dialog
      ref={ref}
      className={clsx(
        classes.dialog,
        size === 'wide' && classes.wide,
        className,
      )}
      aria-label={title}
      onCancel={(event) => {
        if (!isDismissible) {
          event.preventDefault();
          return;
        }
        onClose?.();
      }}
    >
      <div className={classes.body}>{children}</div>
    </dialog>
  );
};
