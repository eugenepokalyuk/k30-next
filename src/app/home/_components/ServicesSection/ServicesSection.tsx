'use client';

import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Notice, Section } from '@/components/ui';
import { useServicesQuery } from '@/store/api/k30Api';
import { formatPrice, formatPriceFrom } from '@/utils/helpers';

import classes from './ServicesSection.module.scss';

/** Список сервисов приходит с бэкенда: их заводит менеджер в админке,
 *  и захардкоженный список разъезжался бы с тем, что реально в продаже. */
export const ServicesSection: FC = () => {
  const { data, isLoading, isError } = useServicesQuery();

  return (
    <Section
      id="services"
      overline="Что активируем"
      title="Сервисы"
      description="Ключ работает только со своим сервисом — он зашит в код и определяется автоматически."
    >
      {isError && (
        <Notice
          tone="error"
          title="Не получилось загрузить список"
          className={classes.notice}
        >
          Обновите страницу или напишите в поддержку — на активацию ключа это не
          влияет.
        </Notice>
      )}

      <ul className={classes.grid}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className={classes.skeleton} />
          ))}

        {/* Карточки появляются уже после ответа сервера, поэтому
            задержка считается от индекса, а не вариантами родителя:
            на момент его появления детей ещё нет. */}
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
                <div className={classes.head}>
                  <p className={classes.name}>
                    <span className={classes.dot} />
                    {service.name}
                  </p>
                  {priceFrom && (
                    <p className={classes.price_from}>{priceFrom}</p>
                  )}
                </div>
                {service.tagline && (
                  <p className={classes.tagline}>{service.tagline}</p>
                )}

                {/* Наличие приходит флагом, а не числом: точный остаток
                  бэкенд не отдаёт — по нему видны обороты. */}
                <ul className={classes.plans}>
                  {service.plans.map((plan) => (
                    <li key={plan.slug} className={classes.plan}>
                      <span className={classes.plan_name}>{plan.name}</span>
                      {plan.in_stock ? (
                        <span className={classes.plan_price}>
                          {formatPrice(plan.price) ?? 'по запросу'}
                        </span>
                      ) : (
                        <span className={classes.stock_out}>скоро</span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Section>
  );
};
