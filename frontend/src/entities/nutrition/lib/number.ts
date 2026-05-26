export const roundToOneDecimal = (value: number) =>
  Math.round(value * 10) / 10;

export const normalizePositive = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? value : fallback;

export const normalizeNonNegative = (value: number) =>
  Number.isFinite(value) && value > 0 ? value : 0;
