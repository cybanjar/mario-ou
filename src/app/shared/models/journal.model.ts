export type Trans = {
  jnr?: number;
  recid: string;
  accNo: string;
  accName: string;
  debit: number;
  credit: number;
  remark: string;
};

export type TransRecord = {
  recjournid?: string;
  id?: string;
  time?: string;
  created?: string;
  changeBy?: string;
  bemerk?: any;
  userinit?: any;
  sysdate?: any;
  description?: any;
  fibukonto?: any;
  chgdate?: any;
  zeit?: any;
  chginit?: any;
  bezeich?: any;
  changedDate?: string;
} & Trans;

export type Journal = {
  date: Date;
  referenceNo: string;
  description: string;
  debits?: number;
  credits?: number;
  remaining?: number;
};
export type TransTable = { key: number } & TransRecord;
export type JournalTrans = Journal & TransTable;
// mode: 'del' | 'save' | 'set' | 'capture'
export type SaveRecord = { mode: 'add' | 'chg' | 'del' } & JournalTrans;
type Mode = {
  del: TransTable;
  save: JournalTrans[];
  set: TransTable;
  capture: JournalTrans;
};

export type Validator = (
  mode: keyof Mode,
  records: any,
  scope?: string
) => Promise<boolean> | boolean;
