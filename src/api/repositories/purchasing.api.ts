import { DoRequest } from '../config/repository';
import { date } from 'quasar';

const PU_URL = 'vhpPC';

export interface PurchasingEndpoints {
  quoteListPrepare: any;
}

export default (doFetch: DoRequest): PurchasingEndpoints => ({
  quoteListPrepare: () => doFetch({ url: `${PU_URL}/quoteListPrepare` }),
});
