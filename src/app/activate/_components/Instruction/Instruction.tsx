import React, { FC } from 'react';

import { Button } from '@/components/ui';
import { parseInstruction } from '@/utils/helpers';

import classes from './Instruction.module.scss';
import { Reveal } from '@/components/motion';

interface Props {
  text: string;
  serviceName: string;
  serviceUrl?: string;
  url?: string;
  urlLabel?: string;
}

export const Instruction: FC<Props> = ({
  text,
  serviceName,
  serviceUrl,
  url,
  urlLabel,
}) => {
  const blocks = parseInstruction(text);

  const showSource = Boolean(serviceUrl);
  const showHowTo = Boolean(url) && url !== serviceUrl;

  if (!blocks.length && !showSource && !showHowTo) return null;

  return (
    <Reveal className={classes.card}>
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

        {(showSource || showHowTo) && (
          <div className={classes.actions}>
            {showSource && (
              <Button
                href={serviceUrl}
                external
                variant="outlined"
                size="small"
              >
                Открыть {serviceName}
              </Button>
            )}

            {showHowTo && (
              <Button href={url} external variant="outlined" size="small" >
                {urlLabel || 'Получить токен'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
};
