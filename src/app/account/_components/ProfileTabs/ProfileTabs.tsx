'use client';

import React, { FC } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';

import classes from './ProfileTabs.module.scss';

export interface ProfileTab {
  id: string;
  label: string;
  count?: number;
  content: React.ReactNode;
}

interface Props {
  tabs: ProfileTab[];
}

export const ProfileTabs: FC<Props> = ({ tabs }) => {
  const [active, setActive] = React.useState(tabs[0]?.id ?? '');
  const id = React.useId();

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];
  if (!current) return null;

  return (
    <section className={classes.wrapper}>
      <div className={classes.bar} role="tablist">
        {tabs.map((tab) => {
          const isOn = tab.id === current.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${id}-${tab.id}`}
              aria-selected={isOn}
              aria-controls={`${id}-${tab.id}-panel`}
              className={clsx(classes.tab, isOn && classes.on)}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}

              {Boolean(tab.count) && (
                <span className={classes.count}>{tab.count}</span>
              )}

              {isOn && (
                <motion.span
                  layoutId={`${id}-underline`}
                  className={classes.underline}
                  transition={{ duration: duration.fast, ease }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-${current.id}-panel`}
        aria-labelledby={`${id}-${current.id}`}
        className={classes.panel}
      >
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease }}
        >
          {current.content}
        </motion.div>
      </div>
    </section>
  );
};
