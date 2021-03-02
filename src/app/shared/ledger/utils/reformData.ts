import { date } from 'quasar';

export function reformTransaction(tempLedger: any[]) {
  const dateFormatBL = 'YYYY-MM-DD';

  return tempLedger.map((temp, index) => ({
    key: index,
    acctNo: temp.fibukonto,
    debit: temp.debit,
    credit: temp.credit,
    note: temp.bemerk,
    userId: temp.userinit,
    systemDate:
      temp.sysdate === null
        ? undefined
        : date.extractDate(temp.sysdate, dateFormatBL),
    changeBy: temp.chginit,
    changeDate:
      temp.chgdate === null ? '' : date.extractDate(temp.chgdate, dateFormatBL),
    description: temp.bezeich,
  }));
}
