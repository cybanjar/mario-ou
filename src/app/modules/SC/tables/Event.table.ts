import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Start Date',
    field: 'fdatum',
    name: 'fdatum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'End Date',
    field: 'tdatum',
    name: 'tdatum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'description',
    name: 'description',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Amount',
    field: 'amount',
    name: 'amount',
    align: 'right',
    sortable: false,
  },
  {
    label: 'Venue',
    field: 'venue',
    name: 'venue',
    sortable: false,
  },
  {
    label: 'Setup',
    field: 'setup',
    name: 'setup',
    sortable: false,
  },
  {
    label: 'Pax',
    field: 'pax',
    name: 'pax',
    sortable: false,
  },
  {
    label: 'Start Time',
    field: 'fttime',
    name: 'ftime',
    sortable: false,
  },
  {
    label: 'End Time',
    field: 'ttime',
    name: 'ttime',
    sortable: false,
  },
  {
    label: 'Type',
    field: 'type',
    name: 'type',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];
