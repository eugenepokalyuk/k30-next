import React, { FC } from 'react';

import { Button } from '@/components/ui';
import { parseInstruction } from '@/utils/helpers';

import classes from './Instruction.module.scss';

interface Props {
  text: string;
  /** Название сервиса — подпись первой кнопки: «Открыть ChatGPT». */
  serviceName: string;
  /** Сайт сервиса: туда покупатель идёт войти в нужный аккаунт. */
  serviceUrl?: string;
  url?: string;
  urlLabel?: string;
}

/** Инструкция сервиса. Текст приезжает из админки уже с подставленным
 *  кодом ключа — здесь только разметка блоков.
 *
 *  Кнопок две, и порядок в них тот же, что в инструкции: сначала войти
 *  в аккаунт на сайте сервиса, потом открыть страницу, откуда берётся
 *  токен или ID. Читать инструкцию и искать адрес руками не нужно —
 *  именно на этом шаге теряется больше всего покупателей.
 */
export const Instruction: FC<Props> = ({
  text,
  serviceName,
  serviceUrl,
  url,
  urlLabel,
}) => {
  const blocks = parseInstruction(text);

  // Вторая кнопка нужна, только если ведёт не туда же, куда первая:
  // у сервиса без отдельной страницы с данными обе указывали бы на сайт.
  const showSource = Boolean(serviceUrl);
  const showHowTo = Boolean(url) && url !== serviceUrl;

  if (!blocks.length && !showSource && !showHowTo) return null;

  return (
    <div className={classes.instruction}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className={classes.list}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className={classes.item}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p key={index} className={classes.paragraph}>
            {block.text}
          </p>
        ),
      )}

      {(showSource || showHowTo) && (
        <div className={classes.actions}>
          {showSource && (
            <Button href={serviceUrl} external variant="outlined" size="small">
              Открыть {serviceName}
            </Button>
          )}

          {showHowTo && (
            <Button href={url} external variant="outlined" size="small">
              {urlLabel || 'Получить токен'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
