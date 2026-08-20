import React, { FC } from 'react';

import { Button } from '@/components/ui';
import { parseInstruction } from '@/utils/helpers';

import classes from './Instruction.module.scss';

interface Props {
  text: string;
  url?: string;
  urlLabel?: string;
}

/** Инструкция сервиса. Текст приезжает из админки уже с подставленным
 *  кодом ключа — здесь только разметка блоков. */
export const Instruction: FC<Props> = ({ text, url, urlLabel }) => {
  const blocks = parseInstruction(text);

  if (!blocks.length && !url) return null;

  return (
    <div className={classes.instruction}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className={classes.list}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className={classes.item}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p key={index} className={classes.paragraph}>
            {block.text}
          </p>
        ),
      )}

      {url && (
        <Button href={url} external variant="outlined" size="small">
          {urlLabel || 'Открыть страницу с токеном'}
        </Button>
      )}
    </div>
  );
};
