'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Button, KeyCode, Notice } from '@/components/ui';
import type { ActivationDto } from '@/store/api/types';
import { Routes, SupportTelegram } from '@/utils/consts';

import classes from './ResultStep.module.scss';

interface Props {
  activation: ActivationDto;
  onRetry: () => void;
}

/** Чем всё кончилось.
 *
 *  Тон и предлагаемое действие выбираются по полю `blame`, а не по тексту
 *  ошибки. Это принципиально: причина «вы вставили данные не из того
 *  аккаунта» и причина «у поставщика кончились подписки» требуют от
 *  покупателя совершенно разного, а выглядели бы одинаково красным
 *  прямоугольником со словом «ошибка».
 *
 *  Кнопку «Повторить» показываем только когда бэкенд разрешил
 *  (`can_retry`). Повтор бывает вреден: у одного из поставщиков карта
 *  после неудачи заморожена до ручной сверки, и вторая попытка либо
 *  вернёт ту же ошибку, либо будет стоить второй карты.
 */
export const ResultStep: FC<Props> = ({ activation, onRetry }) => {
  if (activation.status === 'success') {
    return (
      // Единственный экран, где что-то заканчивается удачей, — и
      // единственный, где анимация появления уместна крупнее обычной:
      // покупатель ждал результата от поставщика.
      <motion.div
        className={classes.result}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease }}
      >
        <Notice tone="success" title="Подписка активирована">
          {activation.account_email
            ? `Аккаунт: ${activation.account_email}. `
            : ''}
          {activation.message || ''} Если сервис ещё не видит подписку —
          выйдите из аккаунта и зайдите снова.
        </Notice>

        {activation.activation_url && (
          <Button href={activation.activation_url} external size="large">
            Открыть ссылку активации
          </Button>
        )}

        <div className={classes.actions}>
          <Button href={Routes.Account} variant="outlined" size="small">
            Мои заказы
          </Button>
          <Button href={Routes.Home} variant="ghost" size="small">
            На главную
          </Button>
        </div>
      </motion.div>
    );
  }

  if (activation.status === 'cancelled') {
    return (
      <div className={classes.result}>
        <Notice tone="info" title="Активация отменена">
          Ключ не потрачен — можно активировать заново.
        </Notice>
        <Button type="button" size="large" onClick={onRetry}>
          Активировать заново
        </Button>
      </div>
    );
  }

  // «Разбираем вручную» — не провал. Карта у поставщика заморожена, и
  // предлагать «попробуйте ещё раз» здесь значило бы предложить
  // потратить вторую.
  if (activation.status === 'review') {
    return (
      <div className={classes.result}>
        <Notice tone="info" title="Проверяем вручную">
          {activation.error ||
            'Поставщик не дал однозначного ответа, и мы перепроверяем заказ.'}{' '}
          Ключ закреплён за вами — повторять активацию не нужно.
        </Notice>
        <Support code={activation.key.code} />
      </div>
    );
  }

  const isCustomerFault = activation.blame === 'customer';

  return (
    <div className={classes.result}>
      <Notice
        tone={isCustomerFault ? 'info' : 'error'}
        title={
          isCustomerFault ? 'Проверьте данные аккаунта' : 'Активация не прошла'
        }
      >
        {activation.error || 'Напишите в поддержку — разберёмся и активируем.'}
      </Notice>

      {activation.blame === 'provider' && (
        <p className={classes.hint}>
          Ключ не потрачен. Это временно на стороне поставщика — попробуйте
          через несколько минут.
        </p>
      )}

      {activation.blame === 'shop' && (
        <p className={classes.hint}>
          Это на нашей стороне, и мы уже видим ошибку в журнале. Быстрее всего
          решается через поддержку — активируем вручную.
        </p>
      )}

      {activation.can_retry && (
        <Button type="button" size="large" onClick={onRetry}>
          Попробовать ещё раз
        </Button>
      )}

      <Support code={activation.key.code} />
    </div>
  );
};

/** Обращение в поддержку с кодом ключа под рукой.
 *
 *  Код показываем прямо здесь: первое, что спрашивает поддержка, и
 *  первое, что покупатель в этот момент не помнит.
 */
const Support: FC<{ code: string }> = ({ code }) => (
  <div className={classes.support}>
    <p className={classes.support_text}>
      Приложите к обращению код ключа — по нему видно всю историю попыток.
    </p>
    <KeyCode code={code} className={classes.support_code} />
    <Button href={SupportTelegram} external variant="outlined" size="small">
      Написать в поддержку
    </Button>
  </div>
);
