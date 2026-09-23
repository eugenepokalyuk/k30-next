'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { ArrowRightIcon, CheckIcon, CloseIcon, Field } from '@/components/ui';

import classes from './PromoField.module.scss';
import type { Promo } from './usePromo';

interface Props {
  promo: Promo;
}

export const PromoField: FC<Props> = ({ promo }) => {
  const { applied, error, isChecking } = promo;

  const [code, setCode] = React.useState('');

  React.useEffect(() => {
    if (applied) setCode(applied.code);
  }, [applied]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    run();
  };

  const run = () => {
    if (isChecking) return;
    if (applied) {
      promo.clear();
      return;
    }

    promo.apply(code);
  };

  const state = applied ? 'applied' : isChecking ? 'checking' : 'idle';

  return (
    <form className={classes.form} onSubmit={submit} noValidate>
      <Field
        label="Промокод"
        placeholder="PROMO500"
        value={code}
        onChange={(value) => {
          setCode(value);
          if (error) promo.dismiss();
        }}
        invalid={Boolean(error)}
        readOnly={Boolean(applied)}
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="done"
        inputClassName={classes.input}
        addon={
          <button
            type="button"
            className={clsx(classes.action, applied && classes.accepted)}
            onClick={run}
            disabled={!applied && (isChecking || !code.trim())}
            aria-label={applied ? 'Отменить промокод' : 'Применить промокод'}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={state}
                className={classes.glyph}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: duration.fast, ease }}
              >
                {state === 'idle' && <ArrowRightIcon size={18} />}
                {state === 'checking' && (
                  <span className={classes.spinner} aria-hidden />
                )}
                {state === 'applied' && (
                  <>
                    <CheckIcon size={18} className={classes.check} />
                    <CloseIcon size={18} className={classes.cross} />
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        }
      />

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key={error}
            className={classes.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.fast, ease }}
          >
            <span className={classes.error_text}>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};
