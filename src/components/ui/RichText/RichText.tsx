import React, { FC, Fragment } from 'react';

import { parseAccents } from '@/utils/helpers';

import classes from './RichText.module.scss';

interface Props {
  text: string;
}

export const RichText: FC<Props> = ({ text }) => (
  <>
    {parseAccents(text).map((part, index) =>
      part.isAccent ? (
        <strong key={index} className={classes.accent}>
          {part.text}
        </strong>
      ) : (
        <Fragment key={index}>{part.text}</Fragment>
      ),
    )}
  </>
);
