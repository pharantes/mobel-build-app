export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDimension = (mm: number): string => {
  return `${mm}mm`;
};

export const formatDimensions = (
  width: number,
  depth: number,
  height: number
): string => {
  return `${width}×${depth}×${height}mm`;
};
