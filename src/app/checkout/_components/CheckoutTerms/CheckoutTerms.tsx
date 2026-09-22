import React, { FC } from 'react';
import Link from 'next/link';

import { Reveal } from '@/components/motion';
import { BlockIcon, Prose } from '@/components/ui';
import type { CheckoutBlockDto } from '@/store/api/types';
import { Routes } from '@/utils/consts';

import classes from './CheckoutTerms.module.scss';

interface Props {
  blocks: CheckoutBlockDto[];
}

export const CheckoutTerms: FC<Props> = ({ blocks }) => (
  <div className={classes.blocks}>
    {blocks.map((block) => {
      return (
        <Reveal key={block.key} className={classes.block}>
          <div className={classes.block_head}>
            <span className={classes.block_icon}>
              <BlockIcon name={block.icon} size={20} />
            </span>
            <h3 className={classes.block_title}>{block.title}</h3>
          </div>

          <Prose text={block.body} />
        </Reveal>
      );
    })}

    <p className={classes.legal}>
      Оформляя заказ, вы соглашаетесь с{' '}
      <Link href={Routes.Terms}>пользовательским соглашением</Link> и{' '}
      <Link href={Routes.Privacy}>политикой конфиденциальности</Link>.
    </p>
  </div>
);
