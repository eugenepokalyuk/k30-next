import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { Reveal } from '@/components/motion';

import classes from './Section.module.scss';

interface Props extends PropsWithChildren {
  id?: string;
  overline?: string;
  title?: string;
  description?: string;
  className?: string;
  centered?: boolean;
  action?: React.ReactNode;
}

export const Section: FC<Props> = ({
  id,
  overline,
  title,
  description,
  className,
  centered,
  action,
  children,
}) => (
  <section id={id} className={clsx(classes.section, className)}>
    <div className={classes.container}>
      {(overline || title || description) && (
        <Reveal
          as="header"
          className={clsx(classes.header, {
            [classes.centered]: centered,
            [classes.wide]: Boolean(action),
          })}
        >
          {overline && <p className={classes.overline}>{overline}</p>}

          {(title || action) && (
            <div className={classes.title_row}>
              {title && <h2 className={classes.title}>{title}</h2>}
              {action}
            </div>
          )}

          {description && <p className={classes.description}>{description}</p>}
        </Reveal>
      )}

      {children}
    </div>
  </section>
);
