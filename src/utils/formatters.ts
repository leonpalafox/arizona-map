export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return 'N/A';
  return num.toLocaleString('en-US');
}

export function formatCurrency(num: number | undefined): string {
  if (num === undefined || num === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatPercent(num: number | undefined, total: number | undefined): string {
  if (num === undefined || num === null || total === undefined || total === null || total === 0) {
    return 'N/A';
  }
  const percent = (num / total) * 100;
  return `${percent.toFixed(1)}%`;
}

export function formatDensity(density: number | undefined): string {
  if (density === undefined || density === null) return 'N/A';
  return `${density.toFixed(1)} per sq mi`;
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
