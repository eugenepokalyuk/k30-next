'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Reveal } from '@/components/motion';
import {
  Button,
  getBlockIcon,
  KeyCode,
  Notice,
  Prose,
  Section,
  ServiceMark,
  SuccessMark,
} from '@/components/ui';
import { TelegramEmailForm } from '@/components/units';
import {
  useCheckoutQuery,
  useCreateOrderMutation,
  useMyOrderQuery,
} from '@/store/api/k30Api';
import type { OrderDto } from '@/store/api/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthorized, selectIsAuthReady } from '@/store/slices/auth';
import { cartCleared, planChosen, selectCartItem } from '@/store/slices/cart';
import { selectIsMiniApp, selectWebAppAuth } from '@/store/slices/telegram';
import { activateRoute, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import classes from './CheckoutView.module.scss';

/** Пока ключа нет, перечитываем заказ: он появится, когда пройдёт оплата */
const POLL_MS = 5000;

/**
 *  Что видно после оформления.
 *
 *  Три состояния, и различает их сам заказ, а не наши догадки: ключ уже
 *  выдан, оплата прошла и ключ готовят, оплата ещё не подтвердилась.
 *  Первое — то, ради чего покупатель сюда шёл, поэтому код показывается
 *  крупно и с кнопкой активации, а не строкой «напишите менеджеру»
 */
const Done: FC<{ order: OrderDto }> = ({ order: created }) => {
  // Заказ заводится без ключа: до оплаты ключ со склада не снимается.
  // Опрос прекращаем, как только ключ приехал — держать его дальше
  // значит будить сервер ради заказа, который уже закрыт
  const { data } = useMyOrderQuery(created.number, {
    skip: Boolean(created.key_code),
    pollingInterval: POLL_MS,
  });

  const order = data ?? created;
  const price = formatPrice(order.price);
  const summary = `${order.service} ${order.plan}${price ? ` — ${price}` : ''}`;

  if (order.key_code) {
    return (
      <Section overline="Оплачено" title="Ключ активации" centered>
        <div className={classes.done}>
          <SuccessMark />

          <p className={classes.done_text}>
            {summary}. Ключ ваш — сохраните код, он понадобится при активации и
            останется в кабинете.
          </p>

          <KeyCode code={order.key_code} className={classes.done_key} />

          <div className={classes.done_actions}>
            <Button href={activateRoute(order.key_code)} size="large">
              Активировать подписку
            </Button>
            <Button href={Routes.Account} variant="outlined">
              Мои заказы
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  if (order.awaits_key) {
    return (
      <Section overline="Оплачено" title={`Заказ №${order.number}`} centered>
        <div className={classes.done}>
          <SuccessMark />

          <p className={classes.done_text}>
            {summary}. Оплата прошла. Ключей этого тарифа на складе сейчас нет —
            пополняем. Код появится здесь и в кабинете, как только ключ будет
            готов.
          </p>

          <div className={classes.done_actions}>
            <Button href={Routes.Account}>Мои заказы</Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section
      overline="Заказ оформлен"
      title={`Заказ №${order.number}`}
      centered
    >
      <div className={classes.done}>
        <SuccessMark />

        <p className={classes.done_text}>
          {summary}. Заказ у нас и ждёт оплаты. Как только она пройдёт, ключ
          активации появится прямо на этой странице.
        </p>

        <div className={classes.done_actions}>
          <Button href={Routes.Account}>Мои заказы</Button>
          <Button href={Routes.Buy} variant="outlined">
            Купить ещё
          </Button>
        </div>
      </div>
    </Section>
  );
};

export const CheckoutView: FC = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  const cartItem = useAppSelector(selectCartItem);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isAuthReady = useAppSelector(selectIsAuthReady);
  const isMiniApp = useAppSelector(selectIsMiniApp);
  const webAppAuth = useAppSelector(selectWebAppAuth);

  // Адрес главнее корзины: по присланной ссылке должен открыться тот
  // заказ, а не последний отложенный. Без параметров показываем корзину —
  // ради этого страница и «единая»
  const service = params.get('service') || cartItem?.service || '';
  const plan = params.get('plan') || cartItem?.plan || '';

  const { data, isLoading, isError } = useCheckoutQuery(
    { service, plan },
    { skip: !service || !plan },
  );

  const [createOrder, { data: order, isLoading: isSending, error }] =
    useCreateOrderMutation();

  // Пришли по ссылке — запоминаем выбор: покупатель, закрывший вкладку
  // на оплате, найдёт заказ на том же /checkout.
  //
  // После оформления — не запоминаем. Сервис и тариф остаются в адресе, и
  // без этой проверки корзина, только что очищенная соседним эффектом,
  // тут же наполнялась бы из него заново
  React.useEffect(() => {
    if (order || !service || !plan) return;
    if (cartItem?.service === service && cartItem?.plan === plan) return;

    dispatch(planChosen({ service, plan }));
  }, [cartItem, dispatch, order, plan, service]);

  React.useEffect(() => {
    // Заказ ушёл на сервер — корзина своё отработала. Не чистить её
    // значит показать «оформить заказ» на тот же тариф при следующем
    // заходе
    if (order) dispatch(cartCleared());
  }, [dispatch, order]);

  if (order) return <Done order={order} />;

  if (!service || !plan) {
    return (
      <Section overline="Оформление заказа" title="Корзина пуста" centered>
        <p className={classes.empty}>
          Выберите сервис и тариф — они появятся здесь.
        </p>
        <div className={classes.done_actions}>
          <Button href={Routes.Buy}>Выбрать подписку</Button>
        </div>
      </Section>
    );
  }

  if (isLoading) {
    return <Section overline="Оформление заказа" title="Загружаем заказ…" />;
  }

  if (isError || !data) {
    return (
      <Section overline="Оформление заказа" title="Тариф не найден" centered>
        <Notice tone="error" title="Этот тариф больше не продаётся">
          Возможно, его сняли с витрины. Выберите другой.
        </Notice>
        <div className={classes.done_actions}>
          <Button href={Routes.Buy} variant="outlined">
            Вернуться к сервисам
          </Button>
        </div>
      </Section>
    );
  }

  const total = formatPrice(data.total);

  return (
    <Section overline="Покупка" title="Оформление заказа">
      <div className={classes.layout}>
        <Reveal className={classes.summary}>
          <div className={classes.row}>
            <ServiceMark
              logo={data.service.logo}
              accentColor={data.service.accent_color}
              size={40}
            />
            <div className={classes.row_text}>
              <p className={classes.row_label}>Сервис</p>
              <p className={classes.row_value}>{data.service.name}</p>
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.row_text}>
              <p className={classes.row_label}>Тариф</p>
              <p className={classes.row_value}>
                {data.plan.name}
                {data.plan.duration_days
                  ? ` · ${data.plan.duration_days} дн.`
                  : ''}
              </p>
            </div>
          </div>

          <div className={classes.total}>
            <span className={classes.total_label}>К оплате</span>
            <span className={classes.total_value}>{total ?? 'по запросу'}</span>
          </div>

          {!data.plan.in_stock && (
            <Notice tone="info" title="Тарифа нет в наличии">
              Заказ примем, но ключ придётся подождать — он появится здесь и в
              кабинете, как только поступит на склад.
            </Notice>
          )}

          {error != null && (
            <Notice tone="error" title="Заказ не оформился">
              Попробуйте ещё раз или напишите в поддержку.
            </Notice>
          )}

          {isAuthReady &&
          !isAuthorized &&
          isMiniApp &&
          webAppAuth === 'needs_email' ? (
            // В Telegram уводить на экран входа некуда: покупателя мы уже
            // узнали, не хватает только почты — спрашиваем здесь же, не
            // теряя выбранный тариф
            <TelegramEmailForm description="Укажите почту — на неё придут ключ и чек. Это разовый вопрос." />
          ) : isAuthReady && !isAuthorized ? (
            <>
              <Button
                href={`${Routes.Login}?next=${encodeURIComponent(Routes.Checkout)}`}
                fullWidth
                size="large"
              >
                Войти и оформить заказ
              </Button>
              <p className={classes.note}>
                Заказ привязывается к кабинету — там будут ключ и статус.
              </p>
            </>
          ) : (
            <Button
              onClick={() => createOrder({ service, plan })}
              loading={isSending}
              disabled={!isAuthReady}
              fullWidth
              size="large"
            >
              Оформить заказ
            </Button>
          )}
        </Reveal>

        <div className={classes.blocks}>
          {data.blocks.map((block) => {
            const Icon = getBlockIcon(block.icon);

            return (
              <Reveal key={block.key} className={classes.block}>
                <div className={classes.block_head}>
                  <span className={classes.block_icon}>
                    <Icon size={20} />
                  </span>
                  <h3 className={classes.block_title}>{block.title}</h3>
                </div>

                <Prose text={block.body} />
              </Reveal>
            );
          })}

          <p className={classes.legal}>
            Оформляя заказ, вы соглашаетесь с{' '}
            <Link href={Routes.Terms}>пользовательским соглашением</Link> и{' '}
            <Link href={Routes.Privacy}>политикой конфиденциальности</Link>.
          </p>
        </div>
      </div>
    </Section>
  );
};
