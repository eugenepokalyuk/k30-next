'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useScroll } from 'framer-motion';

interface State {
  isScrolled: boolean;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export function useHeaderState(): State {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(
    () => scrollY.on('change', (value) => setIsScrolled(value > 8)),
    [scrollY],
  );

  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((current) => !current), []);

  // Не в эффекте: он дал бы лишний проход с меню поверх новой страницы
  const [renderedPath, setRenderedPath] = React.useState(pathname);

  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setIsOpen(false);
  }

  React.useEffect(() => {
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
