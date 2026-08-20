/** Цены витрины.
 *
 *  Intl вместо ручной расстановки пробелов: разряды в рублях разделяются
 *  неразрывным пробелом, и набрать его руками в шаблоне — верный способ
 *  однажды получить перенос строки посреди числа.
 *
 *  Цена приезжает строкой: DRF отдаёт Decimal строкой, чтобы копейки не
 *  поехали через float. Разбираем её здесь, в одном месте.
 */

const format = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  // Копейки в ценах на подписки не встречаются, а «1 990,00 ₽» шумит.
  // Если копейки всё же появятся, покажем их.
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function parse(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

/** «1 990 ₽», либо `null`, если цена не назначена.
 *
 *  Возвращаем `null`, а не прочерк: подпись у «цены нет» зависит от
 *  места — на карточке это «по запросу», в списке может быть иначе.
 */
export function formatPrice(value: string | null | undefined): string | null {
  const amount = parse(value);
  return amount === null ? null : format.format(amount);
}

/** «от 1 990 ₽» по набору тарифов — для карточки сервиса.
 *
 *  Считаем по тарифам, у которых цена есть: тариф без цены не должен
 *  занижать вилку до нуля.
 */
export function formatPriceFrom(
  plans: { price: string | null }[],
): string | null {
  const amounts = plans
    .map((plan) => parse(plan.price))
    .filter((amount): amount is number => amount !== null);

  if (!amounts.length) return null;
  return `от ${format.format(Math.min(...amounts))}`;
}
