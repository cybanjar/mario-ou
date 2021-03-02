/**
 * Only type key that will be used
 */

export enum SearchBy {
  Date = 1,
  ReservationNumber = 2,
}

export interface PrepareReservationByCreationDate {
  ciDate: string;
}

export interface ReqReservationByCreationDate {
  caseType: number;
  fromDate: string;
  toDate: string;
  resnr: number;
  gastnr: number;
  searchResno: number;
}

export interface MainReservation {
  resdat: string;
  resnr: number;
  name: string;
  groupname: string;
  depositgef: number;
  limitdate: string | null;
  depositbez: number;
  zahldatum: string | null;
  depositbez2: number;
  zahldatum2: string;
  useridanlage: string;
  mutdat: string | null;
  useridmutat: string;
  bemerk: string;
  resname: string;
  address: string;
  city: string;
}

export interface ReservationMember {
  name: string;
  ankunft: string;
  abreise: string;
  zinr: string;
  kurzbez: string;
  zipreis: number;
  arrangement: string;
  erwachs: number;
  gratis: number;
  zimmeranz: number;
  anztage: number;
  'changed-id': string;
  changed: string;
  resstatus: number;
}
