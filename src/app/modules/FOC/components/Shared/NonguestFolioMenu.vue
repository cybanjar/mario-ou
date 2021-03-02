<template>
  <div class="q-ma-md">
    <div class="row">
      <div class="col-3 q-pr-md f-middle-between">
        <q-img
          class="icon-guest-folio"
          :src="require('~/app/icons/FOC/Icon-NewFolio.svg')"
          @click="onClickMenu('New Folio')"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            content-class="bg-dark"
          >
            New Folio
          </q-tooltip>
        </q-img>

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
          <div class="icon-print-badge" v-if="getNsOpenBill.printed === '*'">
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
      </div>

      <div class="col-9 f-middle">
        <SInput
          label-text="Folio Number"
          class="q-mr-md"
          :value="getNsOpenBill.rechnr || ''"
          readonly
        />
        <SInput
          label-text="Bill Receiver Name"
          :value="getNsOpenBill.gname || ''"
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

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({});

    // Getters
    const getNsOpenBill: any = computed(() => {
      return store.getters.focNonguestFolio.GET_NS_OPEN_BILL;
    });

    // Main Functions
    const onClickMenu = async (menu) => {
      const getNsOpenBill: any =
        store.getters.focNonguestFolio.GET_NS_OPEN_BILL;

      if (getNsOpenBill.tBillLine && menu === 'New Folio') {
      } else if (getNsOpenBill.tBillLine && menu === 'Print Folio') {
        console.log('Print folio clicked');
      } else if (getNsOpenBill.tBillLine && menu === 'Transfer Transaction') {
        const checkPermission = await $api.frontOfficeCashier.checkPermission({
          userInit: '01',
          arrayNr: 12,
          expectedNr: 2,
        });

        if (checkPermission.zugriff === 'true') {
        } else {
          store.commit.focGuestFolio.SET_ERROR_MESSAGE({
            from: 'transfer-transaction-icon-nonguest',
            title1: 'Information',
            text1: 'Sorry, No Access Right. Access Code 12,2',
            btnOk: 'OK',
          });
          store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
        }
      } else if (getNsOpenBill.tBillLine && menu === 'Transfer History') {
        const foTransDetailPrepare = await $api.frontOfficeCashier.foTransDetailPrepare(
          {
            billNo: getNsOpenBill.rechnr,
            artNo: 0,
            amount: 0,
            systdate: null,
            systtime: 0,
          }
        );

        console.log(foTransDetailPrepare);

        store.commit.focGuestFolio.SET_FO_TRANS_DETAIL_PREPARE(
          foTransDetailPrepare
        );
        store.commit.focGuestFolio.SET_DIALOG_TRANSFER_HISTORY(true);
      } else if (
        getNsOpenBill.tBillLine &&
        menu === 'Foreign Currency Exchange Rate'
      ) {
        const readCurrency = await $api.frontOfficeCashier.readCurrency({
          caseType: 8,
          currencyNo: null,
          currBez: null,
        });
        store.commit.focGuestFolio.SET_READ_CURRENCY(readCurrency);
        store.commit.focGuestFolio.SET_DIALOG_FCER(true);
      } else {
      }
    };

    return {
      // Getters
      getNsOpenBill,
      // Main Functions
      onClickMenu,
      ...toRefs(state),
    };
  },
});
</script>

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
