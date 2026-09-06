'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { duration, ease } from '@/components/motion';
import { Notice, Section } from '@/components/ui';
import { useServicesQuery } from '@/store/api/k30Api';
import type { ServiceDto } from '@/store/api/types';
import { formatPrice, formatPriceFrom } from '@/utils/helpers';

import classes from './ServicesSection.module.scss';
import { ServiceModal } from './ServiceModal';

/** Список сервисов из админки: захардкоженный разъедется с продажами */
export const ServicesSection: FC = () => {
  const { data, isLoading, isError } = useServicesQuery();

  const [opened, setOpened] = useState<ServiceDto | null>(null);

  // Слот под логотип одинаковый у всех карточек ряда, иначе название на
  // карточке с картинкой уезжает вниз. Логотипов нет ни у кого — не резервируем
  const hasLogos = Boolean(data?.some((service) => service.logo));

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
                <button
                  type="button"
                  className={classes.opener}
                  onClick={() => setOpened(service)}
                >
                  <span className={classes.opener_label}>
                    Тарифы и цены: {service.name}
                  </span>
                </button>

                <div className={classes.head}>
                  <span className={classes.mark}>
                    {service.logo ? (
                      <Image
                        src={service.logo}
                        alt=""
                        width={48}
                        height={48}
                        className={classes.logo}
                      />
                    ) : (
                      <span className={classes.dot} />
                    )}
                  </span>

                  <div className={classes.head_text}>
                    <p className={classes.name}>{service.name}</p>

                    {priceFrom && (
                      <p className={classes.price_from}>{priceFrom}</p>
                    )}
                  </div>
                </div>
                {service.tagline && (
                  <p className={classes.tagline}>{service.tagline}</p>
                )}

                {/* Наличие флагом, а не числом: по остатку видны обороты */}
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

      <ServiceModal service={opened} onClose={() => setOpened(null)} />
    </Section>
  );
};
