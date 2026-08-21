'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScroll } from 'framer-motion';

/** Поведение шапки: прижатость к странице и мобильное меню.
 *
 *  Собрано в одном месте, потому что это целиком про побочные эффекты —
 *  подписка на прокрутку, блокировка скролла страницы, слушатель Escape,
 *  закрытие при смене адреса. В компоненте они тонули между разметкой,
 *  хотя правят их по совершенно другим поводам.
 */

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

  // Шапка прижимается к странице, как только от верха отъехали: у
  // прозрачной поверх героя не видно границы, а у постоянно залитой
  // фоном первый экран выглядит разрезанным пополам.
  useEffect(
    () => scrollY.on('change', (value) => setIsScrolled(value > 8)),
    [scrollY],
  );

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

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

  return { isScrolled, isOpen, toggle, close };
}
