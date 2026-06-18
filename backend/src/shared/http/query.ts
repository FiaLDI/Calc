export const getSingleQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === "string" ? firstValue : "";
  }

  return typeof value === "string" ? value : "";
};

export const getStringListQuery = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return (typeof value === "string" ? value : "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const normalizePositiveInteger = (value: string, fallback: number) => {
  const parsedValue = Number(value);

  if (!value.trim() || !Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};

export const normalizeNonNegativeInteger = (
  value: string,
  fallback: number
) => {
  const parsedValue = Number(value);

  if (!value.trim() || !Number.isInteger(parsedValue) || parsedValue < 0) {
    return fallback;
  }

  return parsedValue;
};
