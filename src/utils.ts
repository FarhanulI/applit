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

export const findLastRoute = (pathname: string) => {
  const parts = pathname.split("/");
  return parts[parts.length - 1];
};

export const formatDateToStr = (dateString: string | undefined): string => {
  if(!dateString) return "";
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formatted = new Intl.DateTimeFormat("en-GB", options)?.format(date);

  // Add comma before the year
  return formatted.replace(/ (\d{4})$/, ", $1");
};