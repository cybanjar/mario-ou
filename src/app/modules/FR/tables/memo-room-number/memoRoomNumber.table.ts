import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { MemoRoomNumber } from '../../models/memo-room-number/memoRoomNumber.model';

export const tableHeaders: TableHeader<MemoRoomNumber>[] = [
  {
    label: 'Room Number',
    field: 'memozinr',
    name: 'memozinr',
    format: (val: string) => val.split(';')[1],
  },
  {
    label: 'Memo Date',
    field: 'memodatum',
    name: 'memodatum',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Guest Name',
    field: 'NAME',
    name: 'NAME',
    align: 'left',
  },
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Depature',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Night',
    field: 'anztage',
    name: 'anztage',
  },
  {
    label: 'Arrangement Code',
    field: 'arrangement',
    name: 'arrangement',
    align: 'left',
  },
  {
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Adult',
    field: 'erwachs',
    name: 'erwachs',
  },
  {
    label: 'Child',
    field: 'kind1',
    name: 'kind1',
  },
  {
    label: 'Reservation Status',
    field: (row) => setResStatus(row),
    name: 'resstatus',
    align: 'left',
  },
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
  },
  { name: 'actions' },
];

function setResStatus(row: MemoRoomNumber) {
  const value = row.resstatus;
  switch (value) {
    case 1:
      return 'Guaranted';
    case 2:
      return '6PM';
    case 3:
      return 'Tentative';
    case 4:
      return 'WaitList';
    case 5:
      return 'VerbalConfirm';
    case 6:
      return 'Inhouse';
    case 8:
      return 'Departed';
    case 9:
      return 'Cancelled';
    case 10:
      return 'NoShow';
    case 11:
      return 'ShareRes';
    case 13:
      return 'RmSharer';
    default:
      return '';
  }
}
