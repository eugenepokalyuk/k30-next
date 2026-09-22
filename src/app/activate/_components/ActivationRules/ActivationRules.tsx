'use client';

import React, { FC } from 'react';
import clsx from 'clsx';

import {
  BlockIcon,
  Button,
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

  const blocks = ruleBlocks.filter(
    (block) => block.title.trim() && block.body.trim(),
  );

  const tabsId = React.useId();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeBlock = blocks[activeIndex] ?? blocks[0];

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

        {blocks.length > 0 && (
          <div className={classes.sections}>
            <div
              className={classes.tabs}
              role="tablist"
              aria-label="Разделы правил"
            >
              {blocks.map((block, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    id={`${tabsId}-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls={`${tabsId}-panel`}
                    className={clsx(classes.tab, {
                      [classes.tab_active]: isActive,
                    })}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className={classes.tab_icon}>
                      <BlockIcon name={block.icon} size={18} />
                    </span>
                    <span className={classes.tab_title}>{block.title}</span>
                  </button>
                );
              })}
            </div>

            {activeBlock && (
              <section
                role="tabpanel"
                id={`${tabsId}-panel`}
                aria-labelledby={`${tabsId}-tab-${activeIndex}`}
                className={classes.panel}
              >
                <h3 className={classes.panel_title}>{activeBlock.title}</h3>

                <div className={classes.block_body}>
                  <Prose blocks={parseInstruction(activeBlock.body)} />
                </div>
              </section>
            )}
          </div>
        )}

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
