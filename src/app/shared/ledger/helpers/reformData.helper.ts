import { formatFromBL } from '../../../helpers/formatterDate.helper';
import { formatterAccountNumber } from './formmaterAccountNumber';
export type LedgerRes = {
  refno: string;
  bezeich: string;
  bemerk: string;
  debit: number;
  credit: number;
  balance: number;
  uid: string;
  created: string;
  chgDate: string;
  chgID: string;
  fibukonto: string;
  jnr: number;
  'trans-date': string;
};

export type LedgerData = {
  key: number;
  date: string;
  referenceNo: string;
  note: string;
  debit: number;
  originalDebit: number;
  credit: number;
  originalCredit: number;
  balance: number;
  description: string;
  id: string;
  created: string;
  changeDate: string;
  changeId: string;
  account: string;
  recordId: string;
  jnr: number;
  refno: string;
  cashFlow?: string;
  taxCode?: string;
  taxAmount?: string;
  decription?: string;
};

export function reformLedgerData(temp: LedgerRes[]): LedgerData[] {
  const mapObj = {
    'T O T A L': 'Subtotal',
    'GRAND T O T A L': 'Total',
  };
  const data = temp.map<LedgerData>((temp, index) => ({
    key: index,
    date: temp['trans-date'],
    referenceNo: temp.refno,
    note: temp.bemerk,
    debit: temp.debit,
    originalDebit: temp.debit,
    credit: temp.credit,
    originalCredit: temp.credit,
    balance: temp.balance,
    description: temp.bezeich.replace(/T O T A L|GRAND T O T A L/gi, function (
      matched
    ) {
      return mapObj[matched];
    }),
    id: temp.uid,
    created: temp.created,
    changeDate: temp.chgDate,
    changeId: temp.chgID,
    account: temp.fibukonto.trim().replace('-', ''),
    recordId: temp['s-recid'],
    jnr: temp.jnr,
    refno: temp.refno,
  }));
  return data;
}

export type ViewTrans = {
  key: number;
  acctNo: string;
  debit: string;
  credit: string;
  note: string;
  userId: string;
  systemDate: string;
  changeBy: string;
  changeDate: string;
  description: string;
};

export function reformViewTransData(temp): ViewTrans[] {
  const data = temp.map((temp, index) => ({
    key: index,
    acctNo: temp.fibukonto,
    debit: temp.debit,
    credit: temp.credit,
    note: temp.bemerk,
    userId: temp.userinit,
    systemDate: temp.sysdate,
    changeBy: temp.chginit,
    changeDate: temp.chgdate,
    description: temp.bezeich,
  }));
  return data;
}

export function reformEditTrans(transRes, parameterForAccountNumber) {
  const tempTable = transRes.b1List['b1-list'];
  const tempForm = transRes.tGlJouhdr['t-gl-jouhdr'];
  const closeDate = transRes.closedate;
  const tempData = reformEdit(
    tempTable,
    tempForm,
    closeDate,
    parameterForAccountNumber
  );
  const data = tempData.data;
  const form = tempData.form;
  const date = tempData.date;

  return { data, form, date };
}

export type EditTransField = {
  recjournid: string;
  accountNo: string;
  changeBy: string;
  debit: number;
  credit: number;
  remark: string;
  created: string;
  description: string;
};

export type EditTrans = {
  key: number;
  recjournid: string;
  accountNo: string;
  debit: number;
  credit: number;
  remark: string;
  id: string;
  created: string;
  time: string;
  changeBy: string;
  changedDate: string;
  description: string;
} & EditTransField;

export type EditTransFormBase = {
  date: string;
  referenceNo: string;
  description: string;
  debits: number;
  credits: number;
  remaining: number;
  recid: string;
};

export type TransFormRecord = {
  key: number;
  jnr: string;
  batch: string;
} & EditTransFormBase;

export type ReformEdit = {
  data: EditTrans[];
  form: TransFormRecord[];
  date: string;
};

export type EditTransForm = {
  key?: number;
  mode: 'chg' | 'add' | 'init' | 'del';
  date: string;
  referenceNo: string;
  description: string;
  accNo: string;
  accName: string;
  remark: string;
  debit: number;
  credit: number;
  credits: number;
  debits: number;
  remaining: number;
} & TransFormRecord;

function reformEdit(
  tempModify,
  tempForm,
  closeDate,
  GL_PARAM: string[]
): ReformEdit {
  const date = closeDate === null ? '' : formatFromBL(closeDate);

  const data = tempModify.map((temp, index) => ({
    key: index,
    recjournid: temp['rec-gl-journ'],
    accountNo: formatterAccountNumber(temp.fibukonto, GL_PARAM),
    debit: temp.debit,
    credit: temp.credit,
    remark: temp.bemerk,
    id: temp.chginit,
    created: temp.sysdate,
    time: temp.zeit,
    changeBy: temp.chginit,
    changedDate: temp.chgdate,
    description: temp.bezeich,
  }));

  const form = tempForm.map((temp, index) => ({
    key: index,
    date: temp.datum === null ? '' : formatFromBL(temp.datum),
    referenceNo: temp.refno,
    description: temp.bezeich,
    debits: temp.debit,
    credits: temp.credit,
    remaining: temp.remain,
    jnr: temp.jnr,
    recid: temp['rec-id'],
    batch: temp.batch,
  }));

  return { data, form, date };
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
