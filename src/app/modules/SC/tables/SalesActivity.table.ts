import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Task Type',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Date',
    field: 'deptname',
    name: 'deptname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'From Time',
    field: 'rechnr',
    name: 'rechnr',
    sortable: false,
    align: 'left',
  },
  {
    label: 'To Time',
    field: 'pax',
    name: 'pax',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Priority',
    field: 'f-betrag',
    name: 'f-betrag',
    sortable: false,
  },
  {
    label: 'Scheduled With',
    field: 'f-cost',
    name: 'f-cost',
    sortable: false,
  },
  {
    label: 'Company',
    field: 'b-betrag',
    name: 'b-betrag',
    sortable: false,
  },
  {
    label: 'Regarding',
    field: 'b-cost',
    name: 'b-cost',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];
