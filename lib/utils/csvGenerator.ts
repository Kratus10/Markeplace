// FILE: lib/utils/csvGenerator.ts
import { arrayToCSV } from './arrayToCSV';

/**
 * Download CSV data as a file
 * @param csvData CSV string data
 * @param filename Name of the file to download
 */
export function downloadCSV(csvData: string, filename: string): void {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate analytics report CSV
 * @param data Analytics data to convert
 * @returns CSV string
 */
export function generateAnalyticsCSV(data: any): string {
  // This is a simplified example - in a real implementation you would
  // structure this based on the actual data shape
  const sections = Object.entries(data).map(([sectionName, sectionData]) => {
    if (Array.isArray(sectionData)) {
      return `
${sectionName.toUpperCase()}
${arrayToCSV(sectionData)}
`;
    }
    return `
${sectionName.toUpperCase()}
${JSON.stringify(sectionData, null, 2)}
`;
  });
  
  return `Analytics Report
Generated: ${new Date().toISOString()}
${sections.join('
')}`;
}