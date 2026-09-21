'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import { Stagger, StaggerItem } from '@/components/motion';
import { ArrowRightIcon, Notice, Section, ServiceMark } from '@/components/ui';
import { useServicesQuery } from '@/store/api/k30Api';
import { buyPlansRoute } from '@/utils/consts';
import { formatPriceFrom } from '@/utils/helpers';

import classes from './ServicePicker.module.scss';

export const ServicePicker: FC = () => {
  const { data, isLoading, isError } = useServicesQuery();

  return (
    <Section
      overline="Покупка"
      title="Выберите сервис"
      description="Дальше останется выбрать тариф и оформить заказ"
    >
      {isError && (
        <Notice tone="error" title="Не получилось загрузить список">
          Обновите страницу или напишите в поддержку
        </Notice>
      )}

      <Stagger as="ul" className={classes.grid}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className={classes.skeleton} />
          ))}

        {data?.map((service) => {
          const priceFrom = formatPriceFrom(service.plans);

          return (
            <StaggerItem as="li" key={service.slug} className={classes.cell}>
              <Link
                href={buyPlansRoute(service.slug)}
                className={classes.card}
                style={
                  service.accent_color
                    ? ({
                        '--accent': service.accent_color,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <ServiceMark
                  logo={service.logo}
                  accentColor={service.accent_color}
                  size={44}
                />

                <span className={classes.text}>
                  <span className={classes.name}>{service.name}</span>
                  {service.tagline && (
                    <span className={classes.tagline}>{service.tagline}</span>
                  )}
                </span>

                <span className={classes.price}>
                  {service.in_stock ? (priceFrom ?? 'по запросу') : 'скоро'}
                </span>

                <ArrowRightIcon size={18} className={classes.arrow} />
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
};
