/**
 * Only type key that will be used
 */

export interface ReqGroupCheckIn {
  languageCode: number;
  ciDate: string;
}

export interface GroupCheckIn {
  resnr: number;
  gastnr: number;
  name: string;
  zimanz: number;
  ci: number;
  co: number;
  arr: number;
  abreise: string;
  segm: number;
  deposit: number;
  until: string | null;
  paid: number;
  groupname: string;
  'res-address': string;
  'res-city': string;
  'res-bemerk': string;
}
