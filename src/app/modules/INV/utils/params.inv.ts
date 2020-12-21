import { date } from 'quasar';

export const dataIncomingJournalizing = (GET_DATA?, prepare?) => {
  const date1 = date.formatDate(GET_DATA.lastAcctdate, 'MM-DD-YYYY');
  const data = (key) => ({
    fromDate:
      key == 'prepare' ? new Date(date1) : new Date(GET_DATA.searches.fromDate),
    toDate: key == 'prepare' ? new Date(date1) : GET_DATA.searches.toDate,
    hasilCredit: key == 'prepare' ? 0 : GET_DATA.credits,
    hasilDebit: key == 'prepare' ? 0 : GET_DATA.debits,
    lebelSearch: key == 'prepare' ? 'search' : 'journalizing',
    disableButton:
      key == 'search'
        ? GET_DATA.credits == GET_DATA.debits
          ? false
          : true
        : false,
    referenceNumber: key == 'search' ? GET_DATA.searches.referenceNumber : '',
    discription: key == 'search' ? GET_DATA.searches.discription : '',
    disableData: key == 'prepare' ? false : true,
    dataKey: key == 'prepare' ? GET_DATA.datakey : GET_DATA.searches.dataKey,
    mainGroup:
      key == 'prepare'
        ? GET_DATA.datakey == 'outgoing'
          ? mapWithBezeich(GET_DATA.lHauptgrpList['l-hauptgrp-list'], 'endkum')
          : ''
        : GET_DATA.searches.mainGroup,
    dataGroup:
      key == 'prepare'
        ? GET_DATA.datakey == 'outgoing'
          ? ''
          : ''
        : GET_DATA.searches.dataGroup,
  });
  if (prepare == 'prepare') {
    return data('prepare');
  } else {
    return data('search');
  }
};

const mapWithBezeich = (items, prefix) => {
   return items.map((item) => ({
        label: `${item[prefix]} - ${item.bezeich}`,
        value: item[prefix]
    }))
}

export const paramsReorg = (val) => ({
  userInit: '01',
  arrayNr: 41,
  expectedNr: val,
});

export const paramsIncomingJournalizing = (val?) => ({
  pvILanguage: 0,
  linkOut: val.dataKey == 'outgoing' ? true : false,
  linkIn: val.dataKey == 'outgoing' ? false : true,
  fromGrp:
    val.dataKey == 'outgoing'
      ? val.value !== '' ? val.dataGroup.value : 0
      : 0,
  fromDate: date.formatDate(val.fromDate, 'MM/DD/YY'),
  toDate: date.formatDate(val.toDate, 'MM/DD/YY'),
  userInit: 0,
});

export const paramscheckPermission = (val) => ({
  userInit: val.userInit,
  arrayNr: 41,
  expectedNr: 2,
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

export const linkstock_check_refnobl = () => ({
  refno: '02076230',
  jtype: 0,
});
