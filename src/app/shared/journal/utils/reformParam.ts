import {
  formatToOB,
  formatToDate,
  dateFormat,
} from '~/app/helpers/formatterDate.helper';
import { JournalTrans } from '../../models/journal.model';

/**
 * Add Trans
 * @param form
 * @param record
 */
export function reformSaveParam(record: JournalTrans) {
  const initParam = {
    bezeich: record.description,
    credits: record.credits,
    debits: record.credits,
    remains: record.remaining,
    refno: record.referenceNo,
    datum: formatToOB(formatToDate(record.date, dateFormat)),
  };
  const gList = {
    jnr: '',
    fibukonto: record.accNo,
    acctFibukonto: '00000000', // investigate
    debit: record.debit,
    credit: record.credit,
    userinit: ' ',
    sysdate: ' ',
    zeit: ' ',
    chginit: ' ',
    chgdate: ' ',
    duplicate: 'false',
    bemerk: record.accName,
    bezeich: record.remark,
    taxCode: '',
    taxAmount: '',
    totAmt: '',
  };

  return {
    ...initParam,
    pvILanguage: 0,
    currStep: 2,
    adjustFlag: 'false',
    gList: {
      'g-list': [gList],
    },
  };
}

/**
 * Edit Trans
 * @param jnr
 * @param form
 * @param record
 * @param remaining
 */
export function reformSaveAddParam(mode: 'chg' | 'add', form: JournalTrans) {
  const debit = form.debit || 0;
  const credit = form.credit || 0;
  const initParam = {
    s: form.accNo,
    fibukonto: form.accNo,
    'inp-remains': debit - credit,
    'inp-debit': debit,
    'inp-credit': credit,
    jnr: form.jnr,
    comments: form.remark,
    'bez-jouhdr': form.description,
    'recid-jouhdr': form.recid,
    refno: form.referenceNo,
  };
  const gList = {
    jnr: form.jnr,
    fibukonto: form.accNo,
    debit: form.debit,
    credit: form.credit,
    userinit: ' ',
    sysdate: ' ',
    zeit: ' ',
    chginit: ' ',
    chgdate: ' ',
    duplicate: 'true',
  };

  return {
    ...initParam,
    pvILanguage: '1',
    currMode: mode,
    'fibu-defined': true, //
    'user-init': '',
    'jou-recid': form.recid || '',
    'recid-journal': form.recid || '',
    // recidJouhdr: '',
    gList: {
      'g-list': [gList],
    },
  };
}
