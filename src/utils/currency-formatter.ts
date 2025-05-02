
/**
 * Format a number as Indonesian Rupiah
 */
export const formatCurrency = (value: number): string => {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `Rp${value}`;
  }
};

/**
 * Parse a currency string to number
 */
export const parseCurrency = (value: string): number => {
  try {
    // Remove all non-digit characters
    const numericString = value.replace(/\D/g, '');
    return parseInt(numericString, 10) || 0;
  } catch (error) {
    console.error('Error parsing currency:', error);
    return 0;
  }
};
