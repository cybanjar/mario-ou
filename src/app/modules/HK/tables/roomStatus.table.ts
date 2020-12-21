import { TableHeader } from '~/components/VhpUI/typings';
import { ResGetRoomStatus } from '../models/responseRoomStatus.model';
import { RoomStatus, displayStatuses } from '../models/roomStatus.model';

export const tableHeaders: TableHeader[] = [
  {
    label: 'Floor',
    field: 'floor',
    name: 'floor',
    align: 'left',
  },
  {
    label: 'Room Number',
    field: 'roomNumber',
    name: 'roomNumber',
    align: 'left',
  },
  {
    label: 'Room Type',
    field: 'roomType',
    name: 'roomType',
    align: 'left',
  },
  {
    label: 'Room Status',
    field: 'roomStatus',
    name: 'roomStatus',
    align: 'left',
  },
];

export const tableColumns = (res: ResGetRoomStatus) => {
  const roomColumns: RoomStatus[] = res.zList.map((zItem, zIdx) => {
    const category = zItem.zikatnr;
    let roomType = '';
    const bedSetup = zItem.setup + 1;
    let setup: number | string = '';
    const roomNumber = zItem.zinr;
    const statusId = res.descriptions[zIdx].ind;
    let roomStatus = '';

    for (const cat of res.categories) {
      if (category === cat.zikatnr) {
        roomType = cat.kurzbez;
        break;
      }
    }

    for (const setupItem of res.setupList) {
      if (bedSetup === setupItem.nr) {
        setup = setupItem.nr;
        break;
      }
    }

    for (const status of displayStatuses) {
      if (statusId === status.value) {
        roomStatus = statusId === 8 ? zItem['str-reason'] : status.label;
        break;
      }
    }

    return {
      roomNumber,
      floor: zItem.etage,
      category,
      roomType,
      bedSetup: zItem.setup + 1,
      setup,
      roomStatus,
      reason: zItem['str-reason'],
      zistatus: zItem.zistatus,
      statusId,
    };
  });

  return roomColumns;
};

export const queueHeaders: TableHeader[] = [
  {
    label: 'Room Number',
    field: 'char1',
  },
  {
    label: 'Status',
    field: 'char3',
    align: 'left',
  },
];
