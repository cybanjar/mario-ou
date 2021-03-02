export function formatterMoney(
  amount: number,
  decimalCount = 2,
  decimal = '.',
  thousands = ','
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    amount = Math.abs(Number(amount) || 0);
    const i = parseInt(amount.toFixed(decimalCount)).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - parseInt(i))
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (e) {
    throw e;
  }
}

export function moneyDecimal(
  money: string,
  decimalCount = 2,
  decimal = '.',
  thousands = ',',
  addDecimal = false
) {
  try {
    const decimalRe = new RegExp(
      `(?<=.)\\${decimal}\\d{${decimalCount}}$`,
      'g'
    );
    const thousandRe = new RegExp(`${thousands}(?<!\\d{3})`, 'g');

    const prime = addDecimal ? money : money.replace(decimalRe, '');
    const realNumber = prime.replace(thousandRe, '');

    return parseFloat(realNumber);
  } catch (e) {
    throw e;
  }
}
