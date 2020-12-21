export interface SearchOutstandingAndBalance {
  supplierName: string | null;
  date: { start: Date; end: Date };
  sortType: number;
  type: number;
}

export interface ReqAPList {
  lastname: string; // Empty value should be use space like this " "
  fromDate: string; // Format : "MM/DD/YY"
  toDate: string; // Format : "MM/DD/YY"
  sorttype: number;
  type1: number;
  priceDecimal: string; // Empty value should be use empty string or space
}

export interface ResAPList {
  betriebsnr: number;
  'ap-recid': number;
  'curr-pay': number;
  lscheinnr: string;
  STR: string;
  firma: string;
  billdate: string | null;
  docunr: string;
  delivnote: string;
  amount: number;
  'paid-amount': number;
  paiddate: string;
  balance: number;
  duedate: string | null;
  desc1: string;
}

export interface APList extends ResAPList {
  key: number;
}

export interface ReqStockItemList {
  fdate: string;
  tdate: string;
  sname: string;
  longDigit: boolean;
  showPrice: boolean;
}

export interface ResStockItemList {
  dDate: string | null;
  iSt: number;
  sDocument: string;
  delivnote: string;
  iArticle: number;
  sDesc: string;
  dQuantity: number;
  sAmount: string;
  price: number;
  itime: string;
  sSuplier: string;
  sSupplier: string;
  sNote: string;
  iMark: number;
}

export interface ReqDisplayPayment {
  apRecid: number;
}

export interface ResDisplayPayment {
  netto: number;
  zahlkonto: number;
  bezeich: string;
  rgdatum: string;
  saldo: number;
  username: string;
}
