import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { Reveal } from '@/components/motion';

import classes from './Section.module.scss';

interface Props extends PropsWithChildren {
  id?: string;
  /** Надзаголовок мелким капсом над основным заголовком. */
  overline?: string;
  title?: string;
  description?: string;
  className?: string;
  /** Заголовок по центру — для секций во всю ширину. */
  centered?: boolean;
}

export const Section: FC<Props> = ({
  id,
  overline,
  title,
  description,
  className,
  centered,
  children,
}) => (
  <section id={id} className={clsx(classes.section, className)}>
    <div className={classes.container}>
      {(overline || title || description) && (
        <Reveal
          as="header"
          className={clsx(classes.header, { [classes.centered]: centered })}
        >
          {overline && <p className={classes.overline}>{overline}</p>}
          {title && <h2 className={classes.title}>{title}</h2>}
          {description && <p className={classes.description}>{description}</p>}
        </Reveal>
      )}

      {children}
    </div>
  </section>
);
