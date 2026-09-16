'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { openExternal } from '@/lib/telegram';
import { useInformersQuery } from '@/store/api/k30Api';
import type { InformerDto } from '@/store/api/types';

import classes from './InformerSlider.module.scss';

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const Slide: FC<{ informer: InformerDto }> = ({ informer }) => {
  const picture = (
    <Image
      className={classes.image}
      src={informer.image}
      alt={informer.title}
      fill
      sizes="(max-width: 720px) 100vw, 720px"
      priority
    />
  );

  if (!informer.url) {
    return <li className={classes.slide}>{picture}</li>;
  }

  if (isExternal(informer.url)) {
    return (
      <li className={classes.slide}>
        <button
          type="button"
          className={classes.opener}
          onClick={() => openExternal(informer.url)}
        >
          <span className={classes.opener_label}>
            {informer.title || 'Открыть'}
          </span>
        </button>
        {picture}
      </li>
    );
  }

  return (
    <li className={classes.slide}>
      <a className={classes.opener} href={informer.url}>
        <span className={classes.opener_label}>
          {informer.title || 'Открыть'}
        </span>
      </a>
      {picture}
    </li>
  );
};

export const InformerSlider: FC = () => {
  const { data } = useInformersQuery();

  const [current, setCurrent] = React.useState(0);
  const trackRef = React.useRef<HTMLUListElement>(null);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const width = track.clientWidth || 1;
    setCurrent(Math.round(track.scrollLeft / width));
  };

  if (!data?.length) return null;

  return (
    <section className={classes.section} aria-label="Объявления">
      <div className={classes.container}>
        <ul className={classes.track} ref={trackRef} onScroll={onScroll}>
          {data.map((informer) => (
            <Slide key={informer.id} informer={informer} />
          ))}
        </ul>

        {data.length > 1 && (
          <div className={classes.dots} aria-hidden>
            {data.map((informer, index) => (
              <span
                key={informer.id}
                className={clsx(classes.dot, {
                  [classes.dot_active]: index === current,
                })}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
