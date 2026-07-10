export const formatCurrency = (num, locale = 'vi-VN', currency = 'VND') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(num);
  };
  