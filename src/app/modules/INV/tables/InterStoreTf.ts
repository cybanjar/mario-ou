import { TableHeader } from '~/components/VhpUI/typings';
import {fromStore, articelNumber} from '../utils/Params.InterStoreTf'
export const tableHeaders: TableHeader[] = [
    {
      label: 'From Store',
      field: 'fs',
      name: 'fs',
      align: 'left',
      sortable: false,
    },
    {
      label: 'To Store',
      field: 'ts',
      name: 'ts',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Articel Number',
      field: 'artNumbers',
      name: 'artNumbers',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Description',
      field: 'des',
      name: 'des',
      align: 'left',
      sortable: false
    },
    {
      label: 'Unit Price',
      field: 'price',
      name: 'price',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Quantity',
      field: 'qty',
      name: 'qty',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Amount',
      field: 'price',
      name: 'price',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Date',
      field: 'date',
      name: 'date',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Created by',
      field: 'creattedBy',
      name: 'creattedBy',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Time',
      field: 'time',
      align: 'left',
      name: 'time',
      sortable: false,
    },
    { name: 'actions', field: 'actions' },
  ];
  

export const use_input = [
  {
      name: 'Trans-Code',
      width: '145px',
      right: '20px',
      value: '',
      disable: true,
    },
    {
      name: 'From Store',
      width: '145px',
      right: '20px',
      value: '',
      option: fromStore,
      onClikc: '1',
      disable: false,
    },
    {
      name: 'To Store',
      width: '145px',
      right: '20px',
      option: fromStore,
      value: '',
      disable: true,
      onClikc: '3'
  },
  {
      name: 'Articles Name',
      width: '145px',
      right: '20px',
      value: '',
      option: articelNumber,
      onClikc: '2'
  },
  {
      name: 'Quantity',
      width: '145px',
      right: '20px',
      value: ''
  },
]
