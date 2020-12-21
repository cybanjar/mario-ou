export const formatThousands = (number: number) =>
  new Intl.NumberFormat().format(number) + '.00';

export const parseThousands = (money: string) =>
  parseInt(money.replace(/\.00$/, '').replace(',', '').replace('.', ''));
