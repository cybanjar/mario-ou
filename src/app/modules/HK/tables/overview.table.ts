import { ResGetOverview } from '../models/responseOverview.model';

const overviewCards = (
  title: string,
  totalRooms: number,
  totalPax: number | null,
  rows: any[]
) => ({
  icon: title,
  header: {
    title,
    totalRooms,
    totalPax,
  },
  data: [
    ...rows.map(([title, totalRooms, totalPax]) => ({
      title,
      totalRooms,
      totalPax,
    })),
  ],
});

export const cardItems = (res: ResGetOverview) => {
  const totalCleans: number = res.vclean + res.vuncheck + res.oclean;
  const totalDirties: number = res.vdirty + res.atoday + res.odirty;

  return [
    overviewCards('Arrival', res.totArrive1, res.totArrive2, [
      ['Arrived Today', res.arrived1, res.arrived2],
      ['Expected Arrival', res.arriving1, res.arriving1],
    ]),
    overviewCards('Departure', res.totDepart1, res.totDepart2, [
      ['Departed Today', res.departed1, res.departed2],
      ['Expected Departure', res.departing1, res.departing2],
    ]),
    overviewCards('Clean', totalCleans, null, [
      ['Vacant Clean', res.vdirty],
      ['Vacant Clean Unchecked', res.atoday],
      ['Occupied Clean', res.odirty],
    ]),
    overviewCards('Dirty', totalDirties, null, [
      ['Vacant Dirty', res.vclean],
      ['Expected Departure', res.vuncheck],
      ['Occupied Dirty', res.oclean],
    ]),
  ];
};

const roomNames = [
  'Occupied Rooms',
  'Complimentary',
  'House Use',
  'Inactive',
  'Out Of Order',
  'Off Market',
  'Estimated Occupied',
];

const tableNames = [
  'Rooms Occupancy Overview',
  'Queuing Rooms',
  'Housekeeping Activity',
];

const activityTable = [
  { abbr: 'VC', status: 'Vacant Clean', resKey: 'vclean' },
  { abbr: 'VCU', status: 'Vacant Clean Unchecked', resKey: 'vuncheck' },
  { abbr: 'OC', status: 'Occupied Clean', resKey: 'oclean' },
  { abbr: 'OD', status: 'Occupied Dirty', resKey: 'odirty' },
  { abbr: 'VD', status: 'Vacant Dirty', resKey: 'vdirty' },
  { abbr: 'ED', status: 'Expected Departure', resKey: 'atoday' },
];

export interface TableData {
  title: string;
  headers: any[];
  columns: any[];
}

const tableHeaders = {
  'Rooms Occupancy Overview': [
    {
      label: '',
      field: 'roomName',
      align: 'left',
    },
    { label: 'Rooms', field: 'room' },
    { label: 'Pax', field: 'pax' },
    { label: '%', field: 'percentage' },
  ],
  'Queuing Rooms': [
    { label: 'Room Number', field: 'roomNo', align: 'left' },
    { label: 'Status', field: 'status', align: 'left' },
    { label: 'ID', field: 'roomId', align: 'left' },
  ],
  'Housekeeping Activity': [
    { label: '', field: 'abbr', align: 'left' },
    { label: '', field: 'status', align: 'left' },
    { label: '%', field: 'percentage', align: 'left' },
  ],
};

export const setTableData = (res: ResGetOverview) => {
  const total =
    res.vclean +
    res.vuncheck +
    res.oclean +
    res.odirty +
    res.vdirty +
    res.atoday;

  const tableData: TableData[] = tableNames.map((tableName) => ({
    title: tableName,
    headers: tableHeaders[tableName],
    columns: [],
  }));

  roomNames.forEach((roomName) => {
    tableData[0].columns.push({
      roomName,
      room: res.oroom1,
      pax: res.oroom2,
      percentage: Math.round(res.proz1),
    });
  });

  tableData[1].columns = res.queueRoomList['queue-room-list'].map((queue) => ({
    roomNo: queue.char1,
    status: queue.char3,
    roomId: queue.char2,
  }));

  activityTable.forEach(({ abbr, status, resKey }) => {
    tableData[2].columns.push({
      abbr,
      status,
      percentage: Math.round((res[resKey] * 100) / total).toFixed(0),
    });
  });

  return tableData;
};
