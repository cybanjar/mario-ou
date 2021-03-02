import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Room',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Start Date',
    field: 'deptname',
    name: 'deptname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'End Date',
    field: 'rechnr',
    name: 'rechnr',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Quantity',
    field: 'pax',
    name: 'pax',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Arrangement',
    field: 'f-betrag',
    name: 'f-betrag',
    sortable: false,
  },
  {
    label: 'Rates',
    field: 'f-cost',
    name: 'f-cost',
    sortable: false,
  },
];
