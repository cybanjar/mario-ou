import { DoRequest } from '../config/repository';

const SS_URL = 'vhpSS';

export interface SettingsEndpoints {
  invLoadCostCenter: () => Promise<any>;
}

export default (doFetch: DoRequest): SettingsEndpoints => ({
  invLoadCostCenter: () =>
    doFetch({ url: `${SS_URL}/invLoadCostCenter` }).then(([, res]) => res),
});
