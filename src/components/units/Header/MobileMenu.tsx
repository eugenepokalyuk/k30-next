'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { useSiteSettings } from '@/lib/hooks';

import classes from './Header.module.scss';
import { AuthButton } from './AuthButton';
import { navLinks } from './navLinks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/** Выезжающая панель меню на узких экранах.
 *
 *  Подложка отдельным элементом, а не тенью панели: по ней закрывают
 *  меню касанием мимо, и это единственный очевидный способ выйти на
 *  телефоне, где Escape нажать нечем.
 */
export const MobileMenu: FC<Props> = ({ isOpen, onClose }) => {
  const { telegram_support_url } = useSiteSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={classes.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease }}
            onClick={onClose}
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
              {navLinks.map((link, index) => (
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
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className={classes.panel_footer}>
              <AuthButton onNavigate={onClose} />
              <a
                className={classes.panel_support}
                href={telegram_support_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
              >
                Поддержка в телеграме
              </a>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};
