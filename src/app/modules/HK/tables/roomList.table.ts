import { TableHeader } from '~/components/VhpUI/typings';
import { ResRoomList } from '../models/responseRoomList.model';
import { date } from 'quasar';

export const roomTableHeaders: TableHeader[] = [
  {
    name: 'icons',
    field: 'icons',
    align: 'left',
    headerStyle: 'min-width: 70px',
    style: 'min-width: 70px',
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'roomNumber',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Floor',
    field: 'floor',
    name: 'floor',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Type',
    field: 'kbezeich',
    name: 'roomType',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Status',
    field: 'rstat',
    name: 'roomStatus',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Note',
    field: 'guestNote',
    name: 'guestNote',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Pax',
    field: 'guestPax',
    name: 'guestPax',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'ankunft',
    name: 'arrivalDate',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Time',
    field: 'arrtime',
    name: 'arrivalTime',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Date',
    field: 'abreise',
    name: 'departureDate',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Time',
    field: 'deptime',
    name: 'departureTime',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Name',
    field: 'company',
    name: 'reserveName',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Remark',
    field: 'bemerk',
    name: 'reserveRemark',
    align: 'left',
    sortable: true,
    style: 'max-width: 400px',
  },
  {
    label: 'Request',
    field: 'spreq',
    name: 'reserveRequest',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Main Guest Name',
    field: 'gname',
    name: 'guestName',
    align: 'left',
    sortable: true,
  },
];

export const roomTableColumns = (res: ResRoomList[]) =>
  res.map((room) => {
    const getGuestNote = () => {
      switch (room.gstat.charAt(0)) {
        case 'R':
          return 'In-House';
        case 'A':
          return 'Arrival';
        case 'D':
          return 'Departure';
        case 'U':
          return 'Day-Use';
        case '*':
          return 'Departed';
        case 'I':
          return 'Inactive';
        case 'C':
          return 'Child';
        default:
          return '';
      }
    };

    const statusIcons: any[] = [];

    if (room.vip.trim().toLowerCase() === 'vip') {
      statusIcons.push({ title: 'VIP', icon: 'mdi-star', color: 'yellow' });
    }

    if (room.inactive.trim().toLowerCase() === 'i') {
      statusIcons.push({ title: 'Inactive', icon: 'mdi-alert-outline' });
    }

    if (room.cashBasis) {
      statusIcons.push({
        title: 'Cash Basis',
        icon: 'mdi-currency-usd-circle-outline',
        color: 'red',
      });
    }

    if (room.rstat === 'Vacant Dirty *') {
      statusIcons.push({ title: 'Departed', icon: 'mdi-logout' });
    }

    const guestPax = room.gstat.length ?? '';

    return {
      ...room,
      guestNote: getGuestNote(),
      guestPax,
      statusIcons,
      rstat: room.rstat === 'Vacant Dirty *' ? 'Vacant Dirty' : room.rstat,
      ankunft: date.formatDate(room.ankunft, 'DD/MM/YYYYYY'),
      abreise: date.formatDate(room.abreise, 'DD/MM/YYYYYY'),
    };
  });

export const historyTableHeaders: TableHeader[] = [
  {
    label: 'Arrival',
    field: 'ankunft',
    name: 'ankunft',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 110px',
    style: 'max-width: 110px',
  },
  {
    label: 'Departure',
    field: 'abreise',
    name: 'abreise',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 110px',
    style: 'max-width: 110px',
  },
  {
    label: 'Room Number',
    field: 'zinr',
    name: 'zinr',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 150px',
    style: 'max-width: 150px',
  },
  {
    label: 'Room Change',
    field: 'zi-wechsel',
    name: 'zi-wechsel',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 130px',
    style: 'max-width: 130px',
  },
  {
    label: 'Reservation Comment',
    field: 'bemerk',
    name: 'bemerk',
    align: 'left',
    sortable: true,
  },
];
