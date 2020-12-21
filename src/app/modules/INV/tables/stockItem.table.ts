import { TableHeader } from '~/components/VhpUI/typings';

export const roomTableHeaders: TableHeader[] = [
  {
    label: 'Article Number',
    field: 'artnr',
    name: 'articelNumber',
    align: 'center',
    sortable: false,
  },
  {
    label: 'Description',
    field: 'bezeich',
    name: 'descriPtion',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Unit ',
    field: 'masseinheit',
    name: 'masseinheit',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Content',
    field: 'inhalt',
    name: 'inhalt',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Unit',
    field: 'traubensorte',
    name: 'roomType',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Content',
    field: 'lief-einheit',
    name: 'roomStatus',
    align: 'center',
    sortable: false,
  },
  {
    label: 'Minumum Stock (Mess)',
    field: 'min-bestand',
    name: 'guestNote',
    align: 'center',
    sortable: false,
  },
  {
    label: 'Actual',
    field: 'ek-aktuell',
    name: 'guestPax',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Last',
    field: 'ek-letzter',
    name: 'last',
    align: 'left',
    sortable: false,
  },
  {
    label: 'Purchase Frequensi',
    field: 'vk-preis',
    name: 'purchase',
    align: 'center',
    sortable: false,
  },
  {
    label: 'Account Number',
    field: 'lieferfrist',
    name: 'accountNumber',
    align: 'center',
    sortable: false,
  },
  {
    label: 'Average',
    field: 'fibukonto',
    name: 'average',
    align: 'center',
    sortable: false,
  },
  { name: 'actions', field: 'actions' },
];

export const inputCategory = [
  {
    label: 'Main Group',
    value: null,
    width: '200px',
    options: []
  },
  {
    label: 'Sub Group',
    value: null,
    width: '200px',
    options: []
  },
  {
    label: 'Articel Number',
    value: null,
    width: '100px',
    mt : '-10px'
  },
  {
    label: '',
    value: '',
    width: '30px',
    mt: '15px',
    mL: '-3px'
  },
  {
    label: 'Name',
    value: '',
    width: '500px',
    marginLeft: '200px',
  },
]


export const UnitPrice = [
  {
    label: 'Delivery Unit',
    value: '',
    width: '150px',
    mR: '10px',
    placeholder: 'box'
  },
  {
    label: 'Mess Unit',
    value: '',
    width: '150px',
    mR: '10px',
    placeholder: 'kg'
  },
  {
    label: 'Recipe Unit',
    value: '',
    width: '150px',
    mR: '10px',
    placeholder: 'gram'
  },
  {
    label: 'Recipe Number',
    value: '',
    width: '150px',
    placeholder: '',
    onClick: true
  },
  {
    label: 'Delivery unit conv',
    value: '1 Unit=',
    width: '80px',
    top: '10px',
    placeholder: '',
    disable: true,
    key: '1'
  },
  {
    label: '',
    value: '',
    width: '150px',
    top: '31px',
    mL: '-30px',
    placeholder: '',
    disable: true,
    off: '1'
  },
  {
    label: '',
    value: 'Mess',
    width: '80px',
    top: '31px',
    placeholder: '',
    mL: '-2px',
    mR: '10px',
    disable: true,
    key: '2'
  },
  {
    label: 'Actual Purchase Price',
    value: '',
    width: '230px',
    top: '10px',
    placeholder: '',
    off: '1',
    disable: true
  },
  {
    label: '',
    value: '@ unit',
    width: '80px',
    top: '31px',
    placeholder: '',
    mL: '-2px',
    disable: true,
    key: '1'
  },
  {
    label: 'Delivery unit conv',
    value: '1 Mess=',
    width: '80px',
    top: '-10px',
    placeholder: '',
    disable: true,
    key: '2'
  },
  {
    label: '',
    value: '',
    width: '150px',
    top: '11px',
    mL: '-30px',
    off: '1',
    placeholder: '',
    disable: true
  },
  {
    label: '',
    value: 'Recipe',
    width: '80px',
    top: '11px',
    mL: '-2px',
    placeholder: '',
    mR: '10px',
    disable: true
  },
  {
    label: 'Last Price',
    value: '',
    width: '230px',
    top: '-10px',
    off: '1',
    placeholder: '',
    disable: true
  },
  {
    label: '',
    value: '@ unit',
    width: '80px',
    top: '11px',
    placeholder: '',
    mL: '-2px',
    disable: true,
    key: '1'
  },
  {
    label: 'Average Purchase Price',
    value: '',
    width: '230px',
    placeholder: '',
    top: '-10px',
    off: '1',
    mL: '317px',
    mL1: '317px',
    disable: true
  },
  {
    label: '',
    key: '1',
    value: '@ unit',
    width: '80px',
    top: '11px',
    placeholder: '',
    mL: '-2px',
    disable: true
  },
]

export const inputAdditional = [
  {
    label: 'Min Stock',
    value: '',
    width: '250px',
    disable: true,
    off: '1'
  },
  {
    label: '',
    value: '@ mess',
    width: '80px',
    mT: '25px',
    mR: '200px',
    disable: true,
    mL: '-5px',
    off: '2'
  },
  {
    label: 'Max Stock',
    value: '',
    width: '250px',
    disable: true,
    off: '1'
  },
  {
    label: '',
    value: '@ mess',
    width: '80px',
    mT: '25px',
    mR: '200px',
    disable: true,
    off: '2',
    mL: '-5px'
  },
  {
    label: 'Account Number For Direct Issue Outgoing',
    value: '',
    width: '300px',
    onClick: true
  },
]

export const inputUnitPrice = [
  {
    label: 'Unit Convertion',
    mR: '200px',
    value: ['Conversion Info', 
    'Conversion section will be available', 
    'after all configurations field at unit',
    'tab has been fulfill' ] as any
  },
  {
    label: 'Unit Price',
    mR: '220px',
    value: ['Conversion Info', 
    'Conversion section will be available', 
    'after all configurations field at unit',
    'tab has been fulfill' ] as any
  },

]
