import { DoRequest } from '../config/repository';
const GC_URL = 'vhpGC';
const Common = 'Common'
const OU_URL = 'vhpOU'

export interface GeneralCashierEndpoints {
    FetchAPI: any,
    FetchCommon: any,
    FetchOU: any
}

export default (doFetch: DoRequest): GeneralCashierEndpoints => ({
    FetchAPI: (api, body) =>
    doFetch({ url: `${GC_URL}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchCommon: (api, body) =>
    doFetch({ url: `${Common}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchOU: (api, body) =>
    doFetch({ url: `${OU_URL}/${api}`, body }).then(
        ([, res]) => res
    ),

})