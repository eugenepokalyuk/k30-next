'use client';

import React, { FC } from 'react';

import { useIconsQuery } from '@/store/api/k30Api';

import { getBlockIcon,hasBlockIcon } from './blockIcons';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export const BlockIcon: FC<Props> = ({ name, size = 20, className }) => {
  const isBuiltIn = hasBlockIcon(name);
  const { custom } = useIconsQuery(undefined, {
    skip: isBuiltIn,
    selectFromResult: ({ data }) => ({
      custom: data?.find((icon) => icon.key === name),
    }),
  });

  if (!isBuiltIn && custom) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={custom.view_box}
        fill="currentColor"
        aria-hidden
        focusable={false}
        className={className}
        dangerouslySetInnerHTML={{ __html: custom.body }}
      />
    );
  }

  return React.createElement(getBlockIcon(name), { size, className });
};
