import { TableHeader } from '~/components/VhpUI/typings';
import { date } from 'quasar';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Number',
    field: 'paramnr',
    name: 'paramnr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Name',
    field: 'bezeichnung',
    name: 'bezeichnung',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Value',
    field: 'values',
    name: 'values',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Changed Date',
    field: 'lupdate',
    name: 'lupdate',
    format: (val) => date.formatDate(val, 'DD/MM/YYYY'),
    align: 'left',
    sortable: true,
  },
  {
    label: 'Changed By',
    field: 'fdefault',
    name: 'fdefault',
    align: 'left',
    sortable: true,
  },
  { name: 'actions', field: 'actions', align: 'center' },
];

export const tableColumns = (htgrp) => {
  const getValue = (col) => {
    switch (col.feldtyp) {
      case 1:
        return col.finteger;
      case 2:
        return col.fdecimal;
      case 3:
        return date.formatDate(col.fdate, 'DD/MM/YYYY');
      case 4:
        return col.flogical ? 'yes' : 'no';
      case 5:
        return col.fchar;
      default:
        return '';
    }
  };

  return htgrp.map((col) => ({
    ...col,
    values: getValue(col),
  }));
};
