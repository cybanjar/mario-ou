<template>
  <q-dialog v-model="getDialogDepositPayment">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Deposit Payment: {{ getDepositPayPrepare.fTittle }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-6 q-px-md">
            <SSelect
              outlined
              label-text="Outlet"
              v-model="selectedArticle"
              @input="onChangeArticle"
              :options="getDepositPayPrepare.artikelList['artikel-list']"
              option-value="artnr"
              option-label="bezeich"
              map-options
              emit-value
              :dense="true"
            />
          </div>
          <div class="col-6 q-px-md">
            <SInput label-text="Amount" v-model="amount" />
          </div>
          <div class="col-6 q-px-md">
            <SInput label-text="Voucher Number" v-model="voucherNumber" />
          </div>
          <div class="col-6 q-px-md">
            <q-btn
              color="primary"
              label="Payment"
              @click="onClickPayment"
              style="width: 100%"
            />
          </div>
          <div class="col-12 q-mt-lg"></div>
          <div class="col-6 q-px-md">
            <SInput
              label-text="Deposit"
              :value="
                getDepositPayPrepare.tReservation['t-reservation'][0].depositgef
              "
              readonly
            />
          </div>
          <div class="col-6 q-px-md">
            <SInput
              label-text="Due Date"
              :value="
                getDepositPayPrepare.tReservation['t-reservation'][0].limitdate
              "
              readonly
            />
          </div>
          <div class="col-12 q-px-md">
            <div class="row">
              <div class="col-6 border-bottom">
                <div class="f-between">
                  <p class="q-mb-none q-mt-md">First Payment</p>
                  <p class="q-mb-none q-mt-md">
                    {{
                      getDepositPayPrepare.tReservation['t-reservation'][0]
                        .depositbez
                    }}
                  </p>
                </div>
              </div>
              <div class="col-6 border-bottom q-pl-lg">
                <p class="q-mb-none q-mt-md">
                  {{
                    getDepositPayPrepare.tReservation['t-reservation'][0]
                      .zahldatum
                  }}
                  {{ getDepositPayPrepare.paybez1 }}
                </p>
              </div>
              <div class="col-6 border-bottom">
                <div class="f-between">
                  <p class="q-mb-none q-mt-md">Second Payment</p>
                  <p class="q-mb-none q-mt-md">
                    {{
                      getDepositPayPrepare.tReservation['t-reservation'][0]
                        .depositbez2
                    }}
                  </p>
                </div>
              </div>
              <div class="col-6 border-bottom q-pl-lg">
                <p class="q-mb-none q-mt-md">
                  {{
                    getDepositPayPrepare.tReservation['t-reservation'][0]
                      .zahldatum2
                  }}
                  {{ getDepositPayPrepare.paybez2 }}
                </p>
              </div>
              <div class="col-6 border-bottom">
                <div class="f-between">
                  <p class="q-mb-none q-mt-md">Balance</p>
                  <p class="q-mb-none q-mt-md">
                    {{ getDepositPayPrepare.balance }}
                  </p>
                </div>
              </div>
              <div class="col-6 border-bottom"></div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Ok" @click="onClickOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { store } from '~/store';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      selectedArticle: null,
      amount: null,
      voucherNumber: '',
    });

    const getDialogDepositPayment = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_DEPOSIT_PAYMENT;
    });

    const getDepositPayPrepare = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_DEPOSIT_PAY_PREPARE;
      if (!res.artikelList) {
        res = {
          artikelList: { 'artikel-list': [] },
          tReservation: { 't-reservation': [{ depositgef: null }] },
        };
      }
      return res;
    });

    const onChangeArticle = () => {};
    const onClickPayment = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const payExrate: any = getDepositPayPrepare.value.artikelList[
        'artikel-list'
      ].filter((item: any) => item.artnr === state.selectedArticle);

      const depositPayBtnExit = await $api.frontOfficeCashier.depositPayBtnExit(
        {
          pvILanguage: 1,
          resnr:
            getDepositPayPrepare.value.tReservation['t-reservation'][0].resnr,
          artnr: state.selectedArticle,
          depositgef:
            getDepositPayPrepare.value.tReservation['t-reservation'][0]
              .depositgef,
          payment: parseInt(state.amount),
          depositExrate: payExrate[0]['pay-exrate'],
          'voucher-str': state.voucherNumber || ' ',
          user: userAuth.userName,
          userInit: userAuth.userInit,
        }
      );

      if (depositPayBtnExit.errorFlag == 'true') {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: 'Payment successfull',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: depositPayBtnExit.msgStr,
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickOk = async () => {
      state.selectedArticle = null;
      state.amount = null;
      state.voucherNumber = '';
      store.commit.focGuestFolio.SET_DIALOG_DEPOSIT_PAYMENT(false);
    };

    return {
      getDialogDepositPayment,
      getDepositPayPrepare,
      onChangeArticle,
      onClickPayment,
      onClickOk,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 700;
  width: 700;
}

.border-bottom {
  border-bottom: 1px solid gray;
}

.q-toolbar {
  background: $primary-grad;
}

.f-between {
  display: flex;
  justify-content: space-between;
}

#tableLayoutId {
  .selected-table {
    tbody tr.selected td {
      background: #1485cb !important;
      color: #fff;
    }
  }
  max-height: 450px !important;
  overflow: scroll;
}
</style>
