import { TableHeader } from '~/components/VhpUI/typings';
export const tableHeaders: TableHeader[] = [
  {
    label: 'Date',
    field: 'datum',
    name: 'datum',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Delivery Number',
    field: 'lscheinnr',
    name: 'lscheinnr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'From Storage',
    field: 'f-bezeich',
    align: 'left',
    name: 'f-bezeich',
    sortable: false,
  },
  {
    label: 'To Storage',
    field: 'deptName',
    name: 'deptName',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Articel',
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Unit',
    field: 'einheit',
    name: 'einheit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Content',
    field: 'content',
    name: 'content',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Average Price',
    field: 'einzelpreis',
    align: 'left',
    name: 'einzelpreis',
    sortable: false,
  },
  {
    label: 'Quantity',
    field: 'qty',
    align: 'left',
    name: 'qty',
    sortable: false,
  },
  {
    label: 'Outgoing Quantity',
    field: 'qty1',
    align: 'left',
    name: 'qty1',
    sortable: false,
  },
  {
    label: 'Account Number',
    field: 'stornogrund',
    name: 'stornogrund',
    sortable: false,
    align: 'left',
  },
  {
    label: 'ID',
    field: 'ID',
    align: 'left',
    name: 'ID',
    sortable: false,
  },
  {
    label: 'Approved',
    align: 'left',
    field: 'appStr',
    name: 'invoice-nr',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];

export const tableDialogNew: TableHeader[] = [
  {
    label: 'Storage Number',
    field: 'storageNumber',
    name: 'storageNumber',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Articel Number',
    field: 'articelNumber',
    align: 'left',
    name: 'articelNumber',
    sortable: true,
  },
  {
    label: 'Description',
    field: 'des',
    align: 'left',
    name: 'des',
    sortable: true,
  },
  {
    label: 'Unit Price',
    field: 'unitPrice',
    align: 'left',
    name: 'unitPrice',
  },
  {
    label: 'Onhand',
    field: 'onhand',
    align: 'left',
    name: 'onhand',
  },
  {
    label: 'Quantity',
    align: 'left',
    field: 'quantity',
    name: 'quantity',
  },
  {
    label: 'Amount',
    align: 'left',
    field: 'amount',
    name: 'amount',
  },
  {
    label: 'Date',
    align: 'left',
    field: 'date',
    name: 'date',
  },
  {
    label: 'Type Of Moving',
    field: 'type',
    align: 'left',
    name: 'type',
  },
  {
    label: 'Created By',
    align: 'left',
    field: 'sUsername',
    name: 'sUsername',
  },
  {
    label: 'Mess Unit',
    align: 'left',
    field: 'datum',
    name: 'datum',
  },
  {
    label: 'Time',
    align: 'left',
    field: 'time',
    name: 'time',
  },
  {
    label: 'Account Number',
    field: 'acctNo',
    align: 'left',
    name: 'acctNo',
  },
];

export const tableDialogStockArticel: TableHeader[] = [
  {
    label: 'Articel Number',
    field: 'artnr',
    name: 'artnr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'bezeich',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Onhand',
    field: 'onhand',
    name: 'onhand',
    align: 'left',
    sortable: false,
  },
]
export const tableCostCenterList: TableHeader[] = [
  {
    label: 'Cost Center List',
    field: 'name',
    name: 'artnr',
    align: 'left',
    sortable: false,
  }
]
export const tableAllocationsList: TableHeader[] = [
  {
    label: 'Account Number',
    field: 'fibu',
    name: 'artnr',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'artnr',
    align: 'left',
    sortable: false,
  }
]

export const use_input = [
  {
    name : 'Delivery Number',
    right: '10px',
    width: '180px',
    disable: true,
    value: ''
  },
  {
    name : 'From Store',
    right: '10px',
    width: '180px',
    value: '',
    options: [],
    onClick: '1'
  },
  {
    name : 'To Store',
    right: '10px',
    width: '180px',
    value: '',
    options: []
  },
  {
    name : 'Account',
    right: '10px',
    width: '180px',
    value: '',
    onclick: '2'
  },
  {
    name : 'Total Amount',
    width: '180px',
    disable: true,
    value: ''
  },
]

export const use_input1 = [
  {
    name : 'Departement',
    width: '300px',
    top: '-20px',
    disable: true,
    value: '',
    options: [],
  },
  {
    name : 'Stock Articel Name',
    right: '20px',
    width: '200px',
    top: '-20px',
    options: [],
    value: ''
  },
  {
    name : 'Unit And Content Per Unit',
    right: '10px',
    width: '200px',
    top: '-10px',
    disable: true,
    value: ''
  },
  {
    name : 'Stock Onhand',
    right: '10px',
    width: '200px',
    top: '-10px',
    disable: true,
    value: ''
  },
  {
    name : 'Quantity Mess Unit',
    right: '10px',
    width: '200px',
    top: '-10px',
    value: '',
    keyup: '1'
  },
  {
    name : 'Price',
    right: '10px',
    width: '200px',
    top: '-10px',
    disable: true,
    value: ''
  },
  {
    name : 'Amount',
    right: '10px',
    width: '200px',
    top: '-10px',
    disable: true,
    value: ''
  },
]