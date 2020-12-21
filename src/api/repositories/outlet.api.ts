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
});
