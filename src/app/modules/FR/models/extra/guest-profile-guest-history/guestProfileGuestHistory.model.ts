export interface SearchGuestProfileHistory {
  gastnr: string;
  fdate: string;
  tdate: string;
}

export interface GuestProfileHistory {
  gastnr: number;
  ankunft: string;
  abreise: string;
  zimmeranz: number;
  zikateg: string;
  zinr: string;
  erwachs: number;
  gratis: number;
  zipreis: number;
  arrangement: string;
  gesamtumsatz: number;
  bemerk: string;
  logisumsatz: number;
  argtumsatz: number;
  'f-b-umsatz': number;
  'sonst-umsatz': number;
  gastinfo: string;
  zahlungsart: number;
  abreisezeit: string;
  segmentcode: number;
  'zi-wechsel': boolean;
  resnr: number;
  gname: string;
  address: string;
  hname: string;
  's-recid': number;
  reslinnr: number;
  paymentMethod?: string;
}

export interface CreateGuestProfileHistory {
  gastnr: number;
  ankunft: string;
  abreise: string;
  zimmeranz: number;
  zikateg: string;
  zinr: string;
  erwachs: number;
  kind: number[];
  gratis: number;
  zipreis: number;
  arrangement: number;
  gesamtumsatz: number;
  bemerk: string;
  logisumsatz: number;
  argtumsatz: number;
  'f-b-umsatz': number;
  'sonst-umsatz': number;
  gastinfo: string;
  zahlungsart: number;
  'com-logis': number;
  'com-argt': number;
  'com-f-b': number;
  'com-sonst': number;
  guestnrcom: number;
  abreisezeit: string;
  segmentcode: string;
  'zi-wechsel': boolean;
  resnr: number;
  'ums-kurz': number;
  'ums-lang': number;
  reslinnr: number;
  betriebsnr: number;
}

export interface ReqHistoryList {
  caseType: number;
  gastNo: number;
  resNo: number;
  reslinNo: number;
  rmNo: string;
  arrive: string;
  depart: string;
}

export interface HistoryList {
  gastnr: number;
  ankunft: string;
  abreise: string;
  zimmeranz: number;
  zikateg: string;
  zinr: string;
  erwachs: number;
  kind: number[];
  gratis: number;
  zipreis: number;
  arrangement: number;
  gesamtumsatz: number;
  bemerk: string;
  logisumsatz: number;
  argtumsatz: number;
  'f-b-umsatz': number;
  'sonst-umsatz': number;
  gastinfo: string;
  zahlungsart: number;
  'com-logis': number;
  'com-argt': number;
  'com-f-b': number;
  'com-sonst': number;
  guestnrcom: number;
  abreisezeit: string;
  segmentcode: string;
  'zi-wechsel': boolean;
  resnr: number;
  'ums-kurz': number;
  'ums-lang': number;
  reslinnr: number;
  betriebsnr: number;
}

export interface GuestBill {
  rechnr: number;
  billnr: number;
  name: string;
  zinr: string;
  datum: string;
}

export interface BillDetail {
  rechnr: number;
  'bill-datum': string;
  artnr: number;
  anzahl: number;
  epreis: number;
  betrag: number;
  bezeich: string;
  zinr: string;
  fremdwbetrag: number;
  userinit: string;
  zeit: number;
  sysdate: string;
}
