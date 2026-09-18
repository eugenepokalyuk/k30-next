'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import {
  ArrowRightIcon,
  Button,
  Notice,
  Section,
  ServiceMark,
} from '@/components/ui';
import { useServicesQuery } from '@/store/api/k30Api';
import { buyPlansRoute, Routes } from '@/utils/consts';
import { formatPrice, formatPriceFrom } from '@/utils/helpers';

import classes from './ServicesSection.module.scss';

export const ServicesSection: FC = () => {
  const { data, isLoading, isError } = useServicesQuery();

  const hasLogos = Boolean(data?.some((service) => service.logo));

  return (
    <Section
      id="services"
      overline="Можете приобрести"
      title="Сервисы"
      description="Ключ работает только со своим сервисом — он зашит в код и определяется автоматически."
      action={
        <Link className={classes.more} href={Routes.AllServices}>
          Ещё сервисы
          <ArrowRightIcon size={18} />
        </Link>
      }
    >
      {isError && (
        <Notice
          tone="error"
          title="Не получилось загрузить список"
          className={classes.notice}
        >
          Обновите страницу или напишите в поддержку — на активацию ключа это не
          влияет
        </Notice>
      )}

      <ul className={clsx(classes.grid, { [classes.with_logos]: hasLogos })}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className={classes.skeleton} />
          ))}

        <AnimatePresence>
          {data?.map((service, index) => {
            const priceFrom = formatPriceFrom(service.plans);

            return (
              <motion.li
                key={service.slug}
                className={classes.card}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: duration.base,
                  ease,
                  delay: Math.min(index * 0.06, 0.4),
                }}
                style={
                  service.accent_color
                    ? ({
                        '--accent': service.accent_color,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {/* Ссылкой служит вся карточка: один таб-стоп и клик в
                    любое место ведут к тарифам */}
                <Link
                  href={buyPlansRoute(service.slug)}
                  className={classes.opener}
                >
                  <span className={classes.opener_label}>
                    Выбрать тариф: {service.name}
                  </span>
                </Link>

                <div className={classes.head}>
                  <ServiceMark
                    logo={service.logo}
                    accentColor={service.accent_color}
                    size={hasLogos ? 48 : null}
                  />

                  <div className={classes.head_text}>
                    <div className={classes.title_row}>
                      <p className={classes.name}>{service.name}</p>
                      <p className={classes.price_from}>
                        {priceFrom ?? 'скоро'}
                      </p>
                    </div>

                    {service.tagline && (
                      <p className={classes.tagline}>{service.tagline}</p>
                    )}
                  </div>
                </div>

                <ul className={classes.plans}>
                  {service.plans.map((plan) => (
                    <li key={plan.slug} className={classes.plan}>
                      <span className={classes.plan_name}>{plan.name}</span>
                      {plan.in_stock ? (
                        <span className={classes.plan_price}>
                          {formatPrice(plan.price) ?? 'по запросу'}
                        </span>
                      ) : (
                        <span className={classes.stock_out}>{'скоро'}</span>
                      )}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="glow"
                  size="small"
                  className={classes.buy}
                  decorative
                >
                  {'Выбрать тариф'}
                  <ArrowRightIcon size={18} />
                </Button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Section>
  );
};
