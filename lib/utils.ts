export function formatToWon(price: number): string {
  return price.toLocaleString('ko');
}

export function formatToTimeAgo(date: string): string {
  const dayInMs = 24 * 60 * 60 * 1000;
  const time = new Date(date).getTime();
  const now = new Date().getTime();

  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat('ko');

  return formatter.format(diff, 'days');
}

export function formatToTime(date: string): string {
  const time = new Date(date);

  const formatter = new Intl.DateTimeFormat('ko', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Ensures that the time is displayed in 12-hour format with AM/PM
  });

  return formatter.format(time);
}
