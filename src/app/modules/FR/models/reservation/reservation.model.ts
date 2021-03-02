/**
 * Only type key that will be used
 */

import { InjectionKey } from '@vue/composition-api';
import { GuestProfileType } from '../guest-profile/guestProfile.model';

export interface PrepareReservation {
  longStay: number;
  ciDate: string;
  fdate1: string;
  fdate2: string;
  p297: number;
}

export enum ReservationStatus {
  Reservation = 1,
  OnlinePreCheckin = 5,
  InHouseGuest = 2,
  ExpectedArrival = 3,
  ExpectedDeparture = 4,
}

export enum SearchBy {
  GuestName = 1,
  ReservationName = 2,
  ReservationNumber = 3,
  Date = 4,
  RoomNumber = 5,
}

export interface ReqSearchReservation {
  showRate: boolean;
  lastSort: SearchBy;
  lresnr: number;
  longStay: number;
  ciDate: string;
  grpFlag: boolean;
  room: string;
  lname: string;
  sorttype: ReservationStatus;
  fdate1: string | null;
  fdate2: string | null;
  fdate: string | null;
}

export interface Reservation {
  resnr: number;
  reslinnr: number;
  'rsv-name': string;
  zinr: string;
  'setup-list-char': string;
  'resline-name': string;
  'waehrung-wabkurz': string;
  segmentcode: number;
  ankunft: string;
  abreise: string;
  zimmeranz: number;
  kurzbez: string;
  arrangement: string;
  zipreis: number;
  anztage: number;
  erwachs: number;
  kind1: number;
  kind2: number;
  gratis: number;
  'l-zuordnung4': number;
  resstatus: number;
  'l-zuordnung3': number;
  'flight-nr': string;
  ankzeit: number;
  abreisezeit: number;
  'betrieb-gast': number;
  resdat: string;
  useridanlage: string;
  'reserve-dec': number;
  'cancelled-id': string;
  'changed-id': string;
  groupname: string;
  address: string;
  city: string;
  comments: string;
  gastnrmember: number;
  karteityp: GuestProfileType;
  'active-flag': number;
  'recid-resline': number;
  'zinr-bgcol': number;
  pseudofix: boolean;
  verstat: number;
}

export type ReservationProvider = {
  SET_RESERVATION_LIST: (
    callback: (data: Reservation[]) => Reservation[]
  ) => void;
  SHOW_DIALOG_QUEUEING_ROOMS: () => void;
};

export const reservationKey: InjectionKey<ReservationProvider> = Symbol(
  'reservation'
);

export interface SearchByVoucherProps {
  reservationStatus: ReservationStatus;
  reservationNumber: number;
}

export interface RefreshRoom {
  reihenfolge: number;
  flag: number;
  bezeich: string;
  anz: number;
}

export interface ReqRefreshRoom {
  path: string;
  ciDate: string;
  data: RefreshRoom;
}
