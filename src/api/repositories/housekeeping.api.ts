import { DoRequest } from '../config/repository';
import { date } from 'quasar';

const HK_URL = 'HouseKeeping';

export interface HousekeepingEndpoints {
  getOverview: any;
  getRoomStatus: any;
  changeRoomStatus: any;
  addOutOfOrderRooms: any;
  addOffMarketRooms: any;
  getOOOandOM: any;
  updateOOOandOM: any;
  deactivateOOOandOM: any;
  getRoomingList: any;
  getStoreRoomDiscrepancyList: any;
}

const reformBody = {
  updateOOOandOM: (payload) => {
    const caseType = payload.status === 'OOO' ? '1' : '2';
    const formatDate = (dateInput) => date.formatDate(dateInput, 'MM/DD/YYYY');

    return {
      caseType,
      // TODO investigate hardcoded
      userInit: '01',
      recId: payload['rec-id'],
      fromDate: formatDate(payload.fromDate),
      toDate: formatDate(payload.toDate),
      serviceFlag: payload.serviceFlag,
      dept: payload.dept.value,
      reason: payload.reason ?? '',
    };
  },
  getStoreRoomDiscrepancyList: (payload) => {
    return {
      pvILanguage: '1',
      caseType: '',
      zinNo: '0',
      housestat: '0',
      feat: '',
      foStat1: '',
      hkStat1: '',
      fPax: '',
      fCh1: '',
      userInit: '01',
      hkStr: '',
      hkPax: '',
      hkCh1: '',
      ...payload,
    };
  },
};

export default (doFetch: DoRequest): HousekeepingEndpoints => ({
  getOverview: () => doFetch({ url: `${HK_URL}/getOverview` }),
  getRoomStatus: () =>
    doFetch({ url: `${HK_URL}/getRoomStatus` }).then(([, res]) =>
      res
        ? {
            zList: res.zList['z-list'],
            descriptions: res.omList['om-list'],
            setupList: res.setupList['setup-list'],
            categories: res.tZimkateg['t-zimkateg'],
          }
        : []
    ),
  changeRoomStatus: (body) =>
    doFetch({ url: `${HK_URL}/changeRoomStatus`, body }),
  addOutOfOrderRooms: (body) =>
    doFetch({ url: `${HK_URL}/addOutOfOrderRooms`, body }),
  addOffMarketRooms: (body) =>
    doFetch({ url: `${HK_URL}/addOffMarketRooms`, body }),
  getOOOandOM: (body) =>
    doFetch({ url: `${HK_URL}/getOOOandOM`, body }).then(
      ([, res]) => res?.oooList?.['ooo-list']
    ),
  updateOOOandOM: (payload) =>
    doFetch({
      url: `${HK_URL}/updateOOOandOM`,
      body: reformBody.updateOOOandOM(payload),
    }),
  deactivateOOOandOM: (body) =>
    doFetch({ url: `${HK_URL}/deactivateOOOandOM`, body }),
  getRoomingList: (body) => doFetch({ url: `${HK_URL}/getRoomingList`, body }),
  getStoreRoomDiscrepancyList: (payload) =>
    doFetch({
      url: `${HK_URL}/getStoreRoomDiscrepancyList`,
      body: reformBody.getStoreRoomDiscrepancyList(payload),
    }),
});
