'use client';

import React, { FC } from 'react';

import { Stagger, StaggerItem } from '@/components/motion';
import { getBlockIcon, Section } from '@/components/ui';
import { useHowStepsQuery } from '@/store/api/k30Api';

import classes from './HowSection.module.scss';

export const HowSection: FC = () => {
  const { data } = useHowStepsQuery();

  if (!data?.length) return null;

  return (
    <Section
      id="how"
      overline="Порядок действий"
      title="Как это работает"
      description="Путь от оплаты до работающей подписки"
    >
      <Stagger as="ol" className={classes.list}>
        {data.map((step, index) => {
          const Icon = getBlockIcon(step.icon);

          return (
            <StaggerItem as="li" key={step.id} className={classes.item}>
              <span className={classes.number} aria-hidden>
                {index + 1}
              </span>

              <div className={classes.body}>
                <div className={classes.head}>
                  <span className={classes.icon}>
                    <Icon size={20} />
                  </span>
                  <h3 className={classes.title}>{step.title}</h3>
                </div>

                <p className={classes.text}>{step.description}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
};
