import { RoomListRow, HistoryRow } from '../models/roomList.model';

export function filterRoomList(ciDate: string) {
  return (rows: RoomListRow[], terms) => {
    const floorTerm = parseInt(terms.floor);
    const roomFrom = parseInt(terms.roomFrom);
    const roomTo = parseInt(terms.roomTo);

    if (Object.keys(terms).length === 0) {
      return rows;
    }

    return rows.filter((row) => {
      const hasRoom = row.zinr.indexOf(terms.roomNumber) !== -1;
      const hasFloor = terms.floor === '' || row.floor === floorTerm;
      let hasStatus = false;
      let rangeFrom = false;
      let rangeTo = false;

      switch (terms.status) {
        case 'Departure':
          hasStatus = row.zistatus === 3 && row['active-flag'] <= 1;
          break;
        case 'Arrival':
          hasStatus = !!row.ankunft;
          break;
        case 'In-House':
          hasStatus = row.inhouse;
          break;
        case 'Uncleaned':
          hasStatus =
            [2, 4, 8].includes(row.zistatus) && row['active-flag'] <= 1;
          break;
        case 'Cleaned':
          hasStatus =
            [0, 1, 5].includes(row.zistatus) && row['active-flag'] <= 1;
          break;
        case 'Arrived':
          hasStatus = row.zistatus === 6 && row.ankunft === ciDate;
          break;
        case 'Departed':
          hasStatus =
            row.zistatus === 7 &&
            row['active-flag'] === 2 &&
            row.abreise === ciDate;
          break;
        default:
          hasStatus = true;
          break;
      }

      if (
        terms.roomFrom === '' ||
        (!isNaN(roomFrom) && parseInt(row.zinr) >= roomFrom)
      ) {
        rangeFrom = true;
      }

      if (
        terms.roomTo === '' ||
        (!isNaN(roomTo) && parseInt(row.zinr) <= roomTo)
      ) {
        rangeTo = true;
      }

      return hasRoom && hasStatus && hasFloor && rangeFrom && rangeTo;
    });
  };
}

export function filterHistory(rows: HistoryRow[], terms) {
  if (terms.gastnrmember) {
    return rows.filter((row) => row.gastnr === terms.gastnrmember);
  }

  return [];
}
