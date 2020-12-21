import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Account Number',
    field: 'fibukonto',
    name: 'fibukonto',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Account Name',
    field: 'glacct-bezeich',
    name: 'glacct-bezeich',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Main Account',
    field: 'glmain-bezeich',
    name: 'glmain-bezeich',
    sortable: true,
  },
  {
    label: 'Account Type',
    field: 'acc-type',
    name: 'acc-type',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Account Category',
    field: 'glfstype-bezeich',
    name: 'glfstype-bezeich',
    sortable: true,
  },
  {
    label: 'Operating Dept Account',
    field: 'gldepartment-bezeich',
    name: 'gldepartment-bezeich',
    sortable: true,
  },
  {
    label: 'Last Change By',
    field: 'bemerk',
    name: 'bemerk',
    sortable: true,
  },
  { name: 'actions', field: 'actions' },
];
