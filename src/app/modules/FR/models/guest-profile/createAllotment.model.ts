/**
 * Only type key that will be used
 */

export interface AllotmentList {
  kontignr: number;
  ankunft: string | null;
  abreise: string | null;
  zimmeranz: number;
  erwachs: number;
  arrangement: string;
  bemerk: string;
  kind1: number;
  rueckdatum: string | null;
  ruecktage: number;
  kontcode: string;
  ansprech: string;
  overbooking: number;
  resdat: string | null;
  kurzbez: string;
  userinit: string;
  zikatnr: number;
}

export interface Arrangement {
  argtnr: number;
  wabkurz: string;
  arrangement: string;
  'argt-bez': string;
}

export interface CreateAllotment {
  currMode: string;
  gastnr: number;
  zikatnr1: number;
  argt: string;
  ansprech: string;
  comments: string;
  kontcode: string;
  ankunft: string;
  abreise: string;
  zikatnr: number;
  zimmeranz: number;
  erwachs: number;
  kind1: number;
  overbooking: number;
  ruecktage: number;
  rueckdatum: string | null;
  kontignr: number;
}

export interface ResCheckResLine {
  itExist: string;
  resLineResnr: number;
  resLineName: string;
  resLineAnkunft: string | null;
  resLineAbreise: string | null;
}

export interface ReqGlobalAllotment {
  gastno: number;
  'inp-kontcode': string;
}

export interface GlobalAllotment {
  gastnr: number;
  gname: string;
}

export interface SaveGlobalAllotment {
  gastno: number;
  'inp-kontcode': string;
  gList: {
    'g-list': GlobalAllotment[];
  };
}
