import { date } from 'quasar';
import {formatterMoney} from 'src/app/helpers/formatterMoney.helper'
export const dataState = (GET_DATA, key) => {
  const dataDate = date.formatDate(GET_DATA.lastAcctdate, 'MM-DD-YYYY');
  const data = () => ({
    fromDate: key == 'prepare' ? new Date(dataDate) : GET_DATA.searches.fromDate,
    toDate: key == 'prepare' ? new Date(dataDate) : GET_DATA.searches.toDate,
    refNum: key == 'prepare' ? '' : GET_DATA.searches.refNum,
    des: key == 'prepare' ? '' : GET_DATA.searches.des,
    hasilDebit: key == 'prepare' ? 0 : formatterMoney(GET_DATA.debits),
    hasilCredit: key == 'prepare' ? 0 : formatterMoney(GET_DATA.credits),
    search: key == 'prepare' ? 'Search' : 'Compliment',
    disableButton: key == 'prepare' ? false : true
  });
  return data();
};

export const ButtonExecute = (params) => ({
  pvILanguage: 0,
  fromDate: date.formatDate(params.searches.fromDate, 'MM/DD/YY'),
  toDate: date.formatDate(params.searches.toDate, 'MM/DD/YY'),
  doubleCurrency: 'no',
  foreignNr: 0,
  exchgRate: 1,
  userInit: 0,
});

export const paramsglLinkstock2 = (val) => ({
    gList: {
      'g-list': [
        {
          fibukonto: val['acct-fibukonto'],
          debit: val.debit,
          credit: val.credit,
          bemerk: val.bemerk,
          userinit: val.userinit,
          zeit: val.zeit,
          'add-note': val['add-note'],
        },
      ],
    },
  });
