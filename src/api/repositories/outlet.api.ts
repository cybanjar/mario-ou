import { DoRequest } from '../config/repository';

const OU_URL = 'vhpOU';
const COMMON = 'Common';

export interface OutletEndpoints {
  getCommonOutletUserList: any;
  getZugriff: any;
  getOUPrepare: any;
  getOUAction: any;
  getOUDailySalesByUser2List: any;
  getOUTableList: any;

  getOUPrepareSummaryRestaurantReport: any;
  getOUSummaryRestaurantReport: any;
  getOUPrepareOutletSoldMenu: any;
  getOUOutletSoldMenu: any;
}

export default (doFetch: DoRequest): OutletEndpoints => ({
  getCommonOutletUserList: (api, body) =>
    doFetch({ url: `${COMMON}/${api}`, body }).then(
      ([, res]) => res
  ),
  getZugriff: (api, body) =>
    doFetch({ url: `${COMMON}/${api}`, body }).then(
      ([, res]) => res
  ),
  getOUPrepare: (api, body) =>
  doFetch({ url: `${OU_URL}/${api}`, body }).then(
    ([, res]) => res
  ),
  getOUAction: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(
      ([, res]) => res
  ),
  getOUDailySalesByUser2List: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(
      ([, res]) => res
  ),
  getOUTableList: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(
      ([, res]) => res
  ),
  getOUPrepareSummaryRestaurantReport: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(([, res]) => res),
  getOUSummaryRestaurantReport: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(
      ([, res]) => res?.turnover?.['turnover']
    ),
  getOUPrepareOutletSoldMenu: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(([, res]) => res),
  getOUOutletSoldMenu: (body) =>
    doFetch({ url: `${OU_URL}/fbSalesCostsAnalList`, body }).then(
      ([, res]) => res
    ),
});
