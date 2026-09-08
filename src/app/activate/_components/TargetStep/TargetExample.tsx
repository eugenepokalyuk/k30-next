'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';

import { Button, Modal } from '@/components/ui';

import classes from './TargetStep.module.scss';

interface Props {
  /** Свой пример вида данных, иначе запасной по сервису */
  image: string;
  caption: string;
  /** Подпись поля — ею называем окно, когда снимок именно про него */
  label: string;
  /**
   *  Снимок заведён под этот вариант ввода. Запасной не подписываем
   *  вариантом: у Claude их два, и одна картинка под заголовками «где
   *  взять SessionKey» и «где взять Organization ID» вводит в заблуждение
   */
  isOwn: boolean;
}

/** Скриншот «где это лежит» — под полем ввода, по ссылке */
export const TargetExample: FC<Props> = ({ image, caption, label, isOwn }) => {
  const [isOpen, setOpen] = useState(false);

  if (!image) return null;

  const title = isOwn ? `Где взять: ${label}` : 'Где взять данные';

  return (
    <>
      <button
        type="button"
        className={classes.example_link}
        onClick={() => setOpen(true)}
      >
        Посмотреть пример
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
          // Настоящий размер скриншота неизвестен, поэтому числа здесь —
          // только подсказка о пропорциях, а ширину задаёт вёрстка
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
            Понятно
          </Button>
        </div>
      </Modal>
    </>
  );
};
