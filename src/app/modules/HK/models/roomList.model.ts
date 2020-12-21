import { ResRoomList } from './responseRoomList.model';

export const displayStatuses: any[] = [
  'All',
  'Arrival',
  'Departure',
  'In-House',
  'Uncleaned',
  'Cleaned',
  'Arrived',
  'Departed',
];

export interface RoomListRow extends ResRoomList {
  guestNote: string;
  guestPax: string;
  statusIcons: any;
  rstat: string;
  ankunft: string;
  abreise: string;
}

export interface HistoryRow {
  abreise: string;
  ankunft: string;
  bemerk: string;
  gastnr: number;
  'zi-wechsel': boolean;
  zinr: string;
}
