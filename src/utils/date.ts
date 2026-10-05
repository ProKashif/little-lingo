/** Local calendar day as YYYY-MM-DD (not UTC — a streak follows the child's day). */
export function localDay(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function previousDay(day: string): string {
  const [year = 0, month = 1, date = 1] = day.split('-').map(Number);
  return localDay(new Date(year, month - 1, date - 1));
}
