/**
 * Only type key that will be used
 */
export interface ReqHTParam0 {
  casetype: number;
  inpParam: number;
}

export interface HTParam0 {
  flogical: string;
  fdate: string;
  fchar: string;
  fint: number;
  fdec: number;
}

export interface ReadQueasy {
  char1: string;
  char2: string;
  number1: number;
}

export interface GCFNation {
  kurzbez: string;
  bezeich: string;
}

export interface ReqLoadArtikel {
  caseType: number;
  deptNo: number;
}

export interface Artikel {
  artnr: number;
  departement: number;
  bezeich: string;
  artart: number;
}

export interface VIPSegment {
  segmentcode: number;
  bezeich: string;
}

export interface BookSource {
  'source-code': number;
  bezeich: string;
}

export interface SalesId {
  userinit: string;
  username: string;
}

export interface RoomType {
  zikatnr: number;
  kurzbez: string;
  bezeichnung: string;
}
