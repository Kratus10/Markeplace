// FILE: lib/utils/analyticsFormatter.ts
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

/**
 * Format dates for analytics display
 * @param date The date to format
 * @param format The format type (default: 'short')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'iso':
      return d.toISOString().split('T')[0];
    case 'short':
    default:
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
  }
}

/**
 * Calculate percentage change between two values
 * @param currentValue The current value
 * @param previousValue The previous value
 * @returns Percentage change (positive or negative)
 */
export function calculatePercentageChange(currentValue: number, previousValue: number): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  
  return ((currentValue - previousValue) / previousValue) * 100;
}