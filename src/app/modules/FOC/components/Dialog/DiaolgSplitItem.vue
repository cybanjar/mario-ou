<template>
  <q-dialog v-model="getDiaolgSplitItem">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Amount to be splited {{ getSelectedTBillLine.betrag }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <SInput label-text="Enter Split Amount" v-model="splitAmount" />
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
import { date } from 'quasar';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      splitAmount: '',
    });

    const getDiaolgSplitItem = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_SPLIT_ITEM;
    });

    const getSelectedTBillLine = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_SELECTED_TBILL_LINE;
      return res;
    });

    const onClickOk = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const getFoInvoicePrepare: any =
        store.getters.focGuestFolio.GET_FO_INVOICE_PREPARE;
      const getSelectedBill: any =
        store.getters.focGuestFolio.GET_SELECTED_BILL;
      const getSelectedTBillLine: any =
        store.getters.focGuestFolio.GET_SELECTED_TBILL_LINE;

      const foInvoiceSplitBline = await $api.frontOfficeCashier.foInvoiceSplitBline(
        {
          splitAmount: parseInt(state.splitAmount),
          userInit: userAuth.userInit,
          priceDecimal: getFoInvoicePrepare.priceDecimal,
          recId: getSelectedBill['rec-id'],
        }
      );

      if (foInvoiceSplitBline.outputOkFlag === 'true') {
        const readBillLine1 = await $api.frontOfficeCashier.readBillLine1({
          caseType: 3,
          pvILanguage: 0,
          rechNo: getSelectedTBillLine.rechnr,
          artNo: 0,
          deptNo: 0,
          anzahl: 0,
          epreis: 0,
          betrag: 0,
        });
        let getBillListFoInvoice: any =
          store.getters.focGuestFolio.GET_BILL_LIST_FO_INVOICE;

        getBillListFoInvoice.tBillLine = readBillLine1.tBillLine;
        store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(
          getBillListFoInvoice
        );

        store.commit.focGuestFolio.SET_DIALOG_SPLIT_ITEM(false);
      }
    };
    const onClickCancel = () => {
      store.commit.focGuestFolio.SET_DIALOG_SPLIT_ITEM(false);
    };

    return {
      getDiaolgSplitItem,
      getSelectedTBillLine,
      onClickOk,
      onClickCancel,
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
