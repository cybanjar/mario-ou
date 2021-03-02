<template>
  <div class="q-ma-md">
    <div class="row">
      <div class="col-3 q-pr-md f-middle-between">
        <div class="icon-print">
          <q-img
            class="icon-guest-folio"
            :src="require('~/app/icons/FOC/Icon-PrintFolio.svg')"
            @click="onClickMenu('Print Folio')"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              content-class="bg-dark"
            >
              Print Folio
            </q-tooltip>
          </q-img>
          <div class="icon-print-badge" v-if="getMbOpenBill.printed === '*'">
            <p class="icon-print-badge-text">1</p>
          </div>
        </div>

        <q-img
          class="icon-guest-folio"
          :src="require('~/app/icons/FOC/Icon-BillTransfer.svg')"
          @click="onClickMenu('Transfer Transaction')"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            content-class="bg-dark"
          >
            Transfer Transaction
          </q-tooltip>
        </q-img>

        <q-img
          class="icon-guest-folio"
          :src="require('~/app/icons/FOC/Icon-TransferHistory.svg')"
          @click="onClickMenu('Transfer History')"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            content-class="bg-dark"
          >
            Transfer History
          </q-tooltip>
        </q-img>

        <q-img
          class="icon-guest-folio"
          :src="require('~/app/icons/FOC/Icon-ForeignCurrencyExchangeRate.svg')"
          @click="onClickMenu('Foreign Currency Exchange Rate')"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            content-class="bg-dark"
          >
            Foreign Currency Exchange Rate
          </q-tooltip>
        </q-img>

        <q-img
          class="icon-guest-folio"
          :src="require('~/app/icons/FOC/Icon-MasterFolioMember.svg')"
          @click="onClickMenu('Master Folio Member')"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            content-class="bg-dark"
          >
            Master Folio Member
          </q-tooltip>
        </q-img>

        <q-img
          class="icon-guest-folio"
          :src="require('~/app/icons/FOC/Icon-ClosedFolio.svg')"
          @click="onClickMenu('Close Folio')"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            content-class="bg-dark"
          >
            Close Folio
          </q-tooltip>
        </q-img>
      </div>

      <div class="col-9 f-middle">
        <SInput
          label-text="Folio Number"
          class="q-mr-md custom-right"
          :value="getMbOpenBill ? getMbOpenBill.rechnr : ''"
          readonly
        />
        <SInput
          label-text="Bill Receiver Name"
          :value="
            getMbOpenBill.tBill ? getMbOpenBill.tBill['t-bill'][0].name : ''
          "
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { store } from '~/store';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({});

    // Services
    const formatDate = (dateInput) => date.formatDate(dateInput, 'DD/MM/YYYY');

    // Getters
    const getMbOpenBill: any = computed(
      () => store.getters.focMasterFolio.GET_MB_OPEN_BILL
    );

    // Main Functions
    const onClickMenu = async (menu) => {
      const userAuth: any = Cookies.get('userAuth');
      if (
        getMbOpenBill.value.outputOkFlag === 'true' &&
        menu === 'Print Folio'
      ) {
        console.log('Print folio clicked');
      } else if (
        getMbOpenBill.value.outputOkFlag === 'true' &&
        menu === 'Transfer Transaction'
      ) {
        console.log('Transfer transaction clicked');
        const checkPermission = await $api.frontOfficeCashier.checkPermission({
          userInit: userAuth.userInit,
          arrayNr: 8,
          expectedNr: 2,
        });

        if (checkPermission.zugriff === 'truee') {
        } else {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'general',
            title1: 'Information',
            text1: 'Sorry, No Access Right. Access Code 08,2',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        }
      } else if (
        getMbOpenBill.value.outputOkFlag === 'true' &&
        menu === 'Transfer History'
      ) {
        console.log('Transfer history clicked');
      } else if (
        getMbOpenBill.value.outputOkFlag === 'true' &&
        menu === 'Foreign Currency Exchange Rate'
      ) {
        const readCurrency = await $api.frontOfficeCashier.readCurrency({
          caseType: 8,
          currencyNo: null,
          currBez: null,
        });
        store.commit.focGuestFolio.SET_READ_CURRENCY(readCurrency);
        store.commit.focGuestFolio.SET_DIALOG_FCER(true);
      } else if (
        getMbOpenBill.value.outputOkFlag === 'true' &&
        menu === 'Master Folio Member'
      ) {
        console.log('Master folio member clicked');
      } else if (
        getMbOpenBill.value.outputOkFlag === 'true' &&
        menu === 'Close Folio'
      ) {
        console.log('Close folio clicked');
        const checkPermission = await $api.frontOfficeCashier.checkPermission({
          userInit: userAuth.userInit,
          arrayNr: 8,
          expectedNr: 2,
        });

        if (checkPermission.zugriff === 'truee') {
        } else {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'general',
            title1: 'Information',
            text1: 'Sorry, No Access Right. Access Code 08,2',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        }
      }
    };

    return {
      // Services
      formatDate,
      // Getters
      getMbOpenBill,
      // Main Functions
      onClickMenu,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.custom-right {
  input {
    text-align: right;
  }
}
</style>

<style lang="scss" scoped>
.f-middle-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.f-middle {
  display: flex;
  align-items: center;
}

.icon-guest-folio {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.icon-separator {
  border-right: 0.5px solid #acacac;
}

.ml16 {
  margin-left: 16px;
}

.mr16 {
  margin-right: 16px;
}

.icon-print {
  position: relative;
}

.icon-print-badge {
  position: absolute;
  right: -8px;
  bottom: -4px;
  background: #f29949;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  border-radius: 3px;
}

.icon-print-badge-text {
  color: #ffffff;
  font-size: 8px;
  font-weight: bold;
  margin: 0;
  padding: 0;
}
</style>
