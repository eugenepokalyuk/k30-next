'use client';

import React, { FC } from 'react';

import { Button, Notice, UserIcon } from '@/components/ui';
import type { AccountDto } from '@/store/api/types';

import classes from './TargetStep.module.scss';

interface Props {
  account: AccountDto | null;
  /** Поставщик проверять не умеет — тон и текст меняются целиком. */
  isUnchecked: boolean;
  note: string;
  isStarting: boolean;
  onConfirm: () => void;
}

/** Последний экран перед активацией: на какой аккаунт пойдёт подписка.
 *
 *  Единственное место, где покупателя ещё можно остановить — активацию
 *  не отменить. Отсюда и предупреждение о действующей подписке:
 *  поставщики обычно не начисляют поверх. */
export const AccountConfirmation: FC<Props> = ({
  account,
  isUnchecked,
  note,
  isStarting,
  onConfirm,
}) => (
  <div className={classes.account}>
    <Notice
      tone={isUnchecked ? 'info' : 'success'}
      title={
        isUnchecked
          ? 'Мы не можем проверить аккаунт заранее'
          : 'Аккаунт подтверждён'
      }
    >
      {isUnchecked ? (
        <>
          {account?.email ? (
            <>
              По данным видно аккаунт <strong>{account.email}</strong>.{' '}
            </>
          ) : null}
          Убедитесь, что указали данные именно того аккаунта, на который нужна
          подписка. После активации изменить или отменить её будет невозможно.
        </>
      ) : (
        <>
          Подписка будет оформлена на <strong>{account?.email}</strong>. Если
          это не тот аккаунт, измените данные выше.
        </>
      )}
    </Notice>

    {Boolean(account?.subscriptions?.length) && (
      <Notice tone="info" title="На аккаунте уже есть подписка">
        <ul className={classes.subscriptions}>
          {account?.subscriptions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        Поверх действующей подписки она обычно не начисляется — проверьте, точно
        ли нужен этот аккаунт.
      </Notice>
    )}

    {note && <p className={classes.note}>{note}</p>}

    <div className={classes.actions}>
      {account?.email && (
        <span className={classes.user}>
          <UserIcon size={18} />
          {account.email}
        </span>
      )}
      <Button
        type="button"
        size="large"
        onClick={onConfirm}
        loading={isStarting}
      >
        Подтвердить и активировать
      </Button>
    </div>
  </div>
);
