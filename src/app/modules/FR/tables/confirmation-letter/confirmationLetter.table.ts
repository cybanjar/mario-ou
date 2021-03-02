import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import { ConfirmationLetter } from '../../models/confirmation-letter/confirmationLetter.model';

export const tableHeaders: TableHeader<ConfirmationLetter>[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
    sortable: true,
  },
  {
    label: 'Reservation Name',
    field: 'name',
    name: 'name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Letter Number',
    field: 'briefnr',
    name: 'briefnr',
  },
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    align: 'left',
    sortable: true,
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Nights',
    field: 'anztage',
    name: 'anztage',
  },
  {
    label: 'Depature',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Room Type',
    field: 'kurzbez',
    name: 'kurzbez',
    align: 'left',
  },
  {
    label: 'Reservation Status',
    field: (row) => setResStatus(row),
    name: 'resstatus',
    align: 'left',
  },
  {
    label: 'Group Name',
    field: 'groupname',
    name: 'groupname',
    align: 'left',
  },
  { name: 'actions' },
];

function setResStatus(row: ConfirmationLetter) {
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
