'use client';

import React, { FC } from 'react';

import { Lightbox } from '@/components/ui';

import classes from './TargetStep.module.scss';

interface Props {
  image: string;
  caption: string;
  label: string;
  isOwn: boolean;
}

export const TargetExample: FC<Props> = ({ image, caption, label, isOwn }) => {
  const [index, setIndex] = React.useState<number | null>(null);

  const title = isOwn ? `Где взять: ${label}` : 'Где взять данные';

  const items = React.useMemo(
    () => (image ? [{ id: image, image, caption: caption || title }] : []),
    [image, caption, title],
  );

  if (!image) return null;

  return (
    <>
      <button
        type="button"
        className={classes.example_link}
        onClick={() => setIndex(0)}
      >
        {'Посмотреть пример'}
      </button>

      <Lightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onChange={setIndex}
      />
    </>
  );
};
