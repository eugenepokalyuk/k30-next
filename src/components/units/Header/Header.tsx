'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { CloseIcon, Logo, MenuIcon } from '@/components/ui';
import { useSiteSettings } from '@/lib/hooks';

import classes from './Header.module.scss';
import { AuthButton } from './AuthButton';
import { MobileMenu } from './MobileMenu';
import { navLinks } from './navLinks';
import { useHeaderState } from './useHeaderState';

/** Шапка сайта.
 *
 *  Сам компонент только раскладывает элементы. Побочные эффекты —
 *  прокрутка, блокировка скролла, Escape, закрытие при смене адреса —
 *  живут в `useHeaderState`, панель для узких экранов в `MobileMenu`.
 */
export const Header: FC = () => {
  const { isScrolled, isOpen, toggle, close } = useHeaderState();
  // Контакт поддержки — из админки: он меняется чаще, чем выходит
  // релиз витрины, и раньше ради этого пересобиралась вся статика.
  const { telegram_support_url } = useSiteSettings();

  return (
    <header
      className={clsx(classes.header, { [classes.scrolled]: isScrolled })}
    >
      <div className={classes.container}>
        <Logo className={classes.logo} />

        <nav className={classes.nav} aria-label="Разделы сайта">
          {navLinks.map((link) => (
            <Link key={link.href} className={classes.link} href={link.href}>
              {link.label}
            </Link>
          ))}
          <a
            className={classes.link}
            href={telegram_support_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Поддержка
          </a>
        </nav>

        <div className={classes.actions}>
          <div className={classes.auth}>
            <AuthButton onNavigate={close} />
          </div>

          <button
            type="button"
            className={classes.burger}
            onClick={toggle}
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {/* Иконки меняются местами через AnimatePresence, а не
                сменой пути в svg: так поворот виден и на медленном
                телефоне, где мгновенная подмена читается как глитч. */}
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={isOpen ? 'close' : 'menu'}
                className={classes.burger_icon}
                initial={{ opacity: 0, rotate: isOpen ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: isOpen ? 90 : -90 }}
                transition={{ duration: duration.fast, ease }}
              >
                {isOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={close} />
    </header>
  );
};
