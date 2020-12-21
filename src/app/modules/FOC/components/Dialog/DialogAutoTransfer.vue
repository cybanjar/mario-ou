<template>
  <q-dialog v-model="dialogAutoTransferModel">
    <q-card style="width: 700px;">
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
              @click="onSearch"
            />
          </div>
          <div class="col-6 q-pl-sm">
            <SInput label-text="Name" v-model="roomName" disable />
          </div>

          <div class="col-12">
            <q-slide-transition>
              <div
                v-if="isError"
                style="
                  background-color: #ffc0c6;
                  border-left: 3px solid #c10015;
                  border-right: 3px solid #c10015;
                  border-radius: 3px;
                "
              >
                <p style="margin: 0; padding: 7px 15px;">{{ errorM }}</p>
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
          @click="onClickCancle"
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

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      roomNumber: '',
      roomName: '',
      errorM: '',
      isError: false,
    });

    const onSearch = async () => {
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
      const foInvoiceMiTransferBody = {
        caseType: 2,
        room: state.roomNumber,
        bilRecid: store.getters.foc.GET_SELECTED_PARENT_BILLS['rec-id'],
        userInit: '01',
      };
      const foInvoiceMiTransfer = await $api.frontOfficeCashier.foInvoiceMiTransfer(
        foInvoiceMiTransferBody
      );

      if (foInvoiceMiTransfer.runCreateLogfile === 'true') {
        const foInvoiceCreateLogfileBody = {
          resno: foInvoiceMiTransfer.reslineResnr,
          reslinno: foInvoiceMiTransfer.reslineReslinnr,
          rmno: foInvoiceMiTransfer.room,
          userInit: '01',
        };
        const foInvoiceCreateLogfile = await $api.frontOfficeCashier.foInvoiceCreateLogfile(
          foInvoiceCreateLogfileBody
        );

        if (foInvoiceCreateLogfile.outputOkFlag === 'true') {
          const foInvoiceFillRescommentBody = {
            bilRecid: store.getters.foc.GET_SELECTED_PARENT_BILLS['rec-id'],
            fillCo: false,
          };
          const foInvoiceFillRescomment = await $api.frontOfficeCashier.foInvoiceFillRescomment(
            foInvoiceFillRescommentBody
          );

          if (foInvoiceFillRescomment.outputOkFlag === 'true') {
            const getPrepare: any = store.getters.foc.GET_PREPARE;
            const selectedParentBills: any =
              store.getters.foc.GET_SELECTED_PARENT_BILLS;
            const parentBillInvoiceBody = {
              bilFlag: 0,
              bilRecid: store.getters.foc.GET_SELECTED_PARENT_BILLS['rec-id'],
              room: selectedParentBills.zinr,
              vipflag: false,
              fillCo: true,
              doubleCurrency: getPrepare.doubleCurrency,
              foreignRate: getPrepare.foreignRate,
            };

            const parentBillInvoice = await $api.frontOfficeCashier.billListFOInvoice(
              parentBillInvoiceBody
            );

            store.commit.foc.SET_PARENT_BILLS_INVOICE(parentBillInvoice);

            onReset();
            emit('onDialogAutoTransfer', false);
          }
        }
      }
    };

    const onClickCancle = () => {
      onReset();
      emit('onDialogAutoTransfer', false);
    };
    const dialogAutoTransferModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogAutoTransfer', val);
      },
    });

    return {
      onReset,
      onClickOk,
      onClickCancle,
      dialogAutoTransferModel,
      onSearch,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
