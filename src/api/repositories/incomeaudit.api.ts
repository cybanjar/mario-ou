import { DoRequest } from '../config/repository';
const NA_URL = 'vhpNA';
const Common = 'Common'

export interface IncomeAudit {
    FetchAPINA: any,
    FetchCommon: any,
}

export default (doFetch: DoRequest): IncomeAudit => ({
    FetchAPINA: (api, body) =>
    doFetch({ url: `${NA_URL}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchCommon: (api, body) =>
    doFetch({ url: `${Common}/${api}`, body }).then(
        ([, res]) => res
    ),

})
