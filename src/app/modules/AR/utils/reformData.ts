import {
  formatToDate,
  dateFormatDebt,
  dateFormatBL,
} from '~/app/helpers/formatterDate.helper';
import { formatterAccountNumber } from '~/app/shared/ledger/helpers/formmaterAccountNumber';
import { date } from 'quasar';
import { AgingBalanceTable, Bill } from '../models/aging-balance';
import { TablePaymentList } from '../models/payment-list.model';
import { ResPaymentDebtPayList } from '../models/payment.model';

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
    let companyNo: number;

    try {
      dateOri = it['STR']?.substring(0, 8)?.trim();
      billReceiverValue = it['STR']?.substring(22, 66)?.trim();
      dateFormat = dateOri ? formatToDate(dateOri, dateFormatDebt) : undefined;
      arrival = it['ci-date']
        ? formatToDate(it['ci-date'], dateFormatBL)
        : undefined;
      departure = it['co-date']
        ? formatToDate(it['co-date'], dateFormatBL)
        : undefined;
      billNumber =
        parseInt(it['STR']?.substring(9, 19).trim().replace(/,/g, '')) || undefined;
      roomNumber = parseInt(it['STR']?.substring(19, 22)?.trim()) || undefined;
      companyNo = it['ref-no1'];
    } catch (e) {
      console.error(e);
    }

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
        debtAmount: it['STR']?.substring(66, 84)?.trim(),
        foreignAmount: it['STR']?.substring(88, 107)?.trim(),
        cur: it['STR']?.substring(108, 125)?.trim(),
        id: it['STR']?.substring(84, 87)?.trim(),
        mailDate: it.maildate,
        additionalInfo: it.info,
        compNo: companyNo,
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

export function reformBillDetail(tempData: any): any[] {
  const dataBill = tempData.tBillLine['t-bill-line'];
  const dataBline = tempData.tBlinehis['t-blinehis'];
  const lengthBill = dataBill.length;
  const lengthBline = dataBline.length;
  const reformData =
    lengthBill > 0
      ? _reformBillDetail(dataBill)
      : lengthBline > 0 && _reformBillDetail(dataBline);
  return reformData;
}

function _reformBillDetail(tempData: any[]) {
  const dateFormatBL = 'YYYY-MM-DD';
  const temp = tempData.map((item, index) => ({
    key: index,
    articleNumber: item.artnr,
    quantity: item.anzahl,
    description: item.bezeich,
    price: item.epreis,
    amount: item.betrag,
    roomNumber: item.zinr,
    billDate: date.extractDate(item['bill-datum'], dateFormatBL),
    userId: item.userinit,
    systemDate: date.extractDate(item.sysdate, dateFormatBL),
    time: item.zeit,
  }));
  return temp;
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

export function reformPaymentListData(tempData: any[]): TablePaymentList[] {
  const data: TablePaymentList[] = [];
  for (let i = 0; i < tempData.length; i++) {
    const bill_date = tempData[i].STR.substring(0, 8)?.trim() || undefined;
    const bill_number =
      tempData[i].STR.substring(8, 19).replace(',', '')?.trim() || undefined;
    const bill_receiver =
      tempData[i].STR.substring(19, 53)?.trim() || undefined;
    const paymetnDate =
      tempData[i].STR.substring(105, 117)?.trim() || undefined;
    const payForeignAmount =
      tempData[i].STR.substring(159, 161)?.trim() || undefined;
    const arAmount = tempData[i].STR.substring(53, 70)?.trim() || undefined;
    const paymentAmount =
      tempData[i].STR.substring(70, 85)?.trim() || undefined;

    if (tempData[i].STR.trim() != '') {
      data.push({
        key: i,
        articleNumber: tempData[i].artnr,
        billDate: bill_date
          ? date.extractDate(bill_date, 'DD/MM/YY')
          : undefined,
        billNumber: bill_number,
        billReceiver: bill_receiver,
        arAmount: parseInt(arAmount) || arAmount,
        paymentAmount: parseInt(paymentAmount) || paymentAmount,
        payForeignAmount: parseInt(payForeignAmount) || 0,
        currency: tempData[i].STR.substring(161, 165),
        paymentArticle: tempData[i].STR.substring(85, 105),
        paymentDate: paymetnDate
          ? date.extractDate(paymetnDate, 'DD/MM/YY')
          : undefined,
        id: tempData[i].STR.substring(117, 119),
        paymentRemark: tempData[i].STR.substring(119, 150),
        totalPayment: parseInt(tempData[i].sbetrag) || undefined,
        invoiceNo: tempData[i]['inv-no'],
      });
    }
  }
  return data;
}
// AR Payment
export function reformPaymentData(tempData: any[]) {
  return tempData.map(
    (data, index) =>
      ({
        key: index,
        billName: data.billname,
        billNumber: data.rechnr,
        billDate: date.extractDate(data.rgdatum, 'DD/MM/YY'),
        arAmount: data.debt,
        paymentAmount: data.credit,
        balance: data['tot-debt'],
        referenceNumber: data.refno,
        remark: data.remarks,
        roomNumber: data.zinr,
        id: data['user-init'],
        guestName: data.gastname,
        arForeignAmount: data['debt-foreign'],
        currency: data.currency,
        voucherNumber: data['vouc-nr'],
        billReceiverAddress: data['b-resname'],
        balanceOri: data['tot-debt'],
        selected: data.selected,
        recid: data['ar-recid'],
        counter: data.counter,
        gastnr: data.gastnr,
        gastnrmember: data.gastnrmember,
        billDateOri: data.rgdatum,
        debt: data.debt,
        foreignDebt: data['debt-foreign'],
        creditOri: data.credit,
        prevdate: data.prevdate,
        bresname: data['b-resname'],
        cidate: data['ci-date'],
        codate: data['co-date'],
      } as ResPaymentDebtPayList & { key: number })
  );
}

export function reformArticle(tempData: any[], caseType: any) {
  const data = [];
  for (let i = 0; i < tempData.length; i++) {
    const dataArticle = tempData[i];
    if ((dataArticle.artart == 4 && caseType == '23') || caseType == '13') {
      data.push({
        value: dataArticle.artnr,
        label: dataArticle.artnr + ' - ' + dataArticle.bezeich,
        article_name: dataArticle.bezeich,
        currency: dataArticle.betriebsnr,
      });
    }
  }
  return data;
}

export function reformOutletTransaction(tempData: any[]) {
  return tempData.map((data, index) => ({
    key: index,
    date: data.STR.substring(0, 8),
    tb_no: data.STR.substring(8, 12),
    bill_no: data.STR.substring(16, 21),
    art_no: data.STR.substring(22, 26),
    description: data.STR.substring(26, 54),
    department: data.STR.substring(54, 67),
    qty: data.STR.substring(70, 72),
    amount: data.STR.substring(72, 88),
    time: data.STR.substring(88, 96),
    id: data.STR.substring(96, 99),
  }));
}
export function reformFOTrans(dataTable) {
  const data = dataTable.map((item, index) => ({
    rowKey: index,
    description: item.DESCRIPTION,
    amount: item.amount,
    article_number: item['art-no'],
    bill_number: item['bill-no'],
    date: item.datum ? new Date(item.datum) : undefined,
    department: item.departement,
    id: item.id,
    quantity: item.qty,
    room_number: item['room-no'],
    voucher_number: item['voucher-no'],
    time: item.zeit,
  }));
  return data;
}
export function reformWarung(tempData) {
  const data = tempData.map((data, index) => ({
    key: index,
    currency_no: data.waehrungsnr,
    currency_short_code: data.wabkurz,
    currency_description: data.bezeich,
    purchase_value: data.ankauf,
    sales_value: data.verkauf,
    last_update: data.geaendert,
    unit: data.einheit,
    travelers_check_rate: data['travelers-chk'],
    commision: data['cash-comm'],
    cheque: data['cheque-comm'],
    betriebsnr: data.betriebsnr,
  }));
  return data;
}
