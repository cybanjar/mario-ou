export interface SearchPurchaseOrder {
  status: number;
  date: { start: Date; end: Date };
  user: string | null;
  documentNumber: string;
  department: number | null;
  supplier: number | null;
  displayAllSupplier: boolean;
  billDate: Date | null;
}

export interface ResUser {
  nr: number;
  permissions: string;
  userinit: string;
  username: string;
}

export interface ResDepartment {
  nr: number;
  bezeich: string;
}

export interface ReqPreparePurchaseOrderList {
  casetype: number;
  pvILanguage: string;
  currDate: string;
  progName: string;
}

export interface ResPreparePurchaseOrderList {
  users: ResUser[];
  department: ResDepartment[];
  billDate: string;
}

export interface ReqPurchaseOrderList {
  stattype: number;
  fromDate: string; // Format : "MM/DD/YY"
  toDate: string; // Format : "MM/DD/YY"
  usrname: string; // Empty value should be use space like this " "
  poNumber: string; // Empty value should be use space like this " "
  deptnr: number; // Empty value should be use -1
  tLiefNo: number | string; // Empty value should be use empty string or space
  allSupp: boolean;
  billdate: string; // Format : "MM/DD/YY"

  // This 3 keys is used with the default value because its doesn't get any data from Form Data
  // If this 3 keys already got data from Form Data, remove this comments
  dmlOnly: boolean; // Used default value : false
  lastDocNr: string; // Used default value : ' '
  sorttype: number; // Used default value : 1
}

export interface ResPurchaseOrderList {
  bestellart: string;
  bestelldatum: string;
  bezeich: string;
  'docu-nr': string;
  firma: string;
  gedruckt: string | null;
  'l-order-gedruckt': string | null;
  'l-order-lieferdatum': string | null;
  'l-orderhdr-besteller': string;
  'l-orderhdr-lieferdatum': string;
  'lief-fax-1': string;
  'lief-fax-2': string;
  'lief-fax-3': string;
  'lief-nr': number;
  'lieferdatum-eff': string | null;
  wabkurz: string;
  zeit: number;
}

export interface ReqPurchaseOrderDetail {
  userInit: string;
  docuNr: string;
}

export interface ResPurchaseOrderDetail {
  artnr: number;
  bezeich: string;
  'lief-fax': string[];
  txtnr: number;
  anzahl: number;
  geliefert: number;
  einzelpreis: number;
  warenwert: number;
  'lieferdatum-eff': string | null;
  'angebot-lief': number[];
  masseinheit: string;
  quality: string;
  pos: number;
  remark: string;
  jahrgang: number;
}
