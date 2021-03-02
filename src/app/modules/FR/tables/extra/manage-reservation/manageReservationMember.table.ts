import { TableHeader } from '~/components/VhpUI/typings';
import { ReservationMemberData } from '../../../models/extra/manage-reservation/manageReservation.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { date } from 'quasar';

export const tableHeaderManageReservationMember: TableHeader<ReservationMemberData>[] = [
  { label: 'Guest Name', align: 'left', name: 'name', field: 'name' },
  {
    label: 'Departure',
    align: 'left',
    name: 'abreise',
    field: 'abreise',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { label: 'Room Number', name: 'zinr', field: 'zinr' },
  { label: 'Room Type', align: 'left', name: 'kurzbez', field: 'kurzbez' },
  {
    label: 'Room Rate',
    name: 'zipreis',
    field: 'zipreis',
    format: (val: number) => formatterMoney(val),
  },
  { label: 'Rate Code', align: 'left', name: 'ratecode', field: 'ratecode' },
  {
    label: 'Arrangement Code',
    align: 'left',
    name: 'arrangement',
    field: 'arrangement',
  },
  { label: 'Adult', name: 'erwachs', field: 'erwachs' },
  { label: 'Compliment', name: 'gratis', field: 'gratis' },
  { label: 'Child', name: 'kind1', field: 'kind1' },
  { label: 'Compliment Child', name: 'kind2', field: 'kind2' },
  {
    label: 'Arrival',
    align: 'left',
    name: 'ankunft',
    field: 'ankunft',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Reservation Status',
    align: 'left',
    name: 'resstatus',
    field: 'resstatus',
    format: (_, row) => setResStatus(row),
  },
  { label: 'Quantity', name: 'zimmeranz', field: 'zimmeranz' },
  { label: 'Night', name: 'anztage', field: 'anztage' },
  {
    label: 'Changed By',
    align: 'left',
    name: 'changed-id',
    field: 'changed-id',
  },
  {
    label: 'Changed Date',
    align: 'left',
    name: 'changed',
    field: 'changed',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  { name: 'actions' },
];

export function setResStatus(row: ReservationMemberData) {
  const value = row.resstatus + row['l-zuord3'];
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
    case 12:
      return 'Accompanying Guest';
    case 13:
      return 'Room Sharer';
    case 14:
      return 'Accompanying Guest';
    default:
      return '';
  }
}
