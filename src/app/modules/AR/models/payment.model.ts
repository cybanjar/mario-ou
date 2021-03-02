export interface ReqArtikelList {
  caseType: string | number;
  dept?: number;
  artNo?: string | number;
  actFlag?: boolean;
  artart?: number;
  aName?: string;
}

export interface PaymentRecord {
  artnr: number; // artnr: 3000
  bezeich: string; // bezeich: "A/R CLEARANCE"
  proz: number; // proz: 2
  betrag: number; // betrag: -750
  'f-amt': number; // f-amt: 0
  currency: number; // currency: 0
  'curr-str': string; // curr-str: "Rp"
  bemerk: string; // bemerk: ""
  'remain-amt': number; // remain-amt: -750
  'fremain-amt': number; // fremain-amt: 0
}

export interface ReqPaymentDebtPayList {
  artnr: number;
  userinit?: string;
  billNr?: string;
  tempArt2: number;
  billDate: string;
  billName?: string;
  toName?: string;
  billSaldo: string;
  artSelected: number;
  foutstand?: number;
  outstand?: string;
}

export interface ResPaymentDebtPayList {
  billName: string;
  billNumber: string;
  billDate: Date;
  arAmount: string;
  paymentAmount: string;
  balance: string;
  referenceNumber: number;
  remark: string;
  roomNumber: string;
  id: string;
  guestName: string;
  arForeignAmount: string;
  currency: string;
  voucherNumber: string;
  billReceiverAddress: string;
  balanceOri: number;
  selected: string;
  recid: number;
  counter: string;
  gastnr: string;
  gastnrmember: string;
  billDateOri: string;
  debt: string;
  foreignDebt: string;
  creditOri: string;
  prevdate: string;
  bresname: string;
  cidate: string;
  codate: string;
}
export interface ResArtikelBaseList {
  artart: number;
  artnr: number;
  bezeich: string;
  departement: number;
}

export interface ResArtikelList extends ResArtikelBaseList {
  zwkum: number;
  endkum: number;
  epreis: number;
  autosaldo: true;
  kassarapport: false;
  bezaendern: false;
  fibukonto: number;
  'mwst-code': number;
  'service-code': number;
  umsatzart: number;
  bezeich1: string;
  bezeich2: string;
  bezeich3: string;
  bezeich4: string;
  aposit: number;
  anzpunkte: number;
  artgrp: number;
  position: string;
  reservieren: false;
  blockcheck: false;
  resart: true;
  masseurres: false;
  autofakt: false;
  preistabelle: false;
  anwdauer: number;
  ruhedauer: number;
  reinigung: number;
}

export interface ReqPaymentRec {
  artnr: number; // 3000
  bezeich: string; // "A/R CLEARANCE"
  proz: number; // 100
  betrag: number; // -75000
  'f-amt': number; // 0
  currency: number; // 0
  'curr-str': string; // "Rp"
  bemerk: string; // ""
  'remain-amt': number; // -75000
  'fremain-amt': number; // 0
}

export interface ReqSettlePaymentDebt {
  pvILanguage: string; // '1';
  outstand1: number; // 100000;
  foutstand1: number; // 0;
  outstand: number; // 88000;
  currArt: number; // 1;
  rundung: number; // 0;
  foutstand: number; // 0;
  payDate: string; // '01/14/19';
  balance: number; // -12000;
  fbalance: number; // 0;
  userInit: string; // '01';
  ageList: {
    'age-list': ResPaymentDebtPayList[];
  };
  payList: {
    'pay-list': PaymentRecord[];
  };
}

export interface ResSettlePaymentDebt {
  fFlag: number; //0
  msgStr: string; //'';
  outputOkFlag: string; //true;
}
