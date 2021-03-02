<template>
  <q-dialog v-model="getDialogDepositRefund">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Deposit Refund -
          {{ getDepositRefundPrepare.tReservation['t-reservation'][0].name }} /
          Reservation Number:
          {{ getDepositRefundPrepare.tReservation['t-reservation'][0].resnr }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-6 q-px-md">
            <SInput
              label-text="Deposit"
              :value="
                getDepositRefundPrepare.tReservation['t-reservation'][0]
                  .depositgef
              "
              readonly
            />
          </div>
          <div class="col-6 q-px-md">
            <SInput
              label-text="Due Date"
              :value="
                getDepositRefundPrepare.tReservation['t-reservation'][0]
                  .limitdate
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
                      getDepositRefundPrepare.tReservation['t-reservation'][0]
                        .depositbez
                    }}
                  </p>
                </div>
              </div>
              <div class="col-6 border-bottom q-pl-lg">
                <p class="q-mb-none q-mt-md">
                  {{
                    getDepositRefundPrepare.tReservation['t-reservation'][0]
                      .zahldatum
                  }}
                  {{ bezeich }}
                </p>
              </div>
              <div class="col-6 border-bottom">
                <div class="f-between">
                  <p class="q-mb-none q-mt-md">Second Payment</p>
                  <p class="q-mb-none q-mt-md">
                    {{
                      getDepositRefundPrepare.tReservation['t-reservation'][0]
                        .depositbez2
                    }}
                  </p>
                </div>
              </div>
              <div class="col-6 border-bottom q-pl-lg">
                <p class="q-mb-none q-mt-md">
                  {{
                    getDepositRefundPrepare.tReservation['t-reservation'][0]
                      .zahldatum2
                  }}
                  {{ bezeich2 }}
                </p>
              </div>
              <div class="col-6 border-bottom">
                <div class="f-between">
                  <p class="q-mb-none q-mt-md">Balance</p>
                  <p class="q-mb-none q-mt-md">
                    {{ balance }}
                  </p>
                </div>
              </div>
              <div class="col-6 border-bottom"></div>
            </div>
          </div>
          <div class="col-12 q-mt-lg"></div>
          <div class="col-6 q-px-md">
            <SSelect
              outlined
              label-text="Article Payment"
              v-model="selectedArticle"
              @input="onChangeArticle"
              :options="getDepositRefundPrepare.tArtikel['t-artikel']"
              option-value="artnr"
              option-label="bezeich"
              map-options
              emit-value
              :dense="true"
            />
          </div>
          <div class="col-6 q-px-md">
            <SInput label-text="Refund" v-model="amount" />
          </div>
          <div class="col-6 q-px-md">
            <SInput label-text="Voucher Number" v-model="voucherNumber" />
          </div>
          <div class="col-6 q-px-md">
            <q-btn
              color="primary"
              label="Refund"
              @click="onClickRefund"
              style="width: 100%"
            />
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
      bezeich: '',
      bezeich2: '',
      balance: 0,
    });

    const getDialogDepositRefund = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_DEPOSIT_REFUND;
    });

    const getDepositRefundPrepare = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_DEPOSIT_REFUND_PREPARE;
      if (!res.tArtikel) {
        res = {
          tArtikel: { 't-artikel': [] },
          tReservation: { 't-reservation': [{ depositgef: null }] },
        };
      } else {
        res.tArtikel['t-artikel'].find((item: any) => {
          if (item.artnr === res.tReservation['t-reservation'][0].zahlkonto) {
            state.bezeich = item.bezeich;
          }

          if (item.artnr === res.tReservation['t-reservation'][0].zahlkonto2) {
            state.bezeich2 = item.bezeich;
          }
        });

        state.balance =
          res.tReservation['t-reservation'][0].depositgef -
          res.tReservation['t-reservation'][0].depositbez -
          res.tReservation['t-reservation'][0].depositbez2;

        state.amount =
          res.tReservation['t-reservation'][0].depositbez +
          res.tReservation['t-reservation'][0].depositbez2;
      }
      return res;
    });

    const onChangeArticle = () => {};
    const onClickRefund = async () => {
      const userAuth: any = Cookies.get('userAuth');

      const depositRefundBtnExit = await $api.frontOfficeCashier.depositRefundBtnExit(
        {
          pvILanguage: 1,
          resnr:
            getDepositRefundPrepare.value.tReservation['t-reservation'][0]
              .resnr,
          artnr: state.selectedArticle,
          payment: parseInt(state.amount),
          depositPay:
            parseInt(state.amount) *
            getDepositRefundPrepare.value.depositExrate,
          userInit: userAuth.userInit,
          depoart: getDepositRefundPrepare.value.depoart,
          depobezeich: getDepositRefundPrepare.value.depobezeich,
        }
      );

      if (depositRefundBtnExit.outputOkFlag == 'true') {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: 'Refund successfull',
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      } else {
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: depositRefundBtnExit.msgStr,
          btnOk: 'OK',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      }
    };

    const onClickOk = async () => {
      state.selectedArticle = null;
      state.amount = null;
      state.voucherNumber = '';
      state.bezeich = '';
      state.bezeich2 = '';
      state.balance = 0;
      store.commit.focGuestFolio.SET_DIALOG_DEPOSIT_REFUND(false);
    };

    return {
      getDialogDepositRefund,
      getDepositRefundPrepare,
      onChangeArticle,
      onClickRefund,
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
