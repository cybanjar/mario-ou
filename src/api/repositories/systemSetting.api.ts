import { DoRequest } from '../config/repository';
const SS_URL = 'vhpSS';
const SS_SC = 'vhpSC';
const Common = 'Common'

export interface SystemSetting {
    FetchAPIST: any,
    FetchCommon: any,
    FetchAPISC: any,
}

export default (doFetch: DoRequest): SystemSetting => ({
    FetchAPIST: (api, body) =>
    doFetch({ url: `${SS_URL}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchCommon: (api, body) =>
    doFetch({ url: `${Common}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchAPISC: (api, body) =>
    doFetch({ url: `${SS_SC}/${api}`, body }).then(
        ([, res]) => res
    ),

})
