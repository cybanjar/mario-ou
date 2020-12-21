export interface ResDispDebitor {
  gastnr: number;
  gname: string;
  city: string;
  gtype: number;
  aging: number;
}

export interface ReqDebitor {
  caseType: string;
  artNo: number;
}

export interface ResDebitor {
  artnr: number;
  departement: number;
  gastnr: number;
  rgdatum: string;
  opart: number;
  rechnr: number;
  saldo: number;
  gastnrmember: number;
  versanddat: null;
  zahlkonto: number;
  zinr: 'number';
  'bediener-nr': number;
  counter: number;
  mahnstufe: number;
  name: string;
  transzeit: number;
  'kontakt-nr': number;
  betriebsnr: number;
  vesrdep: number;
  vesrdat: null;
  vesrdepot: '';
  vesrdepotnumber: '';
  vesrcod: string;
  verstat: number;
  'betrieb-gast': number;
  'betrieb-gastmem': number;
  debref: number;
  'tb-recid': number;
}

export interface ReqWriteDebitor {
  caseType: number;
  tDebitor: {
    't-debitor': ResDebitor[];
  };
}

export interface ResWriteDebitor {
  outputOkFlag: boolean;
  successFlag: boolean;
}
