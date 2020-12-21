import { formatFromBL } from '~/app/helpers/formatterDate.helper';
import { TableActionHeader } from '~/components/VhpUI/typings';
import { LedgerData } from '../helpers/reformData.helper';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export enum SortType {
  DESC,
  REMARK,
}

const baseColumn: TableActionHeader<LedgerData>[] = [
  {
    label: 'Date',
    field: 'date',
    name: 'date',
    format: (val) => (val === null ? '' : formatFromBL(val)),
    align: 'left',
    sortable: true,
  },
  {
    label: 'Reference No',
    field: 'referenceNo',
    name: 'referenceNo',
    sortable: false,
  },
  {
    label: 'Debit',
    field: 'debit',
    name: 'debit',
    format: (v, row) =>
      v === null && row.note === '' ? '' : formatterMoney(v),
    align: 'right',
  },
  {
    label: 'Credit',
    field: 'credit',
    format: (v, row) =>
      v === null && row.note === '' ? '' : formatterMoney(v),

    name: 'credit',
    align: 'right',
  },
  {
    label: 'Balance',
    field: 'balance',
    format: (v, row) =>
      v === null && row.note === '' ? '' : formatterMoney(v),

    name: 'balance',
    align: 'right',
  },
  {
    label: 'Id',
    field: 'id',
    name: 'id',
  },
  {
    label: 'Created',
    field: 'created',
    format: (v) => (v === null ? '' : formatFromBL(v)),
    name: 'created',
  },
  {
    label: 'Change Id',
    field: 'changeId',
    name: 'changeId',
  },
  {
    label: 'Change Date',
    field: 'changeDate',
    format: (v) => (v === null ? '' : formatFromBL(v)),
    name: 'changeDate',
  },
  {
    label: 'Cashflow',
    field: 'cashFlow',
    name: 'cashFlow',
  },
  {
    label: 'Taxcode',
    field: 'taxCode',
    name: 'taxCode',
  },
  {
    label: 'Taxamount',
    field: 'taxAmount',
    name: 'taxAmount',
  },
  { name: 'actions', field: 'actions' },
];

export const getLedgerColumn = (
  sort: SortType
): TableActionHeader<LedgerData>[] => {
  if (sort === SortType.DESC) {
    const [h1, h2, h3, h4, h5, ...restH] = baseColumn;

    return [
      h1,
      h2,

      {
        label: 'Note',
        field: 'note',
        name: 'note',
      },
      h3,
      h4,
      h5,
      {
        label: 'Description',
        field: 'decription',
        name: 'sortBy',
      },
      ...restH,
    ];
  }

  if (sort === SortType.REMARK) {
    const [h1, h2, h3, h4, h5, ...restH] = baseColumn;

    return [
      h1,
      h2,
      h3,
      h4,
      h5,
      {
        label: 'Remark',
        field: 'note',
        name: 'sortBy',
      },
      ...restH,
    ];
  }

  return [];
};
