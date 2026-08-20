'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AnimatePresence, motion, useScroll } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Button, CloseIcon, Logo, MenuIcon, UserIcon } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthorized, selectIsAuthReady } from '@/store/slices/auth';
import { Routes, SupportTelegram } from '@/utils/consts';

import classes from './Header.module.scss';

const links = [
  { href: Routes.Services, label: 'Сервисы' },
  { href: Routes.How, label: 'Как это работает' },
  { href: Routes.Faq, label: 'Вопросы' },
];

export const Header: FC = () => {
  const pathname = usePathname();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isReady = useAppSelector(selectIsAuthReady);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Шапка прижимается к странице, как только от верха отъехали: у
  // прозрачной поверх героя не видно границы, а у постоянно залитой
  // фоном первый экран выглядит разрезанным пополам.
  useEffect(
    () => scrollY.on('change', (value) => setIsScrolled(value > 8)),
    [scrollY],
  );

  const close = useCallback(() => setIsOpen(false), []);

  // Переход на другую страницу закрывает меню — в том числе по кнопке
  // «назад», мимо обработчиков на ссылках. Сброс во время рендера, а не
  // в эффекте: эффект здесь дал бы лишний проход рендера с открытым
  // меню поверх уже новой страницы.
  const [renderedPath, setRenderedPath] = useState(pathname);

  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setIsOpen(false);
  }

  // Пока панель открыта, страница под ней не прокручивается: иначе на
  // телефоне свайп по меню утаскивает содержимое сзади.
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  const authButton = isReady && (
    <Button
      href={isAuthorized ? Routes.Account : Routes.Login}
      size="small"
      variant="outlined"
      onClick={close}
      className={classes.button}
    >
      {isAuthorized && <UserIcon size={16} />}
      {isAuthorized ? 'Кабинет' : 'Войти'}
    </Button>
  );

  return (
    <header className={clsx(classes.header, { [classes.scrolled]: isScrolled })}>
      <div className={classes.container}>
        <Logo className={classes.logo} />

        <nav className={classes.nav} aria-label="Разделы сайта">
          {links.map((link) => (
            <Link key={link.href} className={classes.link} href={link.href}>
              {link.label}
            </Link>
          ))}
          <a
            className={classes.link}
            href={SupportTelegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Поддержка
          </a>
        </nav>

        <div className={classes.actions}>
          {/* Пока не восстановили вход из localStorage, кнопку не рисуем:
              иначе на долю секунды показывается «Войти» уже вошедшему. */}
          <div className={classes.auth}>{authButton}</div>

          <button
            type="button"
            className={classes.burger}
            onClick={() => setIsOpen((current) => !current)}
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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={classes.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.base, ease }}
              onClick={close}
              aria-hidden
            />

            <motion.nav
              id="mobile-menu"
              className={classes.panel}
              aria-label="Меню"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: duration.base, ease }}
            >
              <ul className={classes.panel_list}>
                {links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: duration.base,
                      ease,
                      delay: 0.04 * index,
                    }}
                  >
                    <Link
                      className={classes.panel_link}
                      href={link.href}
                      onClick={close}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className={classes.panel_footer}>
                {authButton}
                <a
                  className={classes.panel_support}
                  href={SupportTelegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                >
                  Поддержка в телеграме
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
