export interface RoomStatus {
  roomNumber: string;
  floor: number;
  category: number;
  roomType: string;
  bedSetup: number;
  setup: number | string;
  roomStatus: string;
  reason: string;
  zistatus: number;
}

export const displayStatuses: any[] = [
  { value: 'all', label: 'All' },
  { value: 1, label: 'Vacant Clean Checked' },
  { value: 2, label: 'Vacant Clean Unchecked' },
  { value: 3, label: 'Vacant Dirty' },
  { value: 4, label: 'Expected Departure' },
  { value: 5, label: 'Occupied Dirty' },
  { value: 6, label: 'Occupied Cleaned' },
  { value: 7, label: 'Out Of Order' },
  { value: 9, label: 'Do Not Disturb' },
  { value: 10, label: 'Out Of Service' },
];

export const roomStatuses = [
  { value: 1, label: 'Clean Checked' },
  { value: 2, label: 'Clean Unchecked' },
  { value: 3, label: 'Dirty' },
  { value: 4, label: 'Out Of Order' },
  { value: 5, label: 'Off Market' },
  { value: 8, label: 'Do Not Disturb' },
];
