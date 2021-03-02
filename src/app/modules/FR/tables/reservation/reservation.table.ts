import { date } from 'quasar';
import { displayTime } from '~/app/helpers/displayTime.helper';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';
import { TableHeader } from '~/components/VhpUI/typings';
import { Reservation } from '../../models/reservation/reservation.model';

export const tableHeaders: TableHeader<Reservation>[] = [
  {
    label: 'Reservation Number',
    field: 'resnr',
    name: 'resnr',
    sortable: true,
  },
  {
    label: 'Reservation Name',
    field: 'rsv-name',
    name: 'rsv-name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Guest Name',
    field: 'resline-name',
    name: 'resline-name',
    align: 'left',
    sortable: true,
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
    label: 'Departure',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    sortable: true,
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
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
    label: 'Arrangement Code',
    field: 'arrangement',
    name: 'arrangement',
    align: 'left',
  },
  {
    label: 'Room Rate',
    field: 'zipreis',
    name: 'zipreis',
    sortable: true,
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Currency',
    field: 'waehrung-wabkurz',
    name: 'waehrung-wabkurz',
    align: 'left',
  },
  {
    label: 'Nights',
    field: 'anztage',
    name: 'anztage',
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
    label: 'Infant',
    field: 'kind2',
    name: 'kind2',
  },
  {
    label: 'Compliment Adult',
    field: 'gratis',
    name: 'gratis',
  },
  {
    label: 'Compliment Child',
    field: 'l-zuordnung4',
    name: 'l-zuordnung4',
  },
  {
    label: 'Bed Type',
    field: 'setup-list-char',
    name: 'setup-list-char',
    align: 'left',
  },
  {
    label: 'Segment Number',
    field: 'segmentcode',
    name: 'segmentcode',
    sortable: true,
  },
  {
    label: 'Group',
    field: 'groupname',
    name: 'group',
    align: 'left',
    format: (val: string) => (val.length > 0 ? 'Yes' : 'No'),
  },
  {
    label: 'Group Name',
    field: 'groupname',
    name: 'groupname',
    align: 'left',
  },
  {
    label: 'Master Bill',
    field: 'verstat',
    name: 'verstat',
    align: 'left',
    format: (val: number) => (val === 1 ? 'Yes' : 'No'),
  },
  {
    label: 'Flight Arrival Number',
    field: 'flight-nr',
    name: 'flight-arrival-number',
    align: 'left',
    format: (val: string) => val?.substring(0, 6),
  },
  {
    label: 'Estimated Time of Arrival',
    field: 'flight-nr',
    name: 'eta',
    align: 'left',
    format: (val: string) => {
      if (!val || val.length < 1) return '';
      const hours = val.substring(6, 8);
      const minutes = val.substring(8, 11);
      if (hours + minutes === '0000 ') return '';
      return hours + ':' + minutes;
    },
  },
  {
    label: 'Flight Departure Number',
    field: 'flight-nr',
    name: 'flight-departure-number',
    align: 'left',
    format: (val: string) => val?.substring(11, 17),
  },
  {
    label: 'Estimated Time of Departure',
    field: 'flight-nr',
    name: 'etd',
    align: 'left',
    format: (val: string) => {
      if (!val || val.length < 1) return '';
      const hours = val.substring(17, 19);
      const minutes = val.substring(19, 22);
      if (hours + minutes === '0000 ') return '';
      return hours + ':' + minutes;
    },
  },
  {
    label: 'Arrival Time',
    field: 'ankzeit',
    name: 'ankzeit',
    align: 'left',
    format: (val: number) => displayTime(val),
  },
  {
    label: 'Departure Time',
    field: 'abreisezeit',
    name: 'abreisezeit',
    align: 'left',
    format: (val: number) => displayTime(val),
  },
  {
    label: 'Reservation Status',
    field: (row) => setResStatus(row),
    name: 'reservation-status',
    align: 'left',
  },
  {
    label: 'Cut Off Date',
    field: 'resdat',
    name: 'cut-off-date',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Cash Basis',
    align: 'left',
    // TODO: Field unavailable on issue ticket
  },
  {
    label: 'Keycard Used',
    field: 'betrieb-gast',
    name: 'betrieb-gast',
  },
  {
    label: 'Fixed Exclude Rate',
    field: 'reserve-dec',
    name: 'reserve-dec',
    format: (val: number) => formatterMoney(val),
  },
  {
    label: 'Created Date',
    field: 'resdat',
    name: 'created-date',
    align: 'left',
    format: (val: string) => date.formatDate(val, 'DD/MM/YY'),
  },
  {
    label: 'Created By',
    field: 'useridanlage',
    name: 'useridanlage',
    align: 'left',
  },
  {
    label: 'Checked-in By',
    field: 'cancelled-id',
    name: 'cancelled-id',
    align: 'left',
  },
  {
    label: 'Last Changed By',
    field: 'changed-id',
    name: 'changed-id',
    align: 'left',
  },
  { name: 'actions' },
];

export function checkResStatus(
  row: Reservation,
  val: string | string[]
): boolean {
  const resStatus = setResStatus(row);
  if (Array.isArray(val)) return val.includes(resStatus);
  else return val === resStatus;
}

function setResStatus(row: Reservation) {
  const value = row.resstatus + row['l-zuordnung3'];
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
