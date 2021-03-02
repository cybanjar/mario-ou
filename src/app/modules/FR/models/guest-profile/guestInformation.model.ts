/**
 * Only type key that will be used
 */

export interface ReqGuestInformartion {
  pvILanguage: number;
  gastnr: number;
}

export interface GuestInformation {
  payment: string;
  char1: string;
  char2: string;
  bemerkung: string;
  zimmeranz: number;
  logiernachte: number;
  stornos: number;
  noshows: number;
  'anlage-datum': string;
  'modif-datum': string;
  'erste-res': string;
  'letzte-res': string;
  'naechste-res': string;
  'f-b-umsatz': number;
  argtumsatz: number;
  'sonst-umsatz': number;
  resflag: number;
  gesamtumsatz: number;
  date1: string;
  date2: string;
  name?: string;
}

export interface RevenueBreakdown {
  rechnr: number;
  dept: number;
  datum: string;
  'dept-str': string;
  'food-str': string;
  'bev-str': string;
  'oth-str': string;
  rmno: string;
  rcat: string;
  'ci-str': string;
  'co-str': string;
}

export interface ResGuestInformation {
  guestInformation: GuestInformation;
  revenueBreakdown: RevenueBreakdown[];
}

export interface ReqOutletBill {
  caseType: string;
  billNo: string;
  artNo: string;
  dept: string;
  datum: string;
  waehrungNo: string;
}

export interface OutletBill {
  'bill-datum': string;
  artnr: number;
  anzahl: number;
  betrag: number;
  bezeich: string;
  epreis: number;
  zeit: number;
  waehrungsnr: number;
}
