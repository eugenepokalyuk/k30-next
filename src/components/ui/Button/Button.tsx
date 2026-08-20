import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import classes from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'default';
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  href?: string;
  /** Внешняя ссылка — рендерим <a> вместо next/link, открываем в новой вкладке. */
  external?: boolean;
}

export const Button: FC<Props> = ({
  size = 'medium',
  color = 'primary',
  variant = 'filled',
  className,
  fullWidth,
  loading,
  disabled,
  children,
  href,
  external,
  onClick,
  ...rest
}) => {
  const cx = clsx(
    classes.button,
    classes[size],
    // Класс цвета — только у залитой кнопки. Раньше он вешался всегда, и
    // у outlined поверх прозрачного фона всё равно срабатывал
    // .primary:hover: кнопка «Кабинет» на наведении заливалась фирменным
    // цветом, а текст красился в него же и пропадал.
    variant === 'filled' ? classes[color] : classes[variant],
    className,
    { [classes.full_width]: fullWidth, [classes.loading]: loading },
  );

  // Ссылке отдаём только onClick, а не весь rest: остальные пропсы
  // типизированы под <button> и на <a> либо не нужны, либо приводят к
  // невалидному html. onClick исключение — им закрывают меню при
  // переходе, и без него кнопка «Войти» в мобильной панели оставляла
  // её открытой поверх новой страницы.
  const linkProps = {
    className: cx,
    onClick: onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>,
  };

  if (href && external) {
    return (
      <a {...linkProps} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link {...linkProps} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      {...rest}
      onClick={onClick}
      // Пока идёт запрос, кнопка выключена — иначе второй клик отправит
      // второй запрос к провайдеру, а тот за два вызова спишет две подписки.
      disabled={disabled || loading}
      className={cx}
    >
      {loading && <span className={classes.spinner} aria-hidden />}
      {children}
    </button>
  );
};
