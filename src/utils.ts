// utils/price-formatter.ts

export const formatPrice = (amountInCents: number, currency = 'EUR'): string => {
  const amount = amountInCents / 100;
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatPriceCompact = (amountInCents: number, currency = 'EUR'): string => {
  const amount = amountInCents / 100;
  
  if (amount >= 1000000) {
    return `${currency === 'EUR' ? '€' : '$'}${(amount / 1000000).toFixed(1)}M`;
  }
  
  if (amount >= 1000) {
    return `${currency === 'EUR' ? '€' : '$'}${(amount / 1000).toFixed(1)}K`;
  }
  
  return formatPrice(amountInCents, currency);
};

export const centsToEuros = (cents: number): number => {
  return cents / 100;
};

export const eurosToCents = (euros: number): number => {
  return Math.round(euros * 100);
};