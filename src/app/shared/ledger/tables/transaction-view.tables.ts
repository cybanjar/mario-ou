import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatFromBL } from '~/app/helpers/formatterDate.helper';

export const viewTransColumns: TableHeader[] = [
  {
    label: 'Acct No',
    field: 'acctNo',
    name: 'acctNo',
  },
  {
    label: 'Debit',
    field: 'debit',
    format: formatterMoney,
    name: 'debit',
  },
  {
    label: 'Credit',
    field: 'credit',
    format: formatterMoney,
    name: 'credit',
  },
  {
    label: 'Note',
    field: 'note',
    name: 'note',
  },
  {
    label: 'User Id',
    field: 'userId',
    name: 'userId',
  },
  {
    label: 'System Date',
    field: 'systemDate',
    format: (v) => (v === null ? '' : formatFromBL(v)),
    name: 'systemDate',
  },
  {
    label: 'Change By',
    field: 'changeBy',
    name: 'changeBy',
  },
  {
    label: 'Change Date',
    field: 'changeDate',
    format: (v) => (v === null ? '' : formatFromBL(v)),
    name: 'changeDate',
  },
  {
    label: 'Description',
    field: 'description',
    name: 'description',
  },
];
