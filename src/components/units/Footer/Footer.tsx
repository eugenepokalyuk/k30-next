'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import { Logo } from '@/components/ui';
import { useSiteSettings } from '@/lib/hooks';
import { CompanyLegalName, Routes, SupportEmail } from '@/utils/consts';

import classes from './Footer.module.scss';

/** Подвал. Клиентский компонент ради одного: адреса телеграма приезжают
 *  из админки, и менеджер меняет их сам — без пересборки статики. */
export const Footer: FC = () => {
  const { telegram_support_url, telegram_channel_url } = useSiteSettings();

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.brand}>
          <Logo />
          <p className={classes.about}>
            Подписки на зарубежные сервисы по ключу активации. Ключ приходит
            после оплаты, активация занимает пару минут.
          </p>
        </div>

        <div className={classes.column}>
          <p className={classes.heading}>Сайт</p>
          <Link className={classes.link} href={Routes.Services}>
            Сервисы
          </Link>
          <Link className={classes.link} href={Routes.How}>
            Как это работает
          </Link>
          <Link className={classes.link} href={Routes.Faq}>
            Вопросы
          </Link>
          <Link className={classes.link} href={Routes.Account}>
            Личный кабинет
          </Link>
        </div>

        <div className={classes.column}>
          <p className={classes.heading}>Поддержка</p>
          <a
            className={classes.link}
            href={telegram_support_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Телеграм
          </a>
          <a className={classes.link} href={`mailto:${SupportEmail}`}>
            {SupportEmail}
          </a>
          {/* Канал — только когда он заведён в админке: пункт «Канал»,
            ведущий на пустую страницу, хуже отсутствующего. */}
          {telegram_channel_url && (
            <a
              className={classes.link}
              href={telegram_channel_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Наш канал
            </a>
          )}
        </div>
      </div>

      <div className={classes.bottom}>
        <span>
          © {new Date().getFullYear()} {CompanyLegalName}
        </span>
        <span className={classes.disclaimer}>
          Мы не связаны с правообладателями сервисов и не являемся их
          официальным представителем.
        </span>
      </div>
    </footer>
  );
};
