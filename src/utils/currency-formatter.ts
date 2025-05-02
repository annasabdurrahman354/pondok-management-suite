
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "Rp 0";
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrencyInput(value: string): number {
  // Remove non-digit characters
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
