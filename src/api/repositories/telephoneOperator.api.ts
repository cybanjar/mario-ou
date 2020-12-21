import { DoRequest } from '../config/repository';

const COMMON_URL = 'Common';
const vhpTO = 'vhpTO';
const vhpTaskRep = 'HouseKeeping'

export interface TelephoneOperatorEndpoints {
     //  FETCH_API
    fetchApiTelephoneOperator: any,
    fetchApiCommon: any,
    fetchApiTaskRep: any
}

export default (doFetch: DoRequest): TelephoneOperatorEndpoints => ({
    //  FETCH_API
    fetchApiTelephoneOperator: (api, body) =>
        doFetch({ url: `${vhpTO}/${api}`, body}).then(
            ([, res]) => res
        ),
    fetchApiTaskRep: (api, body) =>
        doFetch({ url: `${vhpTaskRep}/${api}`, body}).then(
            ([, res]) => res
        ),
    fetchApiCommon: (api, body) => 
        doFetch({ url: `${COMMON_URL}/${api}`, body}).then(
            ([, res]) => res
        )
});
