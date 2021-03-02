import { date } from 'quasar';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { TableHeader } from '~/components/VhpUI/typings';
import { ReinstateCancelledReservation } from '../../models/reinstate-cancelled-reservation/reinstateCancelledReservation.model';

export const tableHeaders: TableHeader<ReinstateCancelledReservation>[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
  },
  {
    label: 'Reservation Name',
    field: 'rsvname',
    name: 'rsvname',
    align: 'left',
  },
  {
    label: 'Guest Name',
    field: 'rsname',
    name: 'rsname',
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
    label: 'Reservation Status',
    field: (row) => setResStatus(row),
    name: 'resstatus',
    align: 'left',
  },
  {
    label: 'Quantity',
    field: 'zimmeranz',
    name: 'zimmeranz',
  },
  {
    label: 'Room Type',
    field: 'kurzbez',
    name: 'kurzbez',
    align: 'left',
  },
  {
    label: 'Adult',
    field: 'erwachs',
    name: 'erwachs',
  },
  {
    label: 'Compliment',
    field: 'gratis',
    name: 'gratis',
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
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
  },
  {
    label: 'Cancelled Date',
    field: 'cancelled',
    name: 'cancelled',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
    align: 'left',
  },
  {
    label: 'Cancelled ID',
    field: 'cancelled-id',
    name: 'cancelled-id',
    align: 'left',
  },
  { name: 'actions' },
];

function setResStatus(row: ReinstateCancelledReservation) {
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
