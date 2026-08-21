'use client';

import React, { FC } from 'react';

import { Reveal } from '@/components/motion';
import { Button, ChatIcon, Section } from '@/components/ui';
import { useSiteSettings } from '@/lib/hooks';
import { useFaqQuery } from '@/store/api/k30Api';

import classes from './FaqSection.module.scss';
import { FaqItem } from './FaqItem';

/**
 * Частые вопросы — из админки, а не из разметки.
 *
 * Вопросы сюда попадают по следам поддержки: пришёл третий человек с
 * одним и тем же — ответ надо повесить сегодня. Раньше это означало
 * правку кода, сборку и выкатку статики, теперь запись в разделе
 * «Частые вопросы».
 *
 * Пока список едет (или если он пуст), секция не рисуется вовсе:
 * заголовок «Частые вопросы» над пустотой хуже отсутствия блока, а
 * заглушка из скелетонов мигала бы при каждой загрузке главной.
 */
export const FaqSection: FC = () => {
  const { data } = useFaqQuery();
  const { telegram_support_url } = useSiteSettings();

  if (!data?.length) return null;

  return (
    <Section id="faq" overline="Вопросы" title="Частые вопросы">
      <div className={classes.layout}>
        <Reveal as="ul" className={classes.list}>
          {data.map((item) => (
            <FaqItem
              key={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </Reveal>

        <Reveal as="aside" delay={0.1} className={classes.support}>
          <span className={classes.support_icon}>
            <ChatIcon size={22} />
          </span>
          <p className={classes.support_title}>Не нашли ответ?</p>
          <p className={classes.support_text}>
            Напишите в телеграм — отвечаем и помогаем довести активацию до
            конца.
          </p>
          <Button
            href={telegram_support_url}
            external
            variant="outlined"
            size="small"
          >
            Написать в поддержку
          </Button>
        </Reveal>
      </div>
    </Section>
  );
};
