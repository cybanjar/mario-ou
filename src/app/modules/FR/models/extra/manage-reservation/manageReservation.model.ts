export interface PrepareManageReservation {
  gastnr: number;
  name: string;
  vorname1: string;
  anredefirma: string;
  anrede1: string;
  adresse1: string;
  adresse2: string;
  land: string;
  wohnort: string;
  plz: string;
}

export const enum ReservationType {
  All = 1,
  Reservation = 2,
  InHouse = 3,
  ArrivalToday = 4,
}

export interface ReservationListData {
  resnr: number;
  zimanz: number;
  ankunft: string;
  abreise: string;
  segm: number;
  deposit: number;
  until: string;
  paid: number;
  id1: string;
  id2: string;
  'id2-date': string;
  groupname: string;
  grpflag: boolean;
  bemerk: string;
  voucher: string;
  vesrdepot2: string;
  arrival: boolean;
  resident: boolean;
  'arr-today': boolean;
  'l-zuord3': number;
  resstatus: number;
}

export interface ReservationMemberData {
  resnr: number;
  name: string;
  abreise: string;
  zinr: string;
  kurzbez: string;
  zipreis: number;
  arrangement: string;
  erwachs: number;
  gratis: number;
  kind1: number;
  kind2: number;
  ankunft: string;
  resstatus: number;
  zimmeranz: number;
  anztage: number;
  'changed-id': string;
  changed: string;
  'l-zuord3': number;
  ratecode: string;
  reslinnr: number;
  'kontakt-nr': number;
  bemerk: string;
}
