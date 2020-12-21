import { TableHeader } from '~/components/VhpUI/typings';

const DEPARTMENTS = [
  'Housekeeping',
  'Engineering',
  'Off Market',
  'Housekeeping',
  'Engineering',
];

export const tableHeaders: TableHeader[] = [
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'roomNumber',
    align: 'left',
    headerStyle: 'width: 50px',
    sortable: true,
  },
  {
    label: 'Reason',
    field: 'gespgrund',
    name: 'reason',
    align: 'left',
    headerStyle: 'width: 220px',
    style: 'max-width: 220px',
    sortable: true,
  },
  {
    label: 'From Date',
    field: 'gespstart',
    name: 'fromDate',
    align: 'left',
    headerStyle: 'width: 50px',
    sortable: true,
  },
  {
    label: 'To Date',
    field: 'gespende',
    name: 'toDate',
    align: 'left',
    headerStyle: 'width: 50px',
    sortable: true,
  },
  {
    label: 'ID',
    field: 'userinit',
    name: 'userId',
    align: 'left',
    headerStyle: 'width: 50px',
    sortable: true,
  },
  {
    label: 'Department',
    field: 'ind',
    name: 'department',
    align: 'left',
    headerStyle: 'width: 110px',
    sortable: true,
    format: (col) => DEPARTMENTS[col - 1],
  },
  {
    label: 'Floor',
    field: 'etage',
    name: 'floor',
    align: 'left',
    headerStyle: 'width: 50px',
    sortable: true,
  },
  {
    label: 'Room Type',
    field: 'bezeich',
    name: 'roomType',
    align: 'left',
    headerStyle: 'width: 240px',
    sortable: true,
  },
  { name: 'actions', field: 'actions', headerStyle: 'width: 37px' },
];
