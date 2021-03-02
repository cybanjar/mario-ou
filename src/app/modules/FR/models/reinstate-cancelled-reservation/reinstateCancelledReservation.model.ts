/**
 * Only type key that will be used
 */

export interface ReqSearchReinstateCancelledReservation {
  fresnr: number;
  fdate: string;
  fname: string;
}

export interface ReinstateCancelledReservation {
  resnr: number;
  rsvname: string;
  rsname: string;
  ankunft: string;
  abreise: string;
  resstatus: number;
  zimmeranz: number;
  kurzbez: string;
  erwachs: number;
  gratis: number;
  arrangement: string;
  zipreis: number;
  zinr: string | null;
  cancelled: string;
  'cancelled-id': string;
  address: string;
  city: string;
  bemerk: string;
}
