export interface ReservationRemark {
  resCom: string;
  reslCom: string;
  gCom: string;
  webCom: string | null;
}

export const enum ReservationRemarkMethod {
  Get = 1,
  Update = 2,
}

export interface ReqReservationRemark extends ReservationRemark {
  icase: ReservationRemarkMethod;
  resno: number;
  reslinno: number;
  userInit: string;
}
