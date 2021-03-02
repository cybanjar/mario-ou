import { TableHeader } from '~/components/VhpUI/typings';
import {fromStore, articelNumber} from '../utils/Params.InterStoreTf'
export const tableHeaders: TableHeader[] = [
    {
      label: 'Store',
      field: 'st',
      name: 'st',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Articel Number',
      field: 'artNumber',
      name: 'artNumber',
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
      label: 'Quanity',
      field: 'price',
      name: 'price',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Unit Price',
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
      label: 'Type of Moving',
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
        name: 'Department No',
        width: '145px',
        right: '20px',
        value: '',
        option: fromStore,
        
    },
    {
        name: 'Supplier No',
        width: '145px',
        right: '0px',
        value: '',
        option: fromStore,
        onClikc: '1'
    },
    {
        name: 'To Store',
        width: '145px',
        right: '20px',
        value: '',
        option: fromStore,
        onClikc: '2'
    },
    {
        name: 'Delivery Note',
        width: '145px',
        right: '0px',
        value: '',
        disable: true
    },
    {
        name: 'Articel Name',
        width: '145px',
        right: '20px',
        option: articelNumber,
        value: ''
    },
    {
        name: 'Quantity',
        width: '145px',
        right: '0px',
        value: ''
    },
  ]
  