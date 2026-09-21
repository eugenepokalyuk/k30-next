const format = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function parse(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function formatPrice(value: string | null | undefined): string | null {
  const amount = parse(value);
  return amount === null ? null : format.format(amount);
}

export function formatPriceFrom(
  plans: { price: string | null }[],
): string | null {
  const amounts = plans
    .map((plan) => parse(plan.price))
    .filter((amount): amount is number => amount !== null);

  if (!amounts.length) return null;
  return `от ${format.format(Math.min(...amounts))}`;
}
