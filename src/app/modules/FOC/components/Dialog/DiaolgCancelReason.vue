<template>
  <q-dialog v-model="getDialogCancelReason">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Cancel
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <SInput label-text="Enter Cancel Reason" v-model="cancelStr" />
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
import { date } from 'quasar';
import { Cookies } from 'quasar';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      cancelStr: '',
    });

    const getDialogCancelReason = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_CANCEL_REASON;
    });

    const getSelectedTBillLine = computed(() => {
      const res: any = store.getters.focGuestFolio.GET_SELECTED_TBILL_LINE;
      return res;
    });

    const onClickOk = async () => {
      const userAuth: any = Cookies.get('userAuth');
      const getSelectedTBillLine: any =
        store.getters.focGuestFolio.GET_SELECTED_TBILL_LINE;
      const getSelectedBill: any =
        store.getters.focGuestFolio.GET_SELECTED_BILL;
      let getBillListFoInvoice: any =
        store.getters.focGuestFolio.GET_BILL_LIST_FO_INVOICE;
      const getFoInvoicePrepare: any =
        store.getters.focGuestFolio.GET_FO_INVOICE_PREPARE;
      const getGetHtParam0: any =
        store.getters.focGuestFolio.GET_GET_HT_Param_0;
      if (state.cancelStr === '') {
        return;
      }

      const getReadBill = await $api.frontOfficeCashier.getReadBill({
        caseType: 2,
        billNo: getSelectedTBillLine.rechnr,
        resNo: getSelectedBill.resnr,
        reslinNo: getSelectedBill.reslinnr,
        actFlag: 0,
      });

      if (getReadBill.tBill['t-bill'][0].flag === 1) {
        store.commit.focGuestFolio.SET_DIALOG_CANCEL_REASON(false);
        store.commit.focGuestFolio.SET_ERROR_MESSAGE({
          from: 'general',
          title1: 'Message',
          text1: `The bill is no longer active.`,
          btnOk: 'Ok',
        });
        store.commit.focGuestFolio.SET_DIALOG_ERROR(true);
      } else {
        const foInvoiceBillUpdate: any = await $api.frontOfficeCashier.foInvoiceBillUpdate(
          {
            billRecid: getSelectedBill['rec-id'],
            currRechnr: getSelectedTBillLine.rechnr,
            tbillFlag: getBillListFoInvoice.tBill['t-bill'][0].flag,
            changeFlag:
              getFoInvoicePrepare.changeDate === 'true' ? true : false,
            resnr: getSelectedBill.resnr,
            reslinnr: getSelectedBill.reslinnr,
            pvILanguage: 1,
            bilFlag: 0,
            transdate: date.formatDate(getGetHtParam0.fdate, 'MM/DD/YYYY'),
            billart: getSelectedTBillLine.artnr,
            currDepartment: getSelectedTBillLine.departement,
            amount: parseInt(getSelectedTBillLine.betrag) * -1,
            amountForeign:
              (parseInt(getSelectedTBillLine.betrag) * -1) /
              getFoInvoicePrepare.exchgRate,
            description: getSelectedTBillLine.bezeich,
            qty: getSelectedTBillLine.anzahl * -1,
            currRoom: getSelectedBill.zinr,
            userInit: userAuth.userInit,
            artnr: getSelectedTBillLine.artnr,
            price: parseInt(getSelectedTBillLine.epreis),
            exchgRate: getFoInvoicePrepare.exchgRate,
            priceDecimal: getFoInvoicePrepare.priceDecimal,
            doubleCurrency:
              getFoInvoicePrepare.doubleCurrency === 'true' ? true : false,
            'p-83': getFoInvoicePrepare.p83 === 'true' ? true : false,
            kreditlimit: getBillListFoInvoice.kreditlimit,
            foreignRate: getFoInvoicePrepare.foreignRate,
            billDate: date.formatDate(getGetHtParam0.fdate, 'MM/DD/YYYY'),
            voucherNr: ' ',
            cancelStr: '',
          }
        );

        getBillListFoInvoice.balance = foInvoiceBillUpdate.balance;
        getBillListFoInvoice.tBill = foInvoiceBillUpdate.tBill;
        getBillListFoInvoice.tBillLine = foInvoiceBillUpdate.tBillLine;

        store.commit.focGuestFolio.SET_BILL_LIST_FO_INVOICE(
          getBillListFoInvoice
        );
        store.commit.focGuestFolio.SET_DIALOG_CANCEL_REASON(false);
      }
    };

    return {
      getDialogCancelReason,
      getSelectedTBillLine,
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
