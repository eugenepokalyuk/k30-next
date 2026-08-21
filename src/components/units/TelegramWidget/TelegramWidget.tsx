'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { TelegramIcon } from '@/components/ui';
import { useSiteSettings } from '@/lib/hooks';

import classes from './TelegramWidget.module.scss';

/** Круглая кнопка телеграм-канала в углу страницы.
 *
 *  И ссылка, и сам факт показа приезжают из админки: менеджер убирает
 *  кнопку галкой, не стирая адрес, — на время, пока канал переезжает
 *  или не наполнен. Поэтому здесь нет ни одного зашитого адреса: нет
 *  настроек — нет кнопки.
 */
export const TelegramWidget: FC = () => {
  const { widget_is_enabled, telegram_channel_url } = useSiteSettings();

  if (!widget_is_enabled || !telegram_channel_url) return null;

  return (
    <motion.a
      className={classes.widget}
      href={telegram_channel_url}
      target="_blank"
      rel="noopener noreferrer"
      // Появляется с задержкой: кнопка, выехавшая одновременно с первым
      // экраном, читается как всплывающая реклама.
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      <TelegramIcon size={24} className={classes.icon} />
      {/* Подпись видна только скринридеру: рядом с иконкой она бы
          растянула кнопку на треть экрана телефона. */}
      <span className={classes.label}>Телеграм-канал К30</span>
    </motion.a>
  );
};
