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
  changedDate?: string;
} & Trans;

export type Journal = {
  date: string;
  referenceNo: string;
  description: string;
  debits: number;
  credits: number;
  remaining: number;
};

export type TransTable = { key: number } & TransRecord;
export type JournalTrans = Journal & TransTable;
// mode: 'del' | 'save' | 'set' | 'capture'
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
