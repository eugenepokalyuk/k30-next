'use client';

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Button, KeyCode, Modal, Notice } from '@/components/ui';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import type { ActivationDto, ServiceActivationDto } from '@/store/api/types';
import { Routes, SupportTelegram } from '@/utils/consts';
import { parseInstruction } from '@/utils/helpers';

import classes from './ResultStep.module.scss';

interface Props {
  activation: ActivationDto;
  /** Нужен только на экране успеха: памятка «подписки нет» своя у
   *  каждого сервиса. На прямой ссылке его может не оказаться. */
  service?: ServiceActivationDto;
  onRetry: () => void;
}

/** Чем всё кончилось.
 *
 *  Тон и предлагаемое действие выбираются по полю `blame` с бэкенда, а
 *  не по тексту ошибки. Кнопку «Повторить» показываем только когда
 *  бэкенд разрешил (`can_retry`): у одного из поставщиков карта после
 *  неудачи заморожена до ручной сверки, и вторая попытка либо вернёт ту
 *  же ошибку, либо будет стоить второй карты.
 */
export const ResultStep: FC<Props> = ({ activation, service, onRetry }) => {
  if (activation.status === 'success') {
    return (
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
          {activation.message || ''}
          {/* Когда у сервиса заведена памятка, тот же совет лежит в ней —
              и там он подробнее, чем одна строка. */}
          {service?.missing_subscription_help
            ? ''
            : ' Если сервис ещё не видит подписку — выйдите из аккаунта и зайдите снова.'}
        </Notice>

        {activation.activation_url && (
          <Button href={activation.activation_url} external size="large">
            Открыть ссылку активации
          </Button>
        )}

        <SuccessExtras service={service} />

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

  // «Разбираем вручную» — не провал: карта у поставщика заморожена, и
  // «попробуйте ещё раз» здесь стоило бы второй карты.
  if (activation.status === 'review') {
    return (
      <div className={classes.result}>
        <Notice tone="info" title="Проверяем вручную">
          {activation.error ||
            'Активация не дала однозначного результата, и мы перепроверяем её.'}{' '}
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
          Ключ не потрачен. Это временная заминка — попробуйте через несколько
          минут.
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

/** Что предлагаем покупателю сразу после выдачи.
 *
 *  Просьбы об отзыве и подписке стоят до кнопок «Мои заказы» и «На
 *  главную» намеренно: после них покупатель уходит со страницы, и
 *  просить уже некого. Каждый блок исчезает вместе со своей ссылкой —
 *  пустых кнопок здесь быть не должно.
 */
const SuccessExtras: FC<{ service?: ServiceActivationDto }> = ({ service }) => {
  const settings = useSiteSettings();
  const [isHelpOpen, setHelpOpen] = useState(false);

  const help = service?.missing_subscription_help ?? '';

  return (
    <>
      {settings.review_yandex_market_url && (
        <div className={classes.offer}>
          <p className={classes.offer_text}>
            Будем очень признательны, если вы оставите отзыв на Яндекс Маркете.
            Заранее благодарим за обратную связь!
          </p>
          <Button
            href={settings.review_yandex_market_url}
            external
            variant="outlined"
            size="small"
          >
            Оставить отзыв
          </Button>
        </div>
      )}

      {settings.telegram_channel_url && (
        <div className={classes.offer}>
          <p className={classes.offer_text}>
            Будьте в курсе новостей, акций и обновлений сервиса.
          </p>
          <Button
            href={settings.telegram_channel_url}
            external
            variant="outlined"
            size="small"
          >
            Подписаться на Telegram
          </Button>
        </div>
      )}

      {help && (
        <>
          <button
            type="button"
            className={classes.help_link}
            onClick={() => setHelpOpen(true)}
          >
            Ключ активирован, но подписки нет
          </button>

          <Modal
            isOpen={isHelpOpen}
            title="Ключ активирован, но подписки нет"
            onClose={() => setHelpOpen(false)}
          >
            <h2 className={classes.help_title}>
              Ключ активирован, но подписки нет
            </h2>

            <div className={classes.help_body}>
              {parseInstruction(help).map((block, index) =>
                block.type === 'list' ? (
                  <ul key={index} className={classes.help_list}>
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={index}>{block.text}</p>
                ),
              )}
            </div>

            <div className={classes.actions}>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={() => setHelpOpen(false)}
              >
                Понятно
              </Button>
              <Button
                href={SupportTelegram}
                external
                variant="ghost"
                size="small"
              >
                Написать в поддержку
              </Button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

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
