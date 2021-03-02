import { GuestProfileType } from '../guest-profile/guestProfile.model';

export interface Guest {
  gastnr: number;
  karteityp: GuestProfileType;
  name: string;
  vorname1: string;
  anrede1: string;
  land: string;
  plz: string;
  wohnort: string;
  char1: string;
  telefon: string;
  nation1: string;
  nation2: string;
  beruf: string;
  'ausweis-nr1': string;
  'ausweis-nr2': string;
  geburtdatum1: string;
  geburtdatum2: string;
  'geburt-ort1': string;
  'geburt-ort2': string;
  bemerkung: string;
  logiernachte: number;
  'point-gastnr': number;
  zahlungsart: number;
  adresse1: string;
  adresse2: string;
  adresse3: string;
  fax: string;
  telex: string;
  geschlecht: string;
  kreditlimit: number;
  'mobil-telefon': string;
  'email-adr': string;
  namekontakt: string;
  phonetik3: string;
  'firmen-nr': number;
  anredefirma: string;
  cardnr: string;
  number1: number;
  steuernr: string;
  segment3: number;
}

export interface ResLine {
  resnr: number;
  'active-flag': number;
  'zimmer-wunsch': string;
  resstatus: number;
  name: string;
  ankunft: string;
  abreise: string;
}

export interface ReqReadHtparam {
  caseType: number;
  paramNo: number;
  paramGrup: number;
}

export interface ReadHtparam {
  fdate: string;
  flogical: boolean;
  finteger: number;
  fchar: string;
}
