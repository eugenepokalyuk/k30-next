'use client';

import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import clsx from 'clsx';

import classes from './Modal.module.scss';

interface Props extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  /** Можно ли закрыть окно мимо кнопок — Escape или щелчком по фону.
   *  У окна-заслона это выключено: закрытие означало бы согласие. */
  isDismissible?: boolean;
  onClose?: () => void;
  className?: string;
}

/** Модальное окно на нативном `<dialog>`.
 *
 *  Своей реализации на div-ах здесь нет намеренно: `showModal()` сам
 *  запирает фокус внутри, прячет остальную страницу от скринридера и
 *  рисует фон — всё то, что в самодельном окне забывают и что ломает
 *  клавиатуру. Взамен приходится гасить Escape вручную, когда окно
 *  закрывать нельзя.
 */
export const Modal: FC<Props> = ({
  isOpen,
  title,
  isDismissible = true,
  onClose,
  className,
  children,
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Щелчок мимо содержимого попадает в сам <dialog>: это фон. Слушатель
  // нативный, а не пропом на элементе: клавиатуре он не нужен — оттуда
  // окно закрывает Escape, — и в JSX его пришлось бы объяснять линтеру.
  useEffect(() => {
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
      className={clsx(classes.dialog, className)}
      aria-label={title}
      onCancel={(event) => {
        // Escape и системная кнопка «назад» приходят сюда же.
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
