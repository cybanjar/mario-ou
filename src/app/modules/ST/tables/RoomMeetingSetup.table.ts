import { TableHeader } from '~/components/VhpUI/typings';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Code',
    field: 'Code',
    name: 'Code',
    align: 'left',
    sortable: false,
    style: 'width: 120px',
  },
  {
    label: 'Description',
    field: 'Description',
    name: 'Description',
    align: 'left',
    sortable: false,
    style: 'width:90px',
  },
  {
    label: 'Area Parent RM',
    field: 'Area',
    name: 'Area',
    align: 'left',
    sortable: false,
    style: 'width: 350px',
  },
  {
    label: 'Size m2',
    field: 'Size',
    name: 'Size',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Extention',
    field: 'Ext',
    name: 'Ext',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Persons',
    field: 'Persons',
    name: 'Persons',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Daily Rate',
    field: 'DailyRate',
    name: 'DailyRate',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Prepare',
    field: 'Prepare',
    name: 'Prepare',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Picture Name',
    field: 'PictureName',
    name: 'PictureName',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Change Description',
    field: 'ChangeDescription',
    name: 'ChangeDescription',
    align: 'left',
    sortable: false,
  },
  {
    name: 'actions',
    field: 'actions',
    style: 'width: 10px',
  },
];