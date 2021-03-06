import { TableHeader } from '~/components/VhpUI/typings';
import {departement, dataToDepartement} from '../utils/params.interkitchen'
export const tableHeaders: TableHeader[] = [
    {
        label: 'Articel Number',
        field: 'art',
        name: 'art',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Quantity',
        field: 'value',
        name: 'value',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Description',
        field: 'des',
        name: 'des',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Unit Price',
        field: 'price',
        name: 'price',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Amount',
        field: 'amount',
        name: 'amount',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Number',
        field: 'no',
        name: 'no',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Bill Date',
        field: 'date',
        name: 'date',
        align: 'left',
        sortable: false,
    },
    {
        label: 'Time',
        field: 'time',
        name: 'time',
        align: 'left',
        sortable: false,
    }
]

export const use_input = [
    {
        name: 'User',
        width: '160px',
        right: '50px',
        value: '01 sindata',
        disable: true,
        top: '-10px'
    },
    {
        name: 'From Departement',
        width: '160px',
        right: '20px',
        value: '',
        option: departement
    },
    {
        name: 'To Departement',
        width: '160px',
        right: '20px',
        option: departement,
        value: ''
    },
    {
        name: 'Articel Name',
        width: '160px',
        right: '20px',
        value: '',
        option: dataToDepartement
    },
    {
        name: 'Quantity',
        width: '160px',
        right: '20px',
        value: ''
    },
]

export const table_modal1 = [
    {
      label: 'Cost Center Name',
      field: 'datum',
      name: 'datum',
      align: 'left',
      sortable: false,
    },
  ]
  export const table_modal2 = [
    {
      label: 'Account Number',
      field: 'datum',
      name: 'accountnumber',
      align: 'left',
      sortable: false,
    },
    {
      label: 'Description',
      field: 'description',
      name: 'description',
      align: 'left',
      sortable: false,
    },
  ]