// Rút gọn số lớn bằng hậu tố phù hợp để dễ quan sát.
export const formatLargeNumber = (num, locale = 'vi-VN', currency = 'VND') => {
    if (num >= 100_000_000) {
        return new Intl.NumberFormat(locale, {
            notation: 'compact',
            maximumFractionDigits: 3
        }).format(num);
    } else {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(num);
    }
};