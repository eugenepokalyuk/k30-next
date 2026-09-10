'use client';

import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';

import classes from './Lightbox.module.scss';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../Icons/Icons';

const SHIFT = 48;

export interface LightboxItem {
  id: string;
  image: string;
  caption?: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

export const Lightbox: FC<Props> = ({ items, index, onClose, onChange }) => {
  const isOpen = index !== null && items.length > 0;

  const [direction, setDirection] = React.useState(0);

  const showPrev = React.useCallback(() => {
    if (index === null) return;
    setDirection(-1);
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const showNext = React.useCallback(() => {
    if (index === null) return;
    setDirection(1);
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };

    document.addEventListener('keydown', onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose, showPrev, showNext]);

  if (typeof document === 'undefined') return null;

  const current = index === null ? undefined : items[index];

  return createPortal(
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          className={classes.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease }}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || 'Просмотр изображения'}
          onClick={onClose}
        >
          <motion.button
            type="button"
            className={classes.close}
            aria-label="Закрыть"
            onClick={onClose}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: duration.fast, ease }}
          >
            <CloseIcon size={24} />
          </motion.button>

          {items.length > 1 && (
            <motion.button
              type="button"
              className={clsx(classes.arrow, classes.arrow_prev)}
              aria-label="Предыдущее изображение"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: duration.fast, ease }}
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
            >
              <ArrowLeftIcon size={24} />
            </motion.button>
          )}

          <motion.figure
            key={current.id}
            className={classes.figure}
            initial={{ opacity: 0, x: direction * SHIFT }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: duration.base, ease }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.image}
              alt={current.caption || ''}
              width={1920}
              height={1280}
              className={classes.image}
              sizes="100vw"
              priority
            />

            {(current.caption || items.length > 1) && (
              <figcaption className={classes.caption}>
                {current.caption}

                {items.length > 1 && (
                  <span className={classes.counter}>
                    {index + 1} / {items.length}
                  </span>
                )}
              </figcaption>
            )}
          </motion.figure>

          {items.length > 1 && (
            <motion.button
              type="button"
              className={clsx(classes.arrow, classes.arrow_next)}
              aria-label="Следующее изображение"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: duration.fast, ease }}
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              <ArrowRightIcon size={24} />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
