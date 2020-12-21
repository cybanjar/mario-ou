/**
 * /**
 * Convert from timestamp into string
 * with prefix:
 * ```H:m:s```
 * @param time in second
 */
export function formatTime(time: number): string {
  const hours = Math.floor(time / 3600);
  time %= 3600;
  const minutes = '0' + Math.floor(time / 60);
  const seconds = '0' + (time % 60);

  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}
