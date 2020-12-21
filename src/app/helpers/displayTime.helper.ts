/**
 * Return Time format from integer value to HH:mm:ss.
 * Usually using by data from database or BACKEND
 *
 * @param time {Integer} Integer from backend
 */
export function displayTime(time: number): string {
  const hourTemp = Math.floor(time / 3600);
  const minTemp = Math.floor((time / 3600 - hourTemp) * 60);
  const secTemp = Math.floor(time - hourTemp * 3600 - minTemp * 60);
  const hour = hourTemp < 10 ? '0' + hourTemp : hourTemp;
  const min = minTemp < 10 ? '0' + minTemp : minTemp;
  const sec = secTemp < 10 ? '0' + secTemp : secTemp;
  return hour + ':' + min + ':' + sec;
}
