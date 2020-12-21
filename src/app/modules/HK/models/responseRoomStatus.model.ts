interface ResZList {
  zinr: string;
  setup: number;
  zikatnr: number;
  etage: number;
  zistatus: number;
  CODE: string;
  'bediener-nr-stat': string;
  checkout: boolean;
  'str-reason': string;
  id: string;
  pic: string;
}

interface ResDescription {
  zinr: string;
  ind: number;
}

interface ResSetupList {
  nr: number;
  CHAR: string;
}

interface ResCategories {
  zikatnr: number;
  kurzbez: string;
  bezeichnung: string;
  maxzimanz: number;
  normalbeleg: number;
  overbooking: number;
  zimanzargt: any[];
  code: string;
  typ: number;
  verfuegbarkeit: boolean;
  zibelstat: boolean;
  'global-kat': boolean;
  active: boolean;
  betriebsnr: number;
}

export interface ResGetRoomStatus {
  zList: ResZList[];
  descriptions: ResDescription[];
  setupList: ResSetupList[];
  categories: ResCategories[];
}
