import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { formatFromBL } from '~/app/helpers/formatterDate.helper';
import { formatTime } from '../helpers/reformData.helper';

// NOTE: Don't Change Order or Remove on Item In This List
export const transEditColumns: TableHeader[] = [
  {
    label: 'Account Number',
    field: 'accountNo',
    name: 'accountNo',
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
  {
    label: 'Debit',
    field: 'debit',
    name: 'debit',
    align: 'left',
    format: formatterMoney,
    sortable: true,
  },
  {
    label: 'Credit',
    field: 'credit',
    name: 'credit',
    format: formatterMoney,
    align: 'left',
    sortable: true,
  },
  {
    label: 'Id',
    field: 'id',
    name: 'id',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Date',
    field: 'created',
    name: 'created',
    format: (v) => (v == null ? '' : formatFromBL(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Time',
    field: 'time',
    name: 'time',
    format: (v) => (v == null ? '' : formatTime(v)),
    align: 'left',
    sortable: true,
  },

  {
    label: 'Change By',
    field: 'changeBy',
    name: 'changeBy',
    align: 'left',
    sortable: true,
  },

  {
    label: 'Date',
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
];
