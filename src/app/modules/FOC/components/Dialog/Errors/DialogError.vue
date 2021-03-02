<template>
  <q-dialog v-model="getDialogError">
    <q-card class="dialog-new-folio">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          {{ getErrorMessage.title1 }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <p>{{ getErrorMessage.text1 }}</p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          v-if="getErrorMessage.btnCancel"
          color="white"
          text-color="black"
          :label="getErrorMessage.btnCancel"
          @click="onClickCancel"
        />
        <q-btn
          color="primary"
          :label="getErrorMessage.btnOk"
          @click="onClickOk"
        />
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
    const state = reactive({});

    const getErrorMessage: any = computed(() => {
      return store.getters.focGuestFolio.GET_ERROR_MESSAGE;
    });

    const getDialogError = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_ERROR;
    });

    const onClickOk = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const getErrorMessage: any =
        store.getters.focGuestFolio.GET_ERROR_MESSAGE;
      const getBillListFoInvoice: any =
        store.getters.focGuestFolio.GET_BILL_LIST_FO_INVOICE;
      const getSelectedBill: any =
        store.getters.focGuestFolio.GET_SELECTED_BILL;
      const getFoInvoicePrepare: any =
        store.getters.focGuestFolio.GET_FO_INVOICE_PREPARE;

      if (getErrorMessage.status === 'new folio') {
        const foInvoiceBtnNewInv = await $api.frontOfficeCashier.foInvoiceBtnNewInv(
          {
            bilRecid: getSelectedBill['rec-id'],
            billAnzahl: getBillListFoInvoice.billAnzahl + 1,
          }
        );
        if (foInvoiceBtnNewInv.outputOkFlag === 'true') {
          const billListFOInvoice = await $api.frontOfficeCashier.billListFOInvoice(
            {
              bilFlag: 0,
              bilRecid: getSelectedBill['rec-id'],
              room: getSelectedBill.zinr,
              vipflag: false,
              fillCo: true,
              doubleCurrency: getFoInvoicePrepare.doubleCurrency === 'true',
              foreignRate: getFoInvoicePrepare.foreignRate === 'true',
            }
          );
          store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(
            billListFOInvoice
          );
          store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
        }
      } else if (getErrorMessage.status === 'checkout - readMasterBill') {
        const readMasterBill = await $api.frontOfficeCashier.readMasterBill({
          caseType: 1,
          resNo: getBillListFoInvoice.tBill['t-bill'][0].resnr,
          gastNo: 0,
        });

        if (readMasterBill.tMaster['t-master'].length > 0) {
          const readBill1Body = {
            caseType: 1,
            billNo: readMasterBill.tMaster['t-master'][0].rechnr,
            resNo: readMasterBill.tMaster['t-master'][0].resnr,
            reslinNo: 0,
            actFlag: 0,
            roomNo: '',
            datum1: '',
            datum2: '',
            saldo1: 0,
            saldo2: 0,
          };

          const readBill1 = await $api.frontOfficeCashier.readBill1(
            readBill1Body
          );
          console.log(readBill1);
          // Kemudian jalankan UI untuk MasterFolio, dan direct open Folio Masternya
        }
      } else if (getErrorMessage.status === 'create-master-folio') {
        store.commit.focGuestFolio.SET_DIALOG_CREATE_MASTER_BILL(true);
      } else if (getErrorMessage.from === 'void-item-option') {
        const getHTParam0 = await $api.frontOfficeCashier.getHTParam0({
          casetype: 3,
          inpParam: 173,
        });
        if (getHTParam0.fchar === '') {
          store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
        } else {
          store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
          store.commit.focGuestFolio.SET_GET_HT_Param_0(getHTParam0);
          store.commit.focGuestFolio.SET_DIALOG_PASSWORD(true);
        }
      } else if (getErrorMessage.status === 'individual-checkout-modal') {
        const getSelectedIndividualCheckout: any =
          store.getters.focIndividualCheckout.GET_SELECTED_INDIVIDUAL_CHECKOUT;

        await $api.frontOfficeCashier.checkoutRes({
          pvILanguage: 1,
          caseType: 2,
          resnr: getSelectedIndividualCheckout.resnr,
          reslinnr: getSelectedIndividualCheckout.reslinnr,
          silenzio: false,
          userInit: userAuth.userInit,
        });

        store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
      } else if (
        getErrorMessage.status ===
        'individual-checkout-modal-automatic-checkout'
      ) {
        if (getErrorMessage.coOK === 'true') {
        } else {
        }
      } else if (getErrorMessage.from === 'void-item-action') {
        store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
        store.commit.focGuestFolio.SET_DIALOG_CANCEL_REASON(true);
      } else {
        store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
      }
    };

    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_ERROR(false);
    };

    return {
      getErrorMessage,
      getDialogError,
      onClickOk,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-new-folio {
  max-width: 500px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
