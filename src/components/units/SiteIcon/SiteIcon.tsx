'use client';

import React, { FC } from 'react';

import { useSiteSettings } from '@/lib/hooks';

export const SiteIcon: FC = () => {
  const { logo } = useSiteSettings();

  React.useEffect(() => {
    if (!logo) return;

    document
      .querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"], link[rel="shortcut icon"]',
      )
      .forEach((link) => {
        link.href = logo;
        link.removeAttribute('type');
        link.removeAttribute('sizes');
      });
  }, [logo]);

  return null;
};
