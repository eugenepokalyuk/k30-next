'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { ChevronDownIcon } from '@/components/ui';

import classes from './FaqSection.module.scss';

interface Props {
  question: string;
  answer: string;
  index: number;
}

export const FaqItem: FC<Props> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = React.useId();

  return (
    <li className={clsx(classes.item, { [classes.item_open]: isOpen })}>
      <h3 className={classes.heading}>
        <button
          type="button"
          className={classes.question}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls={id}
        >
          <span className={classes.number} aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className={classes.text}>{question}</span>

          <motion.span
            className={classes.chevron}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: duration.base, ease }}
            aria-hidden
          >
            <ChevronDownIcon size={20} />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            role="region"
            className={classes.answer_wrapper}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.base, ease }}
          >
            <div className={classes.answer}>
              {answer
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
