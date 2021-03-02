import { ModuleAbbr } from '~/app/constants/module.constant';

type Param = {
  CODE: number;
  ACCESS_NR: number;
  J_TYPE: number;
  MODULE: string;
};

export const LEDGER_TYPE: Record<ModuleLedgerAbbr, Param> = {
  [ModuleAbbr.GL]: {
    CODE: 0,
    ACCESS_NR: 27,
    J_TYPE: 99,
    MODULE: 'general ledger',
  },
  [ModuleAbbr.AR]: {
    CODE: 2,
    ACCESS_NR: 27,
    J_TYPE: 99,
    MODULE: 'account receivable',
  },
  [ModuleAbbr.AP]: {
    CODE: 4,
    ACCESS_NR: 27,
    J_TYPE: 99,
    MODULE: 'account payable',
  },
};

export type ModuleLedgerAbbr = ModuleAbbr.GL | ModuleAbbr.AR | ModuleAbbr.AP;

export function ledgerType(type: ModuleLedgerAbbr): Param {
  // const name = type.toUpperCase();
  switch (type) {
    case ModuleAbbr.GL:
      return LEDGER_TYPE.GeneralLedger;
    case ModuleAbbr.AR:
      return LEDGER_TYPE.AccountsReceivable;
    case ModuleAbbr.AP:
      return LEDGER_TYPE.AccountsPayable;
    default:
      console.error(
        'Journal Type src from your modul not string or not registered please check at journalType from util/helpers/helper'
      );
      return undefined;
  }
}
