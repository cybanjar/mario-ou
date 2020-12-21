export interface ReqPaymentList {
  artSelected: number;
  billDate: string; // Format : "MM/DD/YY"
  billName: string;
}

export interface ResPaymentList {
  selected: boolean;
  'ap-recid': number;
  counter: number;
  'docu-nr': string;
  rechnr: number;
  'lief-nr': number;
  lscheinnr: string;
  supplier: string;
  rgdatum: string | null;
  rabatt: number;
  rabattbetrag: number;
  ziel: string | null;
  netto: number;
  'user-init': string;
  debt: number;
  credit: number;
  bemerk: string | null;
  'tot-debt': number;
  'rec-id': number;
  resname: string;
  comments: string | null;
}

export interface ReqPaymentArticle {
  ageList: {
    ['age-list']: ResPaymentList[];
  };
  outstand: number;
  rundung: number;
}

export interface ResPaymentArticle {
  artnr: number;
  departement: number;
  bezeich: string;
  artart: number;
}

export interface PaymentRecord {
  artnr: number;
  betrag: number;
  bezeich: string;
  dummy: string; // Empty value should be use space like this " "
  proz: number;
}

export interface ReqPaymentSettlePay {
  ageList: {
    ['age-list']: ResPaymentList[];
  };
  outstand: number;
  outstand1: number;
  payDate: string; // Format : "MM/DD/YY"
  payList: {
    ['pay-list']: PaymentRecord[];
  };
  remark: string; // Empty value should be use space like this " "
  rundung: number;
  userInit: string;
}
