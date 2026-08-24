'use client';

import React, { FC, useId, useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { ChevronDownIcon } from '@/components/ui';

import classes from './FaqSection.module.scss';

interface Props {
  question: string;
  answer: string;
}

/** Вопрос с раскрывающимся ответом. */
export const FaqItem: FC<Props> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

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
          <span>{question}</span>
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
            {/* Ответ пишет менеджер в админке простым текстом:
                абзацы разделяются пустой строкой. */}
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
