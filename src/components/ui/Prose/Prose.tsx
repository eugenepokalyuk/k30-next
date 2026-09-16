import React, { FC } from 'react';
import clsx from 'clsx';

import { parseInstruction } from '@/utils/helpers';

import classes from './Prose.module.scss';
import { RichText } from '../RichText/RichText';

interface Props {
  text: string;
  variant?: 'bullets' | 'numbers';
  className?: string;
}

export const Prose: FC<Props> = ({ text, variant = 'bullets', className }) => {
  const blocks = parseInstruction(text);

  if (!blocks.length) return null;

  const List = variant === 'numbers' ? 'ol' : 'ul';

  return (
    <div className={clsx(classes.prose, className)}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <List key={index} className={classes[variant]}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className={classes.item}>
                <RichText text={item} />
              </li>
            ))}
          </List>
        ) : (
          <p key={index} className={classes.paragraph}>
            <RichText text={block.text} />
          </p>
        ),
      )}
    </div>
  );
};
