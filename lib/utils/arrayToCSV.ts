// FILE: lib/utils/arrayToCSV.ts
/**
 * Convert an array of objects to CSV format
 * @param data Array of objects to convert
 * @returns CSV string
 */
export function arrayToCSV(data: Record<string, any>[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Extract headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle special cases
      if (value === null || value === undefined) {
        return '';
      }
      // Escape commas and wrap strings in quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
}