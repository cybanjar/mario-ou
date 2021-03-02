import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Number',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Type',
    field: 'deptname',
    name: 'deptname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Amount',
    field: 'rechnr',
    name: 'rechnr',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Article',
    field: 'pax',
    name: 'pax',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Date',
    field: 'bezeich',
    name: 'bezeich',
    sortable: false,
  },
  {
    label: 'User',
    field: 'f-betrag',
    name: 'f-betrag',
    sortable: false,
  },
];
