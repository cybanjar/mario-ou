import { GuestProfileType } from '../guest-profile/guestProfile.model';
import { Guest } from './common.model';
import { ModifyConfig } from './modify.model';

export interface DialogGuestProfileProps {
  type: GuestProfileType;
  guestNumber: number;
}

export type GuestProfileForm = Partial<Guest>;

export interface ModifyGuestProfile extends Guest {
  // Additional field on view data
  base64ImageFile: string;
  contractRate: string;
}

export interface TableHistory {
  ankunft: string;
  abreise: string;
  zinr: string;
  zipreis: number;
  kurzbez: string;
  bemerk: string;
}

export interface TableGuestContact {
  NAME: string;
  vorname: string;
  anrede: string;
}

export interface TableForecast {
  ankunft: string;
  abreise: string;
  zinr: string;
  kurzbez: string;
  zipreis: number;
}

export interface ReqPrepareModifyGuestProfile {
  guestNumber: number;
  change: boolean;
  type: GuestProfileType;
}

export interface PrepareModifyGuestProfile {
  modifyConfig: ModifyConfig;
  data: ModifyGuestProfile;
  history: TableHistory[];
  guestContact: TableGuestContact[];
  forecast: TableForecast[];
}

export const enum UploadIdCardType {
  Upload = 1,
  Delete = 2,
}

export interface ReqUploadIdCard {
  type: UploadIdCardType;
  guestNumber: number;
  data: string;
}

export interface MainSegment {
  segmentcode: number;
  segmentgrup: number;
  bezeich: string;
  bemerkung: string;
  betriebsnr: number;
  'vip-level': number;
}

export interface MainSegmentConfig {
  vipFlag1: boolean;
  mainscode: number;
  mainseg: number;
}
export interface ResMainSegment {
  config: MainSegmentConfig;
  options: MainSegment[];
  current: MainSegment[];
}

export interface ReqSaveMainSegment extends MainSegmentConfig {
  guestNumber: number;
  data: MainSegment[];
}
