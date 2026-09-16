'use client';

import React, { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Stagger, StaggerItem } from '@/components/motion';
import {
  Button,
  CheckIcon,
  Notice,
  RefreshIcon,
  Section,
  ServiceMark,
} from '@/components/ui';
import { useServicesQuery } from '@/store/api/k30Api';
import type { PlanDto, ServiceDto } from '@/store/api/types';
import { useAppDispatch } from '@/store/hooks';
import { planChosen } from '@/store/slices/cart';
import { checkoutRoute, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import classes from './PlanPicker.module.scss';

const formatDuration = (days: number) => {
  if (days % 365 === 0) {
    const years = days / 365;
    return years === 1 ? '1 год' : `${years} года`;
  }
  if (days % 30 === 0) {
    const months = days / 30;
    return months === 1 ? '1 месяц' : `${months} мес.`;
  }
  return `${days} дн.`;
};

const PlanCard: FC<{ service: ServiceDto; plan: PlanDto }> = ({
  service,
  plan,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const price = formatPrice(plan.price);

  const buy = () => {
    dispatch(planChosen({ service: service.slug, plan: plan.slug }));
    router.push(checkoutRoute(service.slug, plan.slug));
  };

  return (
    <StaggerItem
      as="li"
      className={classes.cell}
      style={
        service.accent_color
          ? ({ '--accent': service.accent_color } as React.CSSProperties)
          : undefined
      }
    >
      <article className={classes.card}>
        <header className={classes.head}>
          <ServiceMark
            logo={service.logo}
            accentColor={service.accent_color}
            size={40}
          />

          <div className={classes.head_text}>
            <h3 className={classes.name}>{plan.name}</h3>
            {plan.tagline && (
              <p className={classes.tagline}>{plan.tagline}</p>
            )}
          </div>
        </header>

        <ul className={classes.facts}>
          <li className={classes.fact}>
            <RefreshIcon size={16} />
            Подписка на {formatDuration(plan.duration_days)}
          </li>
          <li className={classes.fact}>
            <CheckIcon size={16} />
            {service.name} на ваш аккаунт
          </li>
        </ul>

        <footer className={classes.foot}>
          <div className={classes.price_row}>
            <span className={classes.price}>{price ?? 'по запросу'}</span>
            <span
              className={plan.in_stock ? classes.in_stock : classes.out_stock}
            >
              {plan.in_stock ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>

          <Button onClick={buy} fullWidth disabled={!plan.in_stock}>
            {plan.in_stock ? 'Купить' : 'Пока недоступно'}
          </Button>
        </footer>
      </article>
    </StaggerItem>
  );
};

export const PlanPicker: FC = () => {
  const slug = useSearchParams().get('service') ?? '';
  const { data, isLoading, isError } = useServicesQuery();

  const service = data?.find((item) => item.slug === slug);

  if (isLoading) {
    return (
      <Section overline="Покупка" title="Загружаем тарифы…">
        <ul className={classes.grid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className={classes.skeleton} />
          ))}
        </ul>
      </Section>
    );
  }

  if (isError || !service) {
    return (
      <Section overline="Покупка" title="Сервис не найден" centered>
        <Notice tone="error" title="Такого сервиса нет в продаже">
          Возможно, его сняли с витрины. Выберите другой в списке.
        </Notice>
        <div className={classes.actions}>
          <Button href={Routes.Buy} variant="outlined">
            Вернуться к сервисам
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section
      overline={service.name}
      title="Выберите тариф"
      description={service.tagline || undefined}
    >
      <Stagger as="ul" className={classes.grid}>
        {service.plans.map((plan) => (
          <PlanCard key={plan.slug} service={service} plan={plan} />
        ))}
      </Stagger>
    </Section>
  );
};
