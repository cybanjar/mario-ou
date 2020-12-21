export interface ResRoomList {
  abreise: string;
  'active-flag': number;
  ankunft: string;
  argt: string;
  arrival: true;
  arrtime: string;
  bemerk: string;
  cashBasis: false;
  company: string;
  deptime: string;
  etd: string;
  flag: number;
  floor: number;
  gastnrmember: number;
  gname: string;
  gstat: string;
  inactive: string;
  inhouse: false;
  kbezeich: string;
  location: string;
  nat: string;
  norms: number;
  pax: number;
  reslinnr: number;
  resnr: number;
  rmrate: number;
  rstat: string;
  'service-flag': false;
  spreq: string;
  'usr-id': string;
  vip: string;
  zinr: string;
  zistatus: number;
}

interface ResHistoryList {
  abreise: string;
  ankunft: string;
  bemerk: string;
  gastnr: number;
  'zi-wechsel': boolean;
  zinr: string;
}
