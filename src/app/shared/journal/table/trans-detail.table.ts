import { TableActionHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatFromBL } from '~/app/helpers/formatterDate.helper';
import { TransTable } from '../../models/journal.model';
import { formatTime } from '../../helpers/utils';

// NOTE: Don't Change Order or Remove on Item In This List
export const transDetailColumns: TableActionHeader<TransTable>[] = [
  {
    label: 'Account Number',
    field: 'accNo',
    name: 'accNo',
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
    label: 'Remark',
    field: 'remark',
    name: 'remark',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Id',
    group: 'Before',
    field: 'id',
    name: 'id',
    headerStyle: 'top: 28px',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Date',
    group: 'Before',
    field: 'created',
    name: 'created',
    headerStyle: 'top: 28px',
    format: (v) => (v == null ? '' : formatFromBL(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Time',
    group: 'Before',
    field: 'time',
    name: 'time',
    headerStyle: 'top: 28px',
    format: (v) => (v == null ? '' : formatTime(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Change By',
    group: 'After',
    field: 'changeBy',
    name: 'changeBy',
    headerStyle: 'top: 28px',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Date',
    group: 'After',
    field: 'changedDate',
    name: 'changedDate',
    headerStyle: 'top: 28px',
    format: (v) => (v == null ? '' : formatFromBL(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Description',
    field: 'description',
    name: 'description',
    align: 'left',
    sortable: true,
  },
];

export const colShape = [
  [
    ...transDetailColumns.slice(0, 4).map((value) => ({ ...value, height: 2 })),
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
    ...transDetailColumns.slice(9).map((value) => ({ ...value, height: 2 })),
  ],
  [...transDetailColumns.slice(4, 9).map((value) => ({ ...value, height: 2 }))],
];
