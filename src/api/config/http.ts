import repository from './repository';
import { ApiEndpoints } from '~/plugins.types';

// endpoints
import GeneralLedgerAPI from '../repositories/generalLedger.api';
import AccountReceivableApi from '../repositories/accountReceivable.api';
import AuthApi from '../repositories/auth.api';
import HousekeepingApi from '../repositories/housekeeping.api';
import FrontOfficeCashierApi from '../repositories/frontOfficeCashier.api';
import AccountsPayableApi from '../repositories/accountsPayable.api';
import CommonApi from '../repositories/common.api';
import PurchasingApi from '../repositories/purchasing.api';
import OutletEndpoints from '../repositories/outlet.api';
import TelephoneOperatorEndpoints from '../repositories/telephoneOperator.api';
import InventoryEndpoints from '../repositories/inventory.api';
import GeneralCashierEndpoints from '../repositories/generalCashier.api';

const http: ApiEndpoints = {
  auth: AuthApi(repository),
  generalLedger: GeneralLedgerAPI(repository),
  accountReceivable: AccountReceivableApi(repository),
  housekeeping: HousekeepingApi(repository),
  frontOfficeCashier: FrontOfficeCashierApi(repository),
  accountsPayable: AccountsPayableApi(repository),
  common: CommonApi(repository),
  purchasing: PurchasingApi(repository),
  outlet: OutletEndpoints(repository),
  telephoneOperator: TelephoneOperatorEndpoints(repository),
  inventory: InventoryEndpoints(repository),
  generalCashier: GeneralCashierEndpoints(repository),
};

export default http;
