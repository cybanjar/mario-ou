import { formatFromBL } from '../../helpers/formatterDate.helper';
import { formatterAccountNumber } from '../ledger/helpers/formmaterAccountNumber';
import { Journal } from '../models/journal.model';

export function reformTransaction(tempModify: any, accParams: string[]) {
  return tempModify.map((temp, index) => ({
    key: index,
    recid: temp['recid-jouhdr'],
    recjournid: temp['rec-gl-journ'],
    accNo: formatterAccountNumber(temp.fibukonto, accParams),
    debit: temp.debit,
    credit: temp.credit,
    remark: temp.bemerk,
    id: temp.chginit,
    created: temp.sysdate,
    time: temp.zeit,
    changeBy: temp.chginit,
    changedDate: temp.chgdate,
    accName: temp.bezeich,
  }));
}

export function reformChgGLJournal(transRes, accParams: string[]) {
  const tempModify: any[] = transRes.b1List['b1-list'];
  const tempForm: any[] = transRes.tGlJouhdr['t-gl-jouhdr'];
  const closeDate: string = transRes.closedate;
  const date = closeDate === null ? '' : formatFromBL(closeDate);

  const trans = reformTransaction(tempModify, accParams);

  const [form] = tempForm.map<Journal>((temp) => ({
    date: new Date(temp.datum),
    referenceNo: temp.refno,
    description: temp.bezeich,
    debits: temp.debit,
    credits: temp.credit,
    remaining: temp.remain,
    jnr: temp.jnr,
    recid: temp['rec-id'],
    batch: temp.batch,
  }));

  return { trans, form, date };
}

export function getAccountType(code) {
  return code === 3
    ? 'Activa'
    : code === 4
    ? 'Passiva'
    : code === 5
    ? 'Expense'
    : code === 2
    ? 'Cost'
    : 'Sales';
}

export type LedgerAccount = {
  key: number;
  accountNumber: string;
  accountName: string;
  accountType: 'Activa' | 'Passiva' | 'Expense' | 'Cost' | 'Sales';
  accountDepartment: string;
  mainAccount: string;
};

export function reformAccountData(
  tempTable,
  GL_PARAM: string[]
): LedgerAccount[] {
  const data = tempTable.map((temp, index) => ({
    key: index,
    accountNumber: formatterAccountNumber(temp.fibukonto, GL_PARAM),
    accountName: temp.bezeich,
    accountType: getAccountType(temp['acc-type']),
    accountDepartment: temp.deptnr,
    mainAccount: temp['main-nr'],
  }));

  return data;
}
