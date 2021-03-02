import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Reservation Number',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Block ID',
    field: 'deptname',
    name: 'deptname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Block Code',
    field: 'rechnr',
    name: 'rechnr',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Start Date',
    field: 'pax',
    name: 'pax',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Master Plan Name',
    field: 'f-betrag',
    name: 'f-betrag',
    sortable: false,
  },
  {
    label: 'Sales',
    field: 'f-cost',
    name: 'f-cost',
    sortable: false,
  },
  {
    label: 'Nights',
    field: 'b-betrag',
    name: 'b-betrag',
    sortable: false,
  },
  {
    label: 'Status',
    field: 'b-cost',
    name: 'b-cost',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];
