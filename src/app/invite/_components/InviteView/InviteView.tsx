'use client';

import React, { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { Reveal } from '@/components/motion';
import { BlockIcon, Button, Notice, Section, UserIcon } from '@/components/ui';
import { useAdvantagesQuery, useInviteQuery } from '@/store/api/k30Api';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthorized } from '@/store/slices/auth';
import { Routes } from '@/utils/consts';
import { balancedColumns, referralStorage } from '@/utils/helpers';

import classes from './InviteView.module.scss';

export const InviteView: FC = () => {
  const params = useSearchParams();
  const isAuthorized = useAppSelector(selectIsAuthorized);

  const [code, setCode] = React.useState('');

  React.useEffect(() => {
    setCode((params.get('ref') || referralStorage.read()).toUpperCase());
  }, [params]);

  const { data, isLoading } = useInviteQuery(code, { skip: !code });
  const { data: advantages } = useAdvantagesQuery();

  if (!code || isLoading) {
    return <Section overline="Приглашение" title="Загружаем…" />;
  }

  const inviter = data?.valid ? data.inviter : '';

  return (
    <Section
      overline={inviter ? 'Приглашение' : 'Добро пожаловать'}
      title={data?.title || 'Вас пригласили в K30 Market'}
      description={data?.text || undefined}
    >
      <div className={classes.layout}>
        {inviter && (
          <Reveal className={classes.inviter}>
            <span className={classes.avatar}>
              <UserIcon size={20} />
            </span>

            <span className={classes.inviter_text}>
              <span className={classes.inviter_name}>Вас пригласил {inviter}</span>

              <span className={classes.inviter_note}>
                Зарегистрируйтесь — приглашение засчитается автоматически
              </span>
            </span>
          </Reveal>
        )}

        {isAuthorized && (
          <Notice tone="info" title="Вы уже с нами">
            Приглашение засчитывается только при регистрации нового
            профиля, а вы уже зарегистрированы. Ссылка ни на что не повлияет,
            но сервисы и тарифы на месте
          </Notice>
        )}

        {!!advantages?.length && (
          <ul
            className={classes.grid}
            style={
              {
                '--cols': balancedColumns(advantages.length),
              } as React.CSSProperties
            }
          >
            {advantages.map((item, index) => (
              <Reveal
                as="li"
                key={item.id}
                className={classes.item}
                delay={Math.min(index * 0.06, 0.24)}
              >
                <span className={classes.icon}>
                  <BlockIcon name={item.icon} size={22} />
                </span>

                <div className={classes.text}>
                  <p className={classes.item_title}>{item.title}</p>
                  <p className={classes.item_description}>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        )}

        <div className={classes.actions}>
          {!isAuthorized && (
            <Button href={Routes.Login} size="large">
              Зарегистрироваться
            </Button>
          )}

          <Button href={Routes.Services} size="large" variant="outlined">
            Посмотреть сервисы
          </Button>
        </div>
      </div>
    </Section>
  );
};
