const DESKTOP_COLUMNS = [4, 3];

export const balancedColumns = (count: number): number => {
  if (count <= 0) return 1;
  if (count <= DESKTOP_COLUMNS[0]) return count;

  const even = DESKTOP_COLUMNS.find((columns) => count % columns === 0);
  if (even) return even;

  return DESKTOP_COLUMNS.find((columns) => count % columns !== 1) ?? 4;
};
