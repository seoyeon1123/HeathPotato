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
