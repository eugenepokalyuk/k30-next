'use client';

import React, { FC } from 'react';

import { Button, Modal, ServiceMark } from '@/components/ui';
import { SupportTelegram } from '@/utils/consts';
import { parseInstruction } from '@/utils/helpers';

import classes from './ActivationRules.module.scss';

interface Props {
  serviceName: string;
  logo: string | null;
  accentColor?: string;
  rules: string;
  onAccept: () => void;
}

export const ActivationRules: FC<Props> = ({
  serviceName,
  logo,
  accentColor,
  rules,
  onAccept,
}) => {
  const blocks = parseInstruction(rules);

  return (
    <Modal
      isOpen
      title={`Правила активации ${serviceName}`}
      isDismissible={false}
      size="wide"
    >
      <div className={classes.heading}>
        <ServiceMark
          logo={logo}
          accentColor={accentColor}
          size={logo ? 48 : null}
        />

        <h2 className={classes.title}>Правила активации {serviceName}</h2>
      </div>

      <div className={classes.rules}>
        {blocks.map((block, index) =>
          block.type === 'list' ? (
            <ol key={index} className={classes.list}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className={classes.item}>
                  {item}
                </li>
              ))}
            </ol>
          ) : (
            <p key={index} className={classes.paragraph}>
              {block.text}
            </p>
          ),
        )}
      </div>

      <div className={classes.actions}>
        <Button type="button" size="large" onClick={onAccept}>
          Я ознакомился — перейти к активации
        </Button>

        <Button href={SupportTelegram} external variant="outlined" size="large">
          Не согласен — написать в поддержку
        </Button>
      </div>
    </Modal>
  );
};
