'use client';

import React, { FC } from 'react';

import { Notice, Prose, Section } from '@/components/ui';
import { useLegalPageQuery } from '@/store/api/k30Api';
import type { LegalSlug } from '@/store/api/types';
import { formatDate } from '@/utils/helpers';

import classes from './LegalView.module.scss';

interface Props {
  slug: LegalSlug;
  fallbackTitle: string;
}

export const LegalView: FC<Props> = ({ slug, fallbackTitle }) => {
  const { data, isLoading, isError } = useLegalPageQuery(slug);

  return (
    <Section
      overline="Документы"
      title={data?.title ?? fallbackTitle}
      description={
        data ? `Редакция от ${formatDate(data.updated_at)}` : undefined
      }
    >
      {isLoading && <p className={classes.loading}>Загружаем документ…</p>}

      {isError && (
        <Notice tone="info" title="Документ готовится">
          Текст появится здесь после согласования. Пока вопросы по условиям
          можно задать в поддержке.
        </Notice>
      )}

      {data && <Prose text={data.body} className={classes.body} />}
    </Section>
  );
};
