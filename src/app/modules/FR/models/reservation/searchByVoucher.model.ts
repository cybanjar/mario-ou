/**
 * Only type key that will be used
 */

export interface ReqSearchByVoucher {
  voucherNo: string;
  fname: string;
}

export interface MainReservation {
  NAME: string;
  vesrdepot: string;
  resnr: number;
}

export interface ReservationMember {
  'ta-name': string;
  gname: string;
  resnr: number;
  voucher: string;
}

export interface ResSearchByVoucher {
  mainReservations: MainReservation[];
  reservationMembers: ReservationMember[];
}
