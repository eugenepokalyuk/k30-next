'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScroll } from 'framer-motion';

/** Поведение шапки: подписка на прокрутку, блокировка скролла, Escape,
 *  закрытие меню при смене адреса. */

interface State {
  /** Отъехали от верха: у прозрачной поверх героя не видно границы. */
  isScrolled: boolean;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export function useHeaderState(): State {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(
    () => scrollY.on('change', (value) => setIsScrolled(value > 8)),
    [scrollY],
  );

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  // Сброс во время рендера, а не в эффекте: эффект дал бы лишний проход
  // с открытым меню поверх уже новой страницы.
  const [renderedPath, setRenderedPath] = useState(pathname);

  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setIsOpen(false);
  }

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

  return { isScrolled, isOpen, toggle, close };
}
