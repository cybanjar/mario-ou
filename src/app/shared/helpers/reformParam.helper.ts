// account: "00-00-1114" x
// account_name: "Bank BCA AR" x
// ask_for_print: undefined
// credit: 0 x
// date: "01/01/2019"
// debit: 100000 x
// description: "TEST010119" x
// reference_no: "TEST010119" x
// remaining: "0.00"
// remark: "TEST0" x
// total_credit: "100,000.00"
// total_debit: "100,000.00"
type EditValue = {
  account: string;
  debit: number;
  credit: number;
  remark: string;
  description: string;
  referenceNo: string;
};
// account: "00001114"
// balance: "3,221,112,511.74"
// change_date: ""
// change_id: " "
// created: ""
// credit: "0.00"
// date: "01/01/2019"
// debit: "100,000.00"
// description: "TEST010119"
// id: " "
// idx: 1
// jnr: 5912 x
// note: "TEST                                              "
// originalCredit: 0
// originalDebit: 100000
// record_id: 1276044 x
// reference_no: "TEST010119"
// refno: "TEST010119"
type Record = {
  remaining: number;
  jnr: string;
  recordId: string;
};

// account_no: "00-00-1114"
// change_by: " "
// changed_date: ""
// created: ""
// credit: 0
// debit: 100000
// description: "Bank BCA AR"
// id: " " x
// key: 0
// recjournid: 1276044 x
// remark: "TEST"
// time: "0:0:0"

type Modal = {
  id: string;
  recJournId: string;
  mode: 'chg' | 'add';
};

/**
 * @param values value to change data
 * @param records form data
 * @param recordsModal module
 */
export default function paramDataTrans(
  values: EditValue,
  records: Record,
  recordsModal: Modal
) {
  const newParams = {
    pvILanguage: '1',
    currMode: recordsModal.mode,
    s: values.account,
    fibukonto: values.account,
    inpRemains: records.remaining,
    inpDebit: values.debit,
    inpCredit: values.credit,
    fibuDefined: 'true',
    jnr: records.jnr,
    comments: values.remark,
    userInit: recordsModal.id,
    jouRecid: recordsModal.recJournId,
    recidJournal: recordsModal.recJournId,
    bezJouhdr: values.description,
    refno: values.referenceNo,
    recidJouhdr: records.recordId,
    gList: {
      'g-list': [
        {
          jnr: records.jnr,
          fibukonto: values.account,
          debit: values.debit,
          credit: values.credit,
          userinit: ' ',
          sysdate: ' ',
          zeit: ' ',
          chginit: ' ',
          chgdate: ' ',
          duplicate: 'true',
        },
      ],
    },
  };
  return newParams;
}
