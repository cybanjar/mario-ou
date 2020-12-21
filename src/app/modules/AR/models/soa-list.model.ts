export interface ResSoaListPrepare {
  currDate: string;
  foreignRate: string;
  priceDecimal: number;
  localCurr: string;
  p417: string;
  foreignCurr: string;
  dollarRate: number;
  currDay: string;
}

export interface ReqSoaList {
  showType: number; // Default Value 0
  bofMonth?: string; // Default Value ? (tipde data = date)
  eofMonth?: string; // Value ? [tipde data = date]
  paramAr: {
    paramNr: number; // No
    paramName: string; // Description
    paramVal: string; // Value (tipe data character)
    paramType: string; // Tipe data character
  };
  guestno: number; //Guest No, di dapat dari API disp-debitorbl.p
  currDay: string; //Didapat dari curr-day pada service prepare-ar-printsoabl
}
export interface ResSoaList {
  counter: number; // Tipe data integer
  debref: number; // Tipe data integer
  'done-step': number; // Tipe data integer
  artno: number; // Tipe data integer
  versdep: number; // Tipe data decimal
  'to-sort': number; // Tipe data integer
  outlet: number; // Tipe data logical
  datum: string; // Tipe data date, Table Head “Date”
  ankunft: string; // Tipe data date
  abreise: string; // Tipe data date

  gastnr: number; // Tipe data integer
  name: string; // Tipe data char, Table Head “Guest Name”
  'inv-str': string; // Tipe data char, Table Head “Invoice No”
  rechnr: number; // Tipe data integer, Table Head “BillNo’
  refno: number; // Tipe data integer
  voucherNo: number; // Tipe data integer, Table Head “Reference”
  voucherNo1: number; // Tipe data integer
  voucherNo2: number; // Tipe data integer
  saldo: number; // Tipe data decimal, Table Head “Balance”
  fsaldo: number; // Tipe data decimal, Table Haed “Foreign”
  printed: string; // Tipe data logical, Table Head “Printed’
  selected: string; // Tipe data logical, Table Head “Selected”
  printdate: string; // Tipe data date, initial today
  dptnr: number; // Tipe data integer, Table Head “Dept”
  debt: number; // Tipe data decimal, Table Head “Debt”
  credit: number; // Tipe data decimal, Table Head “Credit”
  fdebt: number; // Tipe data decimal, Table Head “FDebt”
  fcredit: number; // Tipe data decimal, Table Head “FCredit”
  remarks: number; // Tipe data char, Table Head “Remarks”
  arRecid: number; // Tipe data integer
  newPayment: number; // Tipe data decimal
  newfPayment: number; // Tipe data decimal
  zinr: string; // Tipe data char
  erwachs: number; // Tipe data integer
  child1: number; // Tipe data integer
  child2: number; // Tipe data integer
  roomrate: number; // Tipe data decimal
  'tot-amount': number; // Tipe data decimal
  'tot-balance': number; // Tipe data decimal
  exrate: number; // Tipe data decimal
  'tot-exrate': number; // Tipe data decimal
  'gst-tot-non-taxable': number; // Tipe data decimal
  'gst-amount': number; // Tipe data decimal
  'gst-tot-sales': number; // Tipe data decimal
  zimmeranz: number; // Tipe data integer
  'rech-nr': number; // Tipe data integer
  'bet-nr': number; // Tipe data integer
  'msg-int': number; // Tipe data integer
}
