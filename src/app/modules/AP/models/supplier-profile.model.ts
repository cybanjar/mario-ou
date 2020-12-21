// Only type key that will be used in table column
export interface ResSupplierList {
  namekontakt: string;
  firma: string;
  wohnort: string;
  PLZ: string;
  telefon: string;
  fax: string;
  notizen: string[];
  'lief-nr': number;
  land: string;
  segment1: number;
  adresse1: string;
  adresse2: string;
  adresse3: string;
}

export interface ResCountry {
  nationnr: number;
  kurzbez: string;
  bezeich: string;
}

export interface ResSegment {
  betriebsnr: number;
  'l-bemerk': string;
  'l-bezeich': string;
  'l-segmentcode': number;
  'l-segmentgrup': number;
}

export interface ResSupplierTurnover {
  datum: string;
  gesamtumsatz: number;
  'lief-nr': number;
}
