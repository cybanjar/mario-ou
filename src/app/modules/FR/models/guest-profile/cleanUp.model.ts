export interface ReqCleanUp {
  deltype: number;
  sorttype: number;
  adr1: string;
  city: string;
  cntry: string;
  email: string;
  lastStay: string;
  minSales: number;
  ageHistory: number;
}

export interface ResCleanUp {
  fAnz: number;
  dAnz: number;
}
