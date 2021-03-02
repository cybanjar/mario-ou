import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Description',
    field: 'briefnr',
    name: 'briefnr',
    align: 'left',
    sortable: false,
    style: 'width: 120px',
  },
  {
    label: 'Room',
    field: 'briefkateg',
    name: 'briefkateg',
    align: 'left',
    sortable: false,
    style: 'width:90px',
  },
  {
    label: 'Seating',
    field: 'briefbezeich',
    name: 'briefbezeich',
    align: 'left',
    sortable: false,
    style: 'width: 350px',
  },
  {
    label: 'Max Persons',
    field: 'fname',
    name: 'fname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Daily Rate',
    field: 'fname',
    name: 'fname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Extension',
    field: 'fname',
    name: 'fname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Prepare',
    field: 'fname',
    name: 'fname',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Visio Filename',
    field: 'fname',
    name: 'fname',
    align: 'left',
    sortable: false,
  },
  {
    name: 'actions',
    field: 'actions',
    style: 'width: 10px',
  },
];
