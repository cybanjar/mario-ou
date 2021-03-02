export interface ViewRates {
  prcode: string;
  'desc-prcode': string;
  currency: string;
  market: string;
  argt: string;
  rmtype: string;
}

export interface ViewRatesDetail {
  prcode: string;
  rmtype: string;
  datum: string;
  'str-aci': string;
  aci: string;
  'str-rate-aci': string;
  'adult-rate': string;
  'child-rate': string;
  'infant-rate': string;
}

export interface ReqViewRates {
  pvILanguage: number;
  gastnr: number;
  prCode: string;
  marketCombo: string;
}

export interface ResViewRates {
  remark: string;
  viewRates: ViewRates[];
  viewRatesDetail: ViewRatesDetail[];
}

export type TableViewRates = ViewRates & { details: ViewRatesDetail[] };
