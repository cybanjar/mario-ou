import { DoRequest } from '../config/repository';
const INV_URL = 'vhpINV';
const Common = 'Common'
const VHP_AR = 'vhpAR'

export interface InventoryEndpoint {
    FetchAPIINV: any,
    FetchCommon: any,
    FetchAPIAR: any
}

export default (doFetch: DoRequest): InventoryEndpoint => ({
    FetchAPIINV: (api, body) =>
    doFetch({ url: `${INV_URL}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchCommon: (api, body) =>
    doFetch({ url: `${Common}/${api}`, body }).then(
        ([, res]) => res
    ),
    FetchAPIAR: (api, body) =>
    doFetch({ url: `${VHP_AR}/${api}`, body }).then(
        ([, res]) => res
    ),

})
