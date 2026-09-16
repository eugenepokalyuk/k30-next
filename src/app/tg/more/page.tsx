import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ArrowRightIcon, Section, ShieldIcon } from '@/components/ui';
import { Routes } from '@/utils/consts';

import classes from './page.module.scss';

export const metadata: Metadata = {
  title: 'Ещё',
  robots: { index: false, follow: false },
};

const documents = [
  { href: Routes.Terms, title: 'Пользовательское соглашение' },
  { href: Routes.Privacy, title: 'Политика конфиденциальности' },
];

export default function MorePage() {
  return (
    <Section overline="Ещё" title="Документы">
      <ul className={classes.list}>
        {documents.map((document) => (
          <li key={document.href}>
            <Link href={document.href} className={classes.item}>
              <span className={classes.icon}>
                <ShieldIcon size={20} />
              </span>
              <span className={classes.title}>{document.title}</span>
              <ArrowRightIcon size={18} className={classes.arrow} />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
