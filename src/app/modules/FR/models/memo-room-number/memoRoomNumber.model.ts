/**
 * Only type key that will be used
 */

export interface ReqSearchMemoRoomNumber {
  memoZinr: string;
}

export interface MemoRoomNumber {
  memozinr: string;
  memodatum: string;
  NAME: string;
  ankunft: string;
  abreise: string;
  anztage: number;
  arrangement: string;
  zipreis: number;
  erwachs: number;
  kind1: number;
  resstatus: number;
  resnr: number;
}
