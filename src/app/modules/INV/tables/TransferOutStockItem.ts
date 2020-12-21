import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '../../../helpers/formatterMoney.helper'
import {date} from 'quasar'
export const tableHeaders: TableHeader[] = [
  {
    label: 'St',
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

export const dataTable = (item) => {
  return {
    st : item.st,
    artNumber: item.artNumber,
    des : item.des,
    price: item.price,
    qty: item.qty+'.000',
    date: date.formatDate(item.date, 'DD/MM/YYYY'),
    creattedBy: item.creattedBy,
    time: date.formatDate(new Date(), 'hh:mm:ss'),
  }
}
