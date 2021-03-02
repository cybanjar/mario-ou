import { date } from 'quasar';
import {
  formatToOB,
  formatToDate,
  dateFormat,
} from '~/app/helpers/formatterDate.helper';
import { Journal, JournalTrans, Trans } from '../../models/journal.model';

/**
 * Add Trans
 * @param form
 * @param record
 */
export function reformSaveParam(journal: Journal, trans: Trans[]) {
  const initParam = {
    bezeich: journal.description,
    credits: journal.credits,
    debits: journal.credits,
    remains: journal.remaining,
    refno: journal.referenceNo,
    datum: formatToOB(journal.date),
  };
  const gList = trans.map((record) => ({
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
  }));

  return {
    ...initParam,
    pvILanguage: 0,
    currStep: 2,
    adjustFlag: 'false',
    gList: {
      'g-list': gList,
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
export function reformSaveAddParam(form: Journal, trans: Trans, mode) {
  const debit = trans.debit || 0;
  const credit = trans.credit || 0;
  const initParam = {
    s: trans.accNo,
    fibukonto: trans.accNo,
    inpRemains: debit - credit,
    inpDebit: debit,
    inpCredit: credit,
    jnr: trans.jnr,
    comments: trans.remark,
    bezJouhdr: form.description,
    recidJouhdr: trans.recid,
    refno: form.referenceNo,
  };
  const gList = {
    jnr: trans.jnr,
    fibukonto: trans.accNo,
    debit: trans.debit,
    credit: trans.credit,
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
    fibuDefined: true, //
    userInit: '',
    jouRecid: trans.recid,
    recidJournal: trans.recid,
    // recidJouhdr: '',
    gList: {
      'g-list': gList,
    },
  };
}
