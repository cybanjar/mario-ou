import { TableActionHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatFromBL } from '~/app/helpers/formatterDate.helper';
import { TransTable } from '../../models/journal.model';
import { formatTime } from '../../helpers/utils';

// NOTE: Don't Change Order or Remove on Item In This List
export const journalTransColumns: TableActionHeader<TransTable>[] = [
  {
    label: 'Account Number',
    field: 'accNo',
    name: 'accountNo',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'accName',
    name: 'description',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Debit',
    field: 'debit',
    name: 'debit',
    align: 'left',
    format: (x) => formatterMoney(x),
    sortable: true,
  },
  {
    label: 'Credit',
    field: 'credit',
    name: 'credit',
    format: (x) => formatterMoney(x),
    align: 'left',
    sortable: true,
  },
  {
    label: 'Id',
    group: 'Before',
    field: 'id',
    name: 'id',
    align: 'left',
    headerStyle: 'top: 28px',
    sortable: true,
  },

  {
    label: 'Date',
    group: 'Before',
    field: 'created',
    headerStyle: 'top: 28px',
    name: 'created',
    format: (v) => (v == null ? '' : formatFromBL(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Time',
    group: 'Before',
    field: 'time',
    headerStyle: 'top: 28px',
    name: 'time',
    format: (v) => (v == null ? '' : formatTime(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Change By',
    group: 'After',
    field: 'changeBy',
    name: 'changeBy',
    align: 'left',
    headerStyle: 'top: 28px',
    sortable: true,
  },

  {
    label: 'Date',
    group: 'After',
    headerStyle: 'top: 28px',
    field: 'changedDate',
    name: 'changedDate',
    format: (v) => (v == null ? '' : formatFromBL(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Remark',
    field: 'remark',
    name: 'remark',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    field: 'actions',
  },
];

export const colShape = [
  [
    ...journalTransColumns
      .slice(0, 4)
      .map((value) => ({ ...value, height: 2 })),
    {
      label: 'Before',
      name: 'Before',
      width: 3,
    },
    {
      label: 'After',
      name: 'After',
      width: 2,
    },
    ...journalTransColumns.slice(9).map((value) => ({ ...value, height: 2 })),
  ],
  [
    ...journalTransColumns
      .slice(4, 9)
      .map((value) => ({ ...value, height: 2 })),
  ],
];
