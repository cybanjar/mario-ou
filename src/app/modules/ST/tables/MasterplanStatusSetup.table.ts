import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'No',
    field: 'number1',
    name: 'number1',
    align: 'left',
    sortable: false,
    style: 'width: 120px',
  },
  {
    label: 'Code',
    field: 'char1',
    name: 'char1',
    align: 'left',
    sortable: false,
    style: 'width: 120px',
  },
  {
    label: 'Description',
    field: 'char2',
    name: 'char2',
    align: 'left',
    sortable: false,
    style: 'width:90px',
  },
  {
    label: 'Type',
    field: 'number2',
    name: 'number2',
    align: 'left',
    sortable: false,
    style: 'width:90px',
  },
  {
    name: 'actions',
    field: 'actions',
    style: 'width: 10px',
  },
];
