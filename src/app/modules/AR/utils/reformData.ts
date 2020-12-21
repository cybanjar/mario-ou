import {
  formatToDate,
  dateFormatDebt,
  dateFormatBL,
} from '~/app/helpers/formatterDate.helper';
import { formatterAccountNumber } from '~/app/shared/ledger/helpers/formmaterAccountNumber';
import { date } from 'quasar';
import { AgingBalanceTable, Bill } from '../models/aging-balance';

export function reformDebitListData(tempData: any[], billReceiverFilter) {
  const data = [];
  tempData.forEach((it, index) => {
    let billReceiverValue: string;
    let dateOri: string;
    let dateFormat: Date;
    let arrival: Date;
    let departure: Date;
    let billNumber: number;
    let roomNumber: number;
    let company_no: number;

    try {
      dateOri = it['STR'].substring(0, 8)?.trim();
      billReceiverValue = it['STR'].substring(22, 66)?.trim();
      dateFormat = dateOri ? formatToDate(dateOri, dateFormatDebt) : undefined;
      arrival = it['ci-date']
        ? formatToDate(it['ci-date'], dateFormatBL)
        : undefined;
      departure = it['co-date']
        ? formatToDate(it['co-date'], dateFormatBL)
        : undefined;
      billNumber =
        parseInt(it['STR'].substring(9, 19).trim().replace(/,/g, '')) || 0;
      roomNumber = parseInt(it['STR'].substring(19, 22)?.trim()) || 0;
      company_no = it['ref-no1'];
    } catch (e) {}

    switch (billReceiverValue) {
      case 'Sub-Total':
        billReceiverValue = 'Subtotal';
        break;
      case 'T O T A L':
        billReceiverValue = 'Total';
        break;
      case 'Grand TOTAL':
        billReceiverValue = 'Grand Total';
        break;
      default:
        break;
    }

    // Case data kosong
    if (!dateFormat && !billNumber && !roomNumber && !billReceiverValue) {
      // Kalau 4 field itu kosong, sudah jgn masukan ke array
    } else if (
      billReceiverValue.toLowerCase().includes(billReceiverFilter.toLowerCase())
    ) {
      data.push({
        key: index,
        date: dateFormat,
        billNo: billNumber,
        rmNo: roomNumber,
        billReceiver: billReceiverValue,
        debtAmount: it['STR'].substring(66, 84),
        foreignAmount: it['STR'].substring(88, 107),
        cur: it['STR'].substring(108, 125),
        id: it['STR'].substring(84, 87),
        mailDate: it.maildate,
        additionalInfo: it.info,
        compNo: company_no,
        refNo: it['ref-no2'],
        arrival: arrival,
        departure: departure,
        night: it['nights'],
        arRecid: it['ar-recid'],
        invoiceId: it['inv-no'],
      });
    }
  });

  return data;
}

export function reformTransactionDataTable(tempData) {
  const formatDateDariBL = 'YYYY-MM-DD';

  const data = tempData.map((item, index) => ({
    key: index,
    billName: item.billname,
    roomNumber: item.zinr,
    billNumber: item.rechnr,
    billDate: formatToDate(item.rgdatum, formatDateDariBL),
    debtAmount: parseInt(item.debt) || 0,
    payAmount: parseInt(item.credit) || 0,
    balance: parseInt(item['tot-debt']) || 0,
    refNumber: parseInt(item.refno) || 0,
    counterNumber: parseInt(item.rechnr2) || 0,
    payDate: formatToDate(item.paydatum, formatDateDariBL),
    payment: item.bezeich,
    id: item['user-init'],
    currency: item.wabkurz,
    guestName: item.gname,
    voucherNumber: item.voucher,
    arrival: formatToDate(item.ankunft, formatDateDariBL),
    departure: formatToDate(item.abreise, formatDateDariBL),
    stay: item.stay,
    foreignAmount: parseInt(item.ttl) || 0,
    remark: item.remarks,
  }));
  return data;
}

export function reformJournalsData(tempData, fchar) {
  const dataMantule = [];

  for (let i = 0; i < tempData.length; i++) {
    const data = tempData[i];

    dataMantule.push({
      key: i,
      account_number: formatterAccountNumber(data.fibukonto, fchar),
      account_number_ori: data.fibukonto,
      description: data.bezeich,

      debit: data.debit,
      debit_ori: data.debit,

      credit: data.credit,
      credit_ori: data.credit,

      remark: data.bemerk,
      user_id: data.userinit,

      created_date: data.sysdate,
      created_date_ori: data.sysdate,

      time: data.zeit,
      time_ori: data.zeit,

      changed_id: data.chginit,

      changed_date: data.chgdate,
      changed_date_ori: data.chgdate,

      account_fibucuntoaco: data['acct-fibukonto'],
      additional_info: data['add-info'],
      jnr: data.jnr,
      rechnr: data.rechnr,
      dept: data.dept,
      counter: data.counter,
      duplicate: data.duplicate,
    });
  }

  return dataMantule;
}

export function reformAgingBalanceData(temp: any[]): AgingBalanceTable[] {
  return temp.map((item, index) => ({
    key: index,
    articleNumber: item.artnr,
    number: item.STR.substring(0, 6).trim(), // artnr = Artikel Number
    billReceiver: item.STR.substring(6, 38).trim(), // Kolom “CUSTOMER NAME” 	| Substring(STR, 8, 30)
    beginningBalance: item.STR.substring(56, 74).trim(), //  Kolom “PREV BALANCE”		| Substring(STR, 56, 18)
    debit: item.STR.substring(74, 92).trim(), // Kolom “DEBIT” | Substring(STR, 74, 18)
    credit: item.STR.substring(56, 64).trim(), // Kolom “CREDIT” | Substring(STR, 92, 18)
    endingBalance: parseInt(item.STR.substring(38, 56).trim()),
    oneToThirty: parseInt(item.age1.trim()),
    thirtyoneToSixty: parseInt(item.age2.trim()),
    sixtyoneToNinety: parseInt(item.age3.trim()),
    overNinety: parseInt(item.age4.trim()),
    guestNumber: item.gastnr,
    billNumber: item.rechnr.trim(),
    billDate:
      item.strdate === '' || item.strdate === undefined || item.strdate === null
        ? ''
        : item.strdate.charAt(0) === '-'
        ? item.strdate
        : date.extractDate(item.strdate, 'DD/MM/YYYY'),
    currency: item.curr,
  }));
}

export function reformCustomerData(temp: any[]): AgingBalanceTable[] {
  const data = temp.map<AgingBalanceTable>((item, index) => ({
    key: index,
    billNumber: item.STR.substring(1, 7).trim(),
    guestGroupName: item.STR.substring(7, 40).trim(),
    age: item.STR.substring(56, 60).trim(),
    endingBalance: parseInt(item.STR.substring(40, 56).trim()),
    oneToThirty: parseInt(item.STR.substring(60, 77).trim()),
    thirtyoneToSixty: parseInt(item.STR.substring(77, 94).trim()),
    sixtyoneToNinety: parseInt(item.STR.substring(94, 111).trim()),
    overNinety: parseInt(item.STR.substring(111, 128).trim()),
    currency: item.curr,
    creditLimit: item.creditlimit,
  }));
  return data;
}

export function reformReservation(tempData: any[]): Bill[] {
  const temp = tempData.map<Bill>((item, index) => ({
    key: index,
    reservationNumber: item.resno,
    guestName: item.nama,
    roomType: item.rt,
    roomNumber: item.room,
    arrival: item.arr,
    departure: item.dep,
    adult: item.erwachs,
    child1: item.kind1,
    child2: item.kind2,
    compliment: item.gratis,
    arrangement: item.RO,
  }));

  return temp;
}
