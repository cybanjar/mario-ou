<template>
  <q-dialog v-model="getDialogRemark">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Remark
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <SInput
              v-model="guestRemark"
              label-text="Guest Remark"
              type="textarea"
              rows="4"
            />
            <SInput
              v-model="reservationRemark"
              label-text="Reservation Remark"
              type="textarea"
              rows="4"
            />
            <SInput
              v-model="reservationMemberRemark"
              label-text="Reservation Member Remark"
              type="textarea"
              rows="4"
            />
            <SInput
              v-model="folioRemark"
              label-text="Folio Remark"
              type="textarea"
              rows="4"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
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
  watch,
} from '@vue/composition-api';
import { store } from '~/store';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      guestRemark: '',
      reservationRemark: '',
      reservationMemberRemark: '',
      folioRemark: '',
    });

    watch(
      () => store.getters.focGuestFolio.GET_FO_INVOICE_CHANGE_COMMENT_PREPARE,
      (res: any) => {
        state.guestRemark = res.gCom;
        state.reservationRemark = res.resCom;
        state.reservationMemberRemark = res.reslCom;
        state.folioRemark = res.billCom;
      }
    );

    const getDialogRemark: any = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_REMARK;
    });

    const onClickOk = async () => {
      const selectedBill: any = store.getters.focGuestFolio.GET_SELECTED_BILL;
      const foInvoiceChangeCommentSave = await $api.frontOfficeCashier.foInvoiceChangeCommentSave(
        {
          billRecid: selectedBill['rec-id'],
          gComScreenValue: state.guestRemark,
          resComScreenValue: state.reservationRemark,
          reslComScreenValue: state.reservationMemberRemark,
          billComScreenValue: state.folioRemark,
        }
      );
      store.commit.focGuestFolio.SET_DIALOG_REMARK(false);
    };

    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_REMARK(false);
    };

    return {
      getDialogRemark,
      onClickOk,
      onClickCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  width: 100%;
  max-width: 350px;
}

.q-toolbar {
  background: $primary-grad;
}
</style>
