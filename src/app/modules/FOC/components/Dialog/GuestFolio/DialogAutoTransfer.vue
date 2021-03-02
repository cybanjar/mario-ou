<template>
  <q-dialog v-model="getDialogAutoTransfer">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Serch Room Number
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-6 q-pr-sm">
            <SInput
              label-text="Room Number"
              mask="####"
              v-model="roomNumber"
              unmasked-value
            />
            <q-btn
              block
              color="primary"
              max-height="28"
              icon="mdi-magnify"
              label="Search"
              type="submit"
              class="q-mb-md full-width"
              @click="onClickSearch"
            />
          </div>
          <div class="col-6 q-pl-sm">
            <SInput label-text="Name" v-model="roomName" disable />
          </div>

          <div class="col-12">
            <q-slide-transition>
              <div v-if="isError" class="error-layout">
                <p class="error-text">{{ errorM }}</p>
              </div>
            </q-slide-transition>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancle"
          @click="onClickCancel"
        />
        <q-btn color="primary" label="OK" @click="onClickOk" />
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
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      roomNumber: '',
      roomName: '',
      errorM: '',
      isError: false,
    });

    const onClickSearch = async () => {
      const foInvoiceTransferRoomBody = {
        pvILanguage: 1,
        currRoom: state.roomNumber,
      };
      const foInvoiceTransferRoom = await $api.frontOfficeCashier.foInvoiceTransferRoom(
        foInvoiceTransferRoomBody
      );

      if (foInvoiceTransferRoom.msgStr === '') {
        state.roomName = foInvoiceTransferRoom.gname;
        state.isError = false;
      } else {
        state.errorM = foInvoiceTransferRoom.msgStr;
        state.isError = true;
      }
    };

    const onReset = () => {
      state.roomNumber = '';
      state.roomName = '';
    };

    const onClickOk = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const getSelectedBill: any =
        store.getters.focGuestFolio.GET_SELECTED_BILL;

      const foInvoiceMiTransferBody = {
        caseType: 2,
        room: state.roomNumber,
        bilRecid: getSelectedBill['rec-id'],
        userInit: userAuth.userInit,
      };
      const foInvoiceMiTransfer = await $api.frontOfficeCashier.foInvoiceMiTransfer(
        foInvoiceMiTransferBody
      );

      if (foInvoiceMiTransfer.runCreateLogfile === 'true') {
        const foInvoiceCreateLogfileBody = {
          resno: foInvoiceMiTransfer.reslineResnr,
          reslinno: foInvoiceMiTransfer.reslineReslinnr,
          rmno: foInvoiceMiTransfer.room,
          userInit: userAuth.userInit,
        };
        const foInvoiceCreateLogfile = await $api.frontOfficeCashier.foInvoiceCreateLogfile(
          foInvoiceCreateLogfileBody
        );

        if (foInvoiceCreateLogfile.outputOkFlag === 'true') {
          const foInvoiceFillRescommentBody = {
            bilRecid: getSelectedBill['rec-id'],
            fillCo: false,
          };
          const foInvoiceFillRescomment = await $api.frontOfficeCashier.foInvoiceFillRescomment(
            foInvoiceFillRescommentBody
          );

          if (foInvoiceFillRescomment.outputOkFlag === 'true') {
            const getFoInvoicePrepare: any =
              store.getters.focGuestFolio.GET_FO_INVOICE_PREPARE;
            const billListFOInvoiceBody = {
              bilFlag: 0,
              bilRecid: getSelectedBill['rec-id'],
              room: getSelectedBill.zinr,
              vipflag: false,
              fillCo: true,
              doubleCurrency: getFoInvoicePrepare.doubleCurrency,
              foreignRate: getFoInvoicePrepare.foreignRate,
            };

            const billListFOInvoice = await $api.frontOfficeCashier.billListFOInvoice(
              billListFOInvoiceBody
            );

            store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(
              billListFOInvoice
            );

            onReset();
            store.commit.focGuestFolio.SET_DIALOG_AUTO_TRANSFER(false);
          }
        }
      }
    };

    const onClickCancel = () => {
      onReset();
      store.commit.focGuestFolio.SET_DIALOG_AUTO_TRANSFER(false);
    };

    const getDialogAutoTransfer = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_AUTO_TRANSFER;
    });

    return {
      onReset,
      onClickOk,
      onClickCancel,
      getDialogAutoTransfer,
      onClickSearch,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  width: 700px;
}

.q-toolbar {
  background: $primary-grad;
}

.error-layout {
  background-color: #ffc0c6;
  border-left: 3px solid #c10015;
  border-right: 3px solid #c10015;
  border-radius: 3px;
}

.error-text {
  margin: 0;
  padding: 7px 15px;
}
</style>
