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

/** Последний экран перед активацией: на какой аккаунт уедет подписка.
 *
 *  Это единственное место, где покупателя ещё можно остановить.
 *  Активацию не отменить, поэтому здесь и предупреждение о действующей
 *  подписке (поставщики обычно не начисляют поверх), и явно показанная
 *  почта рядом с кнопкой.
 */
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
      title={isUnchecked ? 'Проверьте аккаунт сами' : 'Аккаунт подтверждён'}
    >
      {isUnchecked ? (
        <>
          Этот поставщик не умеет проверять аккаунт заранее.
          {account?.email ? (
            <>
              {' '}
              По данным видно аккаунт <strong>{account.email}</strong>.
            </>
          ) : null}{' '}
          Убедитесь, что данные из того аккаунта, куда нужна подписка, — после
          активации это уже не отменить.
        </>
      ) : (
        <>
          Подписка уедет на <strong>{account?.email}</strong>. Если это не тот
          аккаунт — измените данные выше.
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
        Поставщики обычно не начисляют поверх действующей подписки — проверьте,
        точно ли нужен этот аккаунт.
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
      <Button type="button" size="large" onClick={onConfirm} loading={isStarting}>
        Подтвердить и активировать
      </Button>
    </div>
  </div>
);
