import { GeneralLedgerEndpoints } from '~/api/repositories/generalLedger.api';
import { AccountReceivableEndpoints } from '~/api/repositories/accountReceivable.api';
import { AuthEndpoints } from '~/api/repositories/auth.api';
import { HousekeepingEndpoints } from '~/api/repositories/housekeeping.api';
import { PurchasingEndpoints } from '~/api/repositories/purchasing.api';
import { OutletEndpoints } from '~/api/repositories/outlet.api';
import { FrontOfficeCashierEndpoints } from '~/api/repositories/frontOfficeCashier.api';
import { AccountsPayableEndpoints } from './api/repositories/accountsPayable.api';
import { CommonEndpoints } from './api/repositories/common.api';
import { TelephoneOperatorEndpoints } from '~/api/repositories/telephoneOperator.api';
import { InventoryEndpoint } from '~/api/repositories/inventory.api';
import { GeneralCashierEndpoints } from '~/api/repositories/generalCashier.api';
import { FrontOfficeReceptionEndpoints } from './api/repositories/frontOfficeReception.api';
import { IncomeAudit } from '~/api/repositories/incomeaudit.api';
import { SystemSetting } from '~/api/repositories/systemSetting.api';
import { SettingsEndpoints } from '~/api/repositories/settings.api';

export interface ApiEndpoints {
  generalLedger: GeneralLedgerEndpoints;
  accountReceivable: AccountReceivableEndpoints;
  auth: AuthEndpoints;
  housekeeping: HousekeepingEndpoints;
  purchasing: PurchasingEndpoints;
  outlet: OutletEndpoints;
  frontOfficeCashier: FrontOfficeCashierEndpoints;
  accountsPayable: AccountsPayableEndpoints;
  common: CommonEndpoints;
  telephoneOperator: TelephoneOperatorEndpoints;
  inventory: InventoryEndpoint;
  generalCashier: GeneralCashierEndpoints;
  frontOfficeReception: FrontOfficeReceptionEndpoints;
  incomeaudit: IncomeAudit;
  systemsetting: SystemSetting;
  settings: SettingsEndpoints;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiEndpoints;
  }
}
