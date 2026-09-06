'use client';

import React, { FC } from 'react';
import Image from 'next/image';

import { Button, Modal } from '@/components/ui';
import type { ServiceDto } from '@/store/api/types';
import { formatPrice } from '@/utils/helpers';

import classes from './ServiceModal.module.scss';

interface Props {
  /** Сервис, по карточке которого щёлкнули. `null` — окно закрыто */
  service: ServiceDto | null;
  onClose: () => void;
}

/** Русское склонение по числу: 1 месяц, 2 месяца, 5 месяцев */
const plural = (count: number, forms: [string, string, string]): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
};

/** Срок тарифа на человеческом языке: в базе он лежит днями */
const formatDuration = (days: number): string | null => {
  if (!days) return null;

  if (days % 365 === 0) {
    const years = days / 365;
    return `${years} ${plural(years, ['год', 'года', 'лет'])}`;
  }

  const months = Math.round(days / 30);
  if (months < 1) return `${days} ${plural(days, ['день', 'дня', 'дней'])}`;

  return `${months} ${plural(months, ['месяц', 'месяца', 'месяцев'])}`;
};

/**
 *  Ознакомительное окно с полным списком тарифов: на карточке видна
 *  только вилка «от N ₽». Кнопки покупки нет намеренно — заказ идёт
 *  через блок «Купить ключ»
 */
export const ServiceModal: FC<Props> = ({ service, onClose }) => (
  <Modal
    isOpen={Boolean(service)}
    title={service ? `Тарифы ${service.name}` : ''}
    onClose={onClose}
  >
    {/* Только при открытом окне: закрытый <dialog> остаётся в разметке и
        держал бы тарифы прошлого сервиса */}
    {service && (
      <>
        <div className={classes.head}>
          {service.logo ? (
            <Image
              src={service.logo}
              alt=""
              width={48}
              height={48}
              className={classes.logo}
            />
          ) : (
            <span
              className={classes.dot}
              style={
                service.accent_color
                  ? ({
                      '--accent': service.accent_color,
                    } as React.CSSProperties)
                  : undefined
              }
            />
          )}

          <div className={classes.head_text}>
            <h2 className={classes.title}>{service.name}</h2>
            {service.tagline && (
              <p className={classes.tagline}>{service.tagline}</p>
            )}
          </div>
        </div>

        <ul className={classes.plans}>
          {service.plans.map((plan) => {
            const duration = formatDuration(plan.duration_days);

            return (
              <li key={plan.slug} className={classes.plan}>
                <div className={classes.plan_text}>
                  <p className={classes.plan_name}>{plan.name}</p>
                  {plan.tagline && (
                    <p className={classes.plan_tagline}>{plan.tagline}</p>
                  )}
                  {duration && (
                    <p className={classes.plan_duration}>{duration}</p>
                  )}
                </div>

                {/* Наличие флагом, а не числом: по остатку видны обороты */}
                {plan.in_stock ? (
                  <p className={classes.plan_price}>
                    {formatPrice(plan.price) ?? 'по запросу'}
                  </p>
                ) : (
                  <p className={classes.stock_out}>скоро</p>
                )}
              </li>
            );
          })}
        </ul>

        <div className={classes.actions}>
          <Button variant="outlined" size="small" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </>
    )}
  </Modal>
);
