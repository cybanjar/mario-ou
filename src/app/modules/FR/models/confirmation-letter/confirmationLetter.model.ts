/**
 * Only type key that will be used
 */

export interface ConfirmationLetter {
  resnr: number;
  grpflag: boolean;
  gastnr: number;
  name: string;
  vorname1: string;
  anrede1: string;
  anredefirma: string;
  briefnr: number;
  ankunft: string;
  anztage: number;
  abreise: string;
  kurzbez: string;
  resstatus: number;
  groupname: string;
  activeflag: number;
}
