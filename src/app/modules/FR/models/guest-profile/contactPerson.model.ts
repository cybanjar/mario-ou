/**
 * Only type key that will be used
 */

/**
 * Contact Person Individual Interface
 */

export interface PrepareContactPerson {
  fTitle: string;
  guestContact: GuestContact[];
  relationOptions: RelationOptions[];
}

export interface GuestContact {
  name: string;
  vorname: string;
  anrede: string;
  segmentcode: number;
  gastnr: number;
  Kategorie: number;
  'kontakt-nr': number;
  funktion: string;
  nation2: string;
  'ausweis-art': string;
  'ausweis-nr1': string;
  geburtdatum1: string;
  'geburt-ort1': string;
  'pass-aust1': string;
  'email-adr': string;
  'v-titel': string;
  'a-titel': string;
  briefanrede: string;
  fax: string;
  telefon: string;
  'telefon-privat': string;
  'p-bezeich': string;
  'rec-id': number;
  email: string;
  nat: string;
  abteilung: string;
  sprachcode: number;
  durchwahl: string;
  hauptkontakt: boolean;
  'pers-bez': number;
  betriebsnr: number;
  'fax-privat': string;
  'betrieb-gast': number;
}

export interface RelationOptions {
  number1: number;
  char1: string;
}

export interface CreateContactPerson {
  gastnr: number;
  name: string;
  vorname: string;
  email: string;
  nat: string;
  anrede: string;
  nation2: string;
  'ausweis-art': string;
  'ausweis-nr1': string;
  geburtdatum1: string;
  'geburt-ort1': string;
  segmentcode: number;
  'pass-aust1': string;
  'pers-bez': number;
  'email-adr': string;
  'v-titel': string;
  'a-titel': string;
  briefanrede?: string;
  fax: string;
  telefon: string;
  'telefon-privat': string;
  'p-bezeich': string;
}

/**
 * Contact Person Company and Agent Interface,
 *
 * note:
 * CP = Contact Person
 */

export interface CPCompanyTravel {
  gastnr: number;
  Kategorie: number;
  'kontakt-nr': number;
  name: string;
  vorname: string;
  funktion: string;
  abteilung: string;
  sprachcode: number;
  anrede: string;
  nation2: string;
  'ausweis-art': string;
  'ausweis-nr1': string;
  geburtdatum1: string;
  'geburt-ort1': string;
  segmentcode: number;
  'pass-aust1': string;
  durchwahl: string;
  hauptkontakt: boolean;
  'pers-bez': number;
  betriebsnr: number;
  'email-adr': string;
  'v-titel': string;
  'a-titel': string;
  briefanrede: string;
  fax: string;
  telefon: string;
  'telefon-privat': string;
  'fax-privat': string;
  'betrieb-gast': number;
}
