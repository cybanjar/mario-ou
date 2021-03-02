import { TableHeader } from '~/components/VhpUI/typings';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Supplier Name',
    name: 'supName',
    field: 'supName',
    align: 'left',
  },
  {
    label: 'Document Number',
    field: 'docu-nr',
    name: 'docu-nr',
    align: 'left',
  },
  {
    label: 'Item Number',
    field: 'artnr',
    name: 'artnr',
    align: 'left',
  },
  {
    label: 'Item Name',
    field: 'artName',
    name: 'artName',
    align: 'left',
  },
  {
    label: 'Delivery Unit',
    name: 'devUnit',
    field: 'devUnit',
    align: 'left',
  },
  {
    label: 'Content',
    field: 'content',
    name: 'content',
    align: 'left',
  },
  {
    label: 'Unit Price',
    field: (row) => formatThousands(row.unitprice),
    name: 'unitprice',
    align: 'left',
  },
  {
    label: 'Currency',
    name: 'curr',
    field: 'curr',
    align: 'left',
  },
  {
    label: 'Valid From Date',
    name: 'from-date',
    field: (row) => date.formatDate(row['from-date'], 'DD/MM/YY'),
    align: 'left',
  },
  {
    label: 'Valid To Date',
    name: 'to-Date',
    field: (row) => date.formatDate(row['to-Date'], 'DD/MM/YY'),
    align: 'left',
  },
  {
    label: 'Remark',
    name: 'remark',
    field: 'remark',
    align: 'left',
  },
  {
    label: 'File Name',
    field: 'filname',
    name: 'filname',
    align: 'left',
  },
  {
    label: 'Active',
    name: 'activeFlag',
    field: (row) => (row.activeFlag ? 'Yes' : 'No'),
    align: 'left',
  },
  {
    label: 'Minimum Quantity',
    field: 'minQty',
    name: 'minQty',
    align: 'right',
  },
  {
    label: 'Due Day',
    field: 'delivDay',
    name: 'delivDay',
    align: 'right',
  },
  {
    label: 'Discount',
    field: 'disc',
    name: 'disc',
    align: 'right',
  },
  {
    label: 'Availability',
    field: (row) => (row.avl ? 'Yes' : 'No'),
    name: 'avl',
    align: 'left',
  },
  { name: 'actions', field: 'actions' },
];
