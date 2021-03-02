import { dateFormatBL, formatToDate } from '~/app/helpers/formatterDate.helper';
import { formatterAccountNumber } from '../../ledger/helpers/formmaterAccountNumber';
import { TransRecord } from '../../models/journal.model';

export function reformDetailData(tempData: TransRecord[], GL_PARAM: string[]) {
  return tempData.map((temp, index) => ({
    key: index,
    recid: temp['rec-gl-journ'],
    accNo: formatterAccountNumber(temp.fibukonto, GL_PARAM),
    debit: temp.debit,
    credit: temp.credit,
    remark: temp.bemerk,
    id: temp.userinit,
    created: new Date(temp.sysdate),
    time: temp.zeit,
    changeBy: temp.chginit,
    changedDate: temp.chgdate && formatToDate(temp.chgdate, dateFormatBL),
    description: temp.bezeich,
  }));
}

export function reformActiveJournalData(tempPrepare: any[]) {
  return tempPrepare.map((it, index) => ({
    key: index,
    date: formatToDate(it.datum, dateFormatBL),
    reference_no: it.refno,
    description: it.bezeich,
    debits: it.debit,
    credits: it.credit,
    remaining: it.remain,
    jnr: it.jnr,
    recid: it['rec-id'],
    activeflag: it.activeflag,
    batch: it.batch,
  }));
}
