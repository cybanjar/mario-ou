import { date } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { TableHeader } from '~/components/VhpUI/typings';
import {
  TableForecast,
  TableGuestContact,
  TableHistory,
} from '../../models/common/dialogGuestProfile.model';

export const tableHeaderHistory: TableHeader<TableHistory>[] = [
  {
    label: 'Arrival',
    align: 'left',
    field: 'ankunft',
    name: 'ankunft',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Depature',
    align: 'left',
    field: 'abreise',
    name: 'abreise',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Room Number', align: 'left', field: 'zinr', name: 'zinr' },
  {
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    format: (val: number) => formatterMoney(val),
  },
  { label: 'Room Type', align: 'left', field: 'kurzbez' },
  { label: 'Remark', align: 'left', field: 'bemerk' },
];

export const tableHeaderGuestContact: TableHeader<TableGuestContact>[] = [
  { label: 'Name', align: 'left', field: 'NAME', name: 'NAME' },
  { label: 'First Name', align: 'left', field: 'vorname', name: 'vorname' },
  { label: 'Title', align: 'left', field: 'anrede', name: 'anrede' },
];

export const tableHeaderForecast: TableHeader<TableForecast>[] = [
  {
    label: 'Arrival',
    align: 'left',
    field: 'ankunft',
    name: 'ankunft',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Depature',
    align: 'left',
    field: 'abreise',
    name: 'abreise',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Room Number', align: 'left', field: 'zinr', name: 'zinr' },
  {
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    format: (val: number) => formatterMoney(val),
  },
  { label: 'Room Type', align: 'left', field: 'kurzbez' },
  {
    label: 'Remark',
    align: 'left',
    // TODO: Field unavailable on issue ticket
  },
];
