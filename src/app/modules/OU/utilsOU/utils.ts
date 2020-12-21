export const displayTime = (time) => {
    const t = parseInt(time);
    const hourTemp = (t / 3600);
    const minTemp = ((time / 3600 - hourTemp) * 60);
    const secTemp = (time - hourTemp * 3600 - minTemp * 60);
    const hour = hourTemp < 10 ? "0" + hourTemp : hourTemp;
    const min = minTemp < 10 ? "0" + minTemp : minTemp;
    const sec = secTemp < 10 ? "0" + secTemp : secTemp;
    return hour + ":" + min + ":" + sec;
}
