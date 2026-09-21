import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import {
  AlertIcon,
  Button,
  LinkIcon,
  OpenInNewIcon,
  RichText,
} from '@/components/ui';
import { parseInstruction } from '@/utils/helpers';

import classes from './Instruction.module.scss';

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
        <div className={classes.left}>
          {blocks.map((block, index) =>
            block.type === 'list' ? (
              <ul key={index} className={classes.list}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={classes.item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p key={index} className={classes.paragraph}>
                {index === 0 && <AlertIcon size={18} className={classes.paragraph_icon} />}
                <RichText text={block.text} />
              </p>
            ),
          )}
        </div>

        <div className={classes.right}>
          {(showSource || showHowTo) && (
            <div className={classes.actions}>
              {showSource && (
                <Button
                  href={serviceUrl}
                  external
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <OpenInNewIcon size={18} />
                  Открыть {serviceName}
                </Button>
              )}

              {showHowTo && (
                <Button href={url} external size="small" fullWidth>
                  <LinkIcon size={18} />

                  {urlLabel || 'Получить токен'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
};
