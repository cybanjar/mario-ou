export function Money(
    amount,
    decimalCount = 2,
    thousands = ','
  ){
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      amount = amount.replace(/,/g,'')
      amount = Math.abs(Number(amount) || 0);
      const i = parseInt(amount.toFixed(decimalCount)).toString();
      const j = i.length > 3 ? i.length % 3 : 0;
      return (j ? i.substr(0, j) + thousands : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
  }