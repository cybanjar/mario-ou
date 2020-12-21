import { SelectItem } from '~/app/shared/models/select.model';

export interface FilterRef {
  fromDate: string;
  toDate: string;
  fromFibu: SelectItem | null;
  toFibu: SelectItem | null;
}

export interface CoaState {
  fromOptions: SelectItem[];
  toOptions: SelectItem[];
}

export type Props = {
  filters: {
    isPreparing: boolean;
    coaOptions: SelectItem[];
    mainAccounts: SelectItem[];
    departments: SelectItem[];
    mode: 'description' | 'remark';
    debit: string;
    credit: string;
  };
};
