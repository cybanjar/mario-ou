import { InjectionKey } from '@vue/composition-api';
import { ResLine } from '../common/common.model';

export interface PrepareRoomPlan {
  currDate: string;
  ciDate: string;
  roomList: RoomList[];
  reservations: RoomPlanReservation[];
  outOfOrders: OutOfOrder[];
}

export interface RoomPlan {
  roomList: RoomList[];
  reservations: RoomPlanReservation[];
  outOfOrders: OutOfOrder[];
}

export interface RoomList {
  ststr: string;
  etage: number;
  zinr: string;
  'c-char': string;
  'i-char': string;
  rmcat: string;
  connec: string;
  recid1: number[];
  gstatus: number[];
  room: string[];
  'off-mkt': boolean[];
}

interface RoomPlanReservation extends ResLine {
  'rec-id': number;
}

interface OutOfOrder {
  zinr: string;
  gespgrund: string;
  'rec-id': number;
}

export interface RoomColumn {
  name: string;
  startIndex: number;
  status: number;
  reservationId: number;
  colspan: number;
  tooltip: string;
}

export interface ReqRoomReservation {
  pvILanguage: number;
  currDate: string;
  i: number;
  zinr: string;
  gstatus: number;
  recid1: number;
}

export interface RoomReservation {
  nEdit: string;
  cEdit: string;
  flagOutorder: boolean;
  reservation?: {
    resstatus: number;
    'active-flag': number;
    zinr: string;
    recid1: number;
  };
}

export interface ReqChangeRoom {
  pvILanguage: number;
  recid1: number;
  movedRoom: string;
  ciDate: string;
}

export type RoomPlanProvider = {
  SHOW_DIALOG_ROOM_CHANGE: (
    reservation: RoomReservation['reservation']
  ) => void;
};

export const roomPlanKey: InjectionKey<RoomPlanProvider> = Symbol(
  'roomPlanKey'
);
