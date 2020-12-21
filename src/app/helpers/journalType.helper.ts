import { ModuleAbbr } from '~/app/constants/module.constant';

export type ModuleJournalAbbr = ModuleAbbr.AR | ModuleAbbr.AP;

type ModParams = {
  code: number; // journaltype
  accessNr: number;
  jType: number;
};

export const LEDGER_TYPE: Record<ModuleJournalAbbr, ModParams> = {
  [ModuleAbbr.AR]: {
    code: 2, // journaltype
    accessNr: 15,
    jType: 99,
  },
  [ModuleAbbr.AP]: {
    code: 4,
    accessNr: 25,
    jType: 99,
  },
};

export function journalType(type: ModuleJournalAbbr): ModParams {
  // const name = type.toUpperCase();
  switch (type) {
    case ModuleAbbr.AR:
      return LEDGER_TYPE.AccountsPayable;
    case ModuleAbbr.AP:
      return LEDGER_TYPE.AccountsReceivable;
  }
}
