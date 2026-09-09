'use client';

import React, { FC } from 'react';
import Image from 'next/image';

import { Button, Modal } from '@/components/ui';

import classes from './TargetStep.module.scss';

interface Props {
  image: string;
  caption: string;
  label: string;
  isOwn: boolean;
}

export const TargetExample: FC<Props> = ({ image, caption, label, isOwn }) => {
  const [isOpen, setOpen] = React.useState(false);

  if (!image) return null;

  const title = isOwn ? `Где взять: ${label}` : 'Где взять данные';

  return (
    <>
      <button
        type="button"
        className={classes.example_link}
        onClick={() => setOpen(true)}
      >
        {'Посмотреть пример'}
      </button>

      <Modal
        isOpen={isOpen}
        title={title}
        size="wide"
        onClose={() => setOpen(false)}
      >
        <h2 className={classes.example_title}>{title}</h2>

        <Image
          src={image}
          alt={caption || title}
          width={1200}
          height={800}
          className={classes.example_image}
        />

        {caption && <p className={classes.example_caption}>{caption}</p>}

        <div className={classes.example_actions}>
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={() => setOpen(false)}
          >
            {'Понятно'}
          </Button>
        </div>
      </Modal>
    </>
  );
};
