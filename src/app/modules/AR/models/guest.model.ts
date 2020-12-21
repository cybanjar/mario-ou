export interface ReqGuestList {
  caseType: number;
  sorttype: number;
  fname: string;
  lname: string;
}

export interface ResGuestList {
  'akt-gastnr': number;
  karteityp: number;
  'master-gastnr': number;
  'pr-flag': number;
  'mc-flag': boolean;
  gname: string;
  adresse: string;
  steuernr: string;
  firma: string;
  namekontakt: string;
  phonetik3: string;
  rabatt: number;
  endperiode: string;
  'firmen-nr': number;
  land: string;
  wohnort: string;
  telefon: string;
  plz: string;
  geschlecht: string;
  'ausweis-nr1': string;
  gastnr: number;
  zahlungsart: number;
  kreditlimit: number;
  bezeich: string;
  alertbox: false;
  warningbox: false;
}

export interface GuestRecord {
  name: string;
}
