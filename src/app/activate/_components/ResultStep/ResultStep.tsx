'use client';

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import {
  Button,
  CartIcon,
  HomeIcon,
  KeyCode,
  Modal,
  Notice,
  RichText,
  SuccessMark,
} from '@/components/ui';
import { useHomeRoute } from '@/lib/hooks';
import type { ActivationDto, ServiceActivationDto } from '@/store/api/types';
import { Routes, SupportTelegram } from '@/utils/consts';
import { maskEmail, parseInstruction } from '@/utils/helpers';

import classes from './ResultStep.module.scss';
import { SuccessPromo } from '../SuccessPromo/SuccessPromo';

interface Props {
  activation: ActivationDto;
  service?: ServiceActivationDto;
  onRetry: () => void;
}

export const ResultStep: FC<Props> = ({ activation, service, onRetry }) => {
  const home = useHomeRoute();
  if (activation.status === 'success') {
    const account = accountLine(activation);

    return (
      <motion.div
        className={classes.result}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease }}
      >
        <div className={classes.done}>
          <div className={classes.done_head}>
            <SuccessMark />

            <div className={classes.done_text}>
              <h2 className={classes.done_title}>Подписка активирована</h2>

              {account ? (
                <p className={classes.done_account}>
                  {account.label}: <strong>{account.value}</strong>
                </p>
              ) : (
                <p className={classes.done_account}>
                  Если сервис ещё не видит подписку — выйдите из аккаунта и
                  зайдите снова.
                </p>
              )}
            </div>
          </div>

          <MissingHelp service={service} />
        </div>

        {activation.activation_url && (
          <Button href={activation.activation_url} external size="large">
            {'Открыть ссылку активации'}
          </Button>
        )}

        <SuccessPromo />

        <div className={classes.actions_centered}>
          <Button href={Routes.Account} color="primary" size="small">
            <CartIcon size={18} />
            {'Мои заказы'}
          </Button>

          <Button href={home} color="default" size="small">
            <HomeIcon size={18} />
            {'На главную'}
          </Button>
        </div>
      </motion.div>
    );
  }

  if (activation.status === 'cancelled') {
    return (
      <div className={classes.result}>
        <Notice tone="info" title="Активация отменена">
          {'Ключ не потрачен — можно активировать заново'}
        </Notice>

        <Button type="button" size="large" onClick={onRetry}>
          {'Активировать заново'}
        </Button>
      </div>
    );
  }

  if (activation.status === 'review') {
    return (
      <div className={classes.result}>
        <Notice tone="info" title="Проверяем вручную">
          {activation.error || 'Активация не дала однозначного результата, и мы перепроверяем её.'}{' '}
          {'Ключ закреплён за вами — повторять активацию не нужно.'}
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
          {'Ключ не потрачен. Это временная заминка — попробуйте через несколько минут'}
        </p>
      )}

      {activation.blame === 'shop' && (
        <p className={classes.hint}>
          {'Это на нашей стороне, и мы уже видим ошибку в журнале. Быстрее всего решается через поддержку — активируем вручную'}
        </p>
      )}

      {activation.can_retry && (
        <Button type="button" size="large" onClick={onRetry}>
          {'Попробовать ещё раз'}
        </Button>
      )}

      <Support code={activation.key.code} />
    </div>
  );
};

const MissingHelp: FC<{ service?: ServiceActivationDto }> = ({ service }) => {
  const [isHelpOpen, setHelpOpen] = useState(false);

  const help = service?.missing_subscription_help ?? '';
  if (!help) return null;

  return (
    <>
      <button
        type="button"
        className={classes.help_card}
        onClick={() => setHelpOpen(true)}
      >
        <span className={classes.help_card_title}>
          {'Ключ активировался, а подписки нет?'}
        </span>

        <span className={classes.help_card_hint}>{'Что делать — здесь'}</span>
      </button>

      <Modal
        isOpen={isHelpOpen}
        title="Ключ активирован, но подписки нет"
        onClose={() => setHelpOpen(false)}
      >
        <h2 className={classes.help_title}>
          {'Ключ активирован, но подписки нет'}
        </h2>

        <div className={classes.help_body}>
          {parseInstruction(help).map((block, index) =>
            block.type === 'list' ? (
              <ul key={index} className={classes.help_list}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p key={index}>
                <RichText text={block.text} />
              </p>
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
            {'Понятно'}
          </Button>

          <Button href={SupportTelegram} external variant="ghost" size="small">
            {'Написать в поддержку'}
          </Button>
        </div>
      </Modal>
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

/**
 *  Чем подписан выданный аккаунт.
 *
 *  Первым — идентификатор: почта на экране всё равно замазана
 *  (`b***r@example.com`), и «мой ли это аккаунт» по ней не понять, а у
 *  Claude и Grok её нет вовсе. Дальше почта и, если и её нет, то
 *  замаскированный остаток введённого — по нему хотя бы отличают одну
 *  попытку от другой
 */
function accountLine(
  activation: ActivationDto,
): { label: string; value: string } | null {
  const id = (activation.account_id || '').trim();
  const email = (activation.account_email || '').trim();
  const hint = (activation.target_hint || '').trim();

  if (id) return { label: 'ID аккаунта', value: id };
  if (email) return { label: 'Почта аккаунта', value: maskEmail(email) };
  return hint ? { label: 'Аккаунт', value: hint } : null;
}
