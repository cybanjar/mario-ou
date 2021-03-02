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
    headerStyle: 'width: 100px;',
    style: 'width: 100px;',
    align: 'left',
    field: 'date',
    name: 'date',
    format: (val) => (val === null ? '' : formatFromBL(val)),
  },
  {
    label: 'Reference No',
    headerStyle: 'width: 180px;',
    style: 'width: 180px;',
    align: 'left',
    field: 'referenceNo',
    name: 'referenceNo',
  },
  {
    label: 'Debit',
    headerStyle: 'width: 125px;',
    style: 'width: 125px;',
    field: 'debit',
    name: 'debit',
    format: (v, row) =>
      v === null && row.note === '' ? '' : formatterMoney(v),
    align: 'right',
  },
  {
    label: 'Credit',
    headerStyle: 'width: 140px;',
    style: 'width: 140px;',
    field: 'credit',
    format: (v, row) =>
      v === null && row.note === '' ? '' : formatterMoney(v),

    name: 'credit',
    align: 'right',
  },
  {
    label: 'Balance',
    headerStyle: 'width: 310px;',
    style: 'width: 310px;',
    field: 'balance',
    format: (v, row) =>
      v === null && row.note === '' ? '' : formatterMoney(v),

    name: 'balance',
    align: 'right',
  },
  {
    label: 'Id',
    headerStyle: 'width: 70px;',
    style: 'width: 70px;',
    align: 'left',
    field: 'id',
    name: 'id',
  },
  {
    label: 'Created',
    headerStyle: 'width: 120px;',
    style: 'width: 120px;',
    align: 'left',
    field: 'created',
    format: (v) => (v === null ? '' : formatFromBL(v)),
    name: 'created',
  },
  {
    label: 'Change Id',
    headerStyle: 'width: 70px;',
    style: 'width: 70px;',
    align: 'left',
    field: 'changeId',
    name: 'changeId',
  },
  {
    label: 'Change Date',
    headerStyle: 'width: 120px;',
    style: 'width: 120px;',
    align: 'left',
    field: 'changeDate',
    format: (v) => (v === null ? '' : formatFromBL(v)),
    name: 'changeDate',
  },
  {
    label: 'Cashflow',
    headerStyle: 'width: 150px;',
    style: 'width: 150px;',
    align: 'left',
    field: 'cashFlow',
    name: 'cashFlow',
  },
  {
    label: 'Taxcode',
    headerStyle: 'width: 150px;',
    style: 'width: 150px;',
    align: 'left',
    field: 'taxCode',
    name: 'taxCode',
  },
  {
    label: 'Taxamount',
    headerStyle: 'width: 150px;',
    style: 'width: 150px;',
    align: 'left',
    field: 'taxAmount',
    name: 'taxAmount',
  },
  {
    name: 'actions',
    field: 'actions',
    headerStyle: 'width: 30px;',
    style: 'width: 30px;',
  },
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
        label: 'Description',
        headerStyle: 'width: 310px;',
        style: 'width: 310px;',
        align: 'left',
        field: 'description',
        name: 'description',
      },
      h3,
      h4,
      h5,

      {
        label: 'Remark',
        headerStyle: 'width: 310px;',
        style: 'width: 310px;',
        align: 'left',
        field: 'note',
        name: 'note',
      },
      ...restH,
    ];
  }

  if (sort === SortType.REMARK) {
    const [h1, h2, h3, h4, h5, ...restH] = baseColumn;

    return [
      h1,
      h2,
      {
        label: 'Remark',
        headerStyle: 'width: 310px;',
        style: 'width: 310px;',
        align: 'left',
        field: 'note',
        name: 'note',
      },

      h3,
      h4,
      h5,
      {
        label: 'Description',
        headerStyle: 'width: 310px;',
        style: 'width: 310px;',
        align: 'left',
        field: 'description',
        name: 'description',
      },
      ...restH,
    ];
  }

  return [];
};
