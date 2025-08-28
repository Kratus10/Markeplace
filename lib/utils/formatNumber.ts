// FILE: lib/utils/formatNumber.ts
/**
 * Format a number for display with appropriate units
 * @param num The number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number string with units
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toString();
}

/**
 * Format currency values
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage values
 * @param value The percentage value
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}