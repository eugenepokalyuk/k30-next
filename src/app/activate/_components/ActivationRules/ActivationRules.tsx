'use client';

import React, { FC } from 'react';

import {
  Button,
  getBlockIcon,
  Modal,
  RichText,
  ServiceMark,
} from '@/components/ui';
import type { ActivationRuleBlockDto } from '@/store/api/types';
import { SupportTelegram } from '@/utils/consts';
import { type InstructionBlock, parseInstruction } from '@/utils/helpers';

import classes from './ActivationRules.module.scss';

interface Props {
  serviceName: string;
  logo: string | null;
  accentColor?: string;
  rules: string;
  ruleBlocks: ActivationRuleBlockDto[];
  onAccept: () => void;
}

/** Абзацы и нумерованные списки из шаблона админки */
const Prose: FC<{ blocks: InstructionBlock[] }> = ({ blocks }) => (
  <>
    {blocks.map((block, index) =>
      block.type === 'list' ? (
        <ol key={index} className={classes.list}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className={classes.item}>
              <RichText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <p key={index} className={classes.paragraph}>
          <RichText text={block.text} />
        </p>
      ),
    )}
  </>
);

export const ActivationRules: FC<Props> = ({
  serviceName,
  logo,
  accentColor,
  rules,
  ruleBlocks,
  onAccept,
}) => {
  const [intro, ...rest] = parseInstruction(rules);

  // Блок без заголовка или текста — недописанный: показать его значит
  // показать покупателю иконку с пустотой под ней
  const blocks = ruleBlocks.filter(
    (block) => block.title.trim() && block.body.trim(),
  );

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
        {intro && <Prose blocks={[intro]} />}

        {blocks.map((block, index) => {
          const Icon = getBlockIcon(block.icon);

          return (
            <section key={index} className={classes.block}>
              <h3 className={classes.block_title}>
                <span className={classes.block_icon}>
                  <Icon size={20} />
                </span>
                {block.title}
              </h3>

              <div className={classes.block_body}>
                <Prose blocks={parseInstruction(block.body)} />
              </div>
            </section>
          );
        })}

        <Prose blocks={rest} />
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
