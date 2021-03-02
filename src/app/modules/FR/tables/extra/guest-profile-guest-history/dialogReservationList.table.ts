import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { GuestReservationList } from '../../../models/extra/guest-profile-guest-history/guestReservationList.model';

export const tableHeaderReservation: TableHeader<GuestReservationList>[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
  },
  {
    label: 'Guest Name',
    field: 'name',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Reservation Status',
    field: (row) => setResStatus(row),
    name: 'resstatus',
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
    label: 'Departure',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
  },
];

function setResStatus(row: GuestReservationList) {
  const value = row.resstatus;
  switch (value) {
    case 1:
      return 'Guaranted';
    case 2:
      return '6PM';
    case 3:
      return 'Tentative';
    case 4:
      return 'WaitingList';
    case 5:
      return 'VerbalConfirm';
    case 6:
      return 'Inhouse';
    case 7:
      return '';
    case 8:
      return 'Departed';
    case 9:
      return 'Cancelled';
    case 10:
      return 'NoShow';
    case 11:
      return 'ShareRes';
    case 12:
      return 'ExtraBill';
    case 13:
      return 'RmSharer';
    default:
      return '';
  }
}
