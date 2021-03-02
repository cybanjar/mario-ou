/**
 * Only type key that will be used
 */

import { InjectionKey } from '@vue/composition-api';
import { DialogGuestProfileProps } from '../common/dialogGuestProfile.model';

export enum GuestProfileType {
  Individual = 0,
  Company = 1,
  TravelAgent = 2,
}

export enum SearchBy {
  GuestName = 1,
  GuestNumber = 2,
  GuestNumberCard = 3,
  GuestIDCard = 4,
  CompanyName = 5,
  CompanyNumber = 6,
  CompanyMembershipCard = 7,
  TravelAgentName = 8,
  TravelAgentNumber = 9,
  TravelAgentMembershipCard = 10,
}

export interface ReqSearchGuestProfile {
  caseType: number;
  sorttype: GuestProfileType;
  lname: string;
  fname: string;
  num1: number;
}

export interface ResSearchGuestProfile {
  currLname: string;
  totalRecord: number;
  data: GuestProfile[];
}

export interface GuestProfile {
  gname: string;
  adresse: string;
  steuernr: string;
  namekontakt: string;
  phonetik3: string;
  endperiode: string | null;
  land: string;
  wohnort: string;
  telefon: string;
  geschlecht: string;
  gastnr: number;
  zahlungsart: number;
  karteityp: GuestProfileType;
  plz: string;
  'ausweis-nr1': string;
  paymentMethod?: string;
}

export type GuestProfileListProvider = {
  GET_GUEST_PROFILE_LIST: () => Promise<void>;
  SHOW_DIALOG_GUEST_PROFILE: (data: DialogGuestProfileProps) => void;
};

export const guestProfileListKey: InjectionKey<GuestProfileListProvider> = Symbol(
  'guestProfileListKey'
);
