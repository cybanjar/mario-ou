import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { ResStockItemList } from '../models/outstanding-and-balance.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export const stockItemListColumns: TableHeader<ResStockItemList>[] = [
  {
    label: 'Date',
    field: (row) => (row.dDate ? date.formatDate(row.dDate, 'DD/MM/YYYYYY') : ''),
    name: 'dDate',
    align: 'left',
  },
  {
    label: 'Time',
    field: 'itime',
    name: 'itime',
    align: 'left',
  },
  {
    label: 'Store',
    field: (row) => (row.iSt === 0 ? '' : row.iSt),
    name: 'iSt',
  },
  {
    label: 'Document Number',
    field: 'sDocument',
    name: 'sDocument',
    align: 'left',
  },
  {
    label: 'Delivery Number',
    field: 'delivnote',
    name: 'delivnote',
    align: 'left',
  },
  {
    label: 'Article Number',
    field: (row) => (row.iArticle === 0 ? '' : row.iArticle),
    name: 'iArticle',
  },
  {
    label: 'Description',
    field: 'sDesc',
    name: 'sDesc',
    align: 'left',
  },
  {
    label: 'Quantity',
    field: (row) => formatterMoney(row.dQuantity),
    name: 'dQuantity',
  },
  {
    label: 'Amount',
    field: (row) => row.sAmount + '.00',
    name: 'sAmount',
  },
  {
    label: 'Unit Price',
    field: (row) => formatterMoney(row.price),
    name: 'price',
  },
  {
    label: 'Supplier Name',
    field: 'sSuplier',
    name: 'sSuplier',
    align: 'left',
  },
];
