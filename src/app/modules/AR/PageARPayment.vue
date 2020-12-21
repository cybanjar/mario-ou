<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchPayment
        @onSearch="onSearch"
        @onRemark="showDialogRemarkComment"
        :selected-remark="selectedRemark"
        :selected-row="selectedRow"
      ></SearchPayment>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="getData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg" @click="showAddPaymentDialog(true)">
          <img :src="require('~/app/icons/Icon-Pay.svg')" height="30" />
        </q-btn>
      </div>
      <TablePayment
        :payment-list="paymentList"
        :is-fetching="isFetching"
        @onRowClick="onRowClick"
        @onSelection="onSelection"
      />
    </div>
    <DialogRemarkDebt
      :show="isUpdateComment"
      :remark="selectedRemark"
      @submit="remarkComment"
      @hide="showDialogRemarkComment(false)"
    ></DialogRemarkDebt>
    <DialogAddPayment
      :v-if="isAddPayment"
      :show="isAddPayment"
      :select-depts="[paymentList[0]]"
      @hide="isAddPayment(false)"
    ></DialogAddPayment>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import {
  ResPaymentDebtPayList,
  ReqPaymentDebtPayList,
} from './models/payment.model';
import { ResDebitor } from './models/debitor.model';
export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const state = reactive({
      isFetching: false,
      paymentList: [] as (ResPaymentDebtPayList & { key: number })[],
      selectedRemark: '',
      selectedRow: [] as ResPaymentDebtPayList[],
    });

    const isUpdateComment = ref(false);
    const isAddPayment = ref(false);

    let requestData: ReqPaymentDebtPayList;

    async function getData() {
      if (requestData) {
        state.isFetching = true;
        const data = await $api.accountReceivable.getPaymentDebtPayList(
          requestData
        );
        state.paymentList = data.map((item, index) => {
          const itemWithKey: ResPaymentDebtPayList & { key: number } = {
            key: index,
            ...item,
          };
          return itemWithKey;
        });

        state.selectedRemark = '';
        state.isFetching = false;
      }
    }

    function onSearch({
      article,
      balance,
      billingNumber,
      billingReceiver,
      byDate,
    }) {
      requestData = {
        artSelected: 0,
        artnr: article,
        billNr: billingNumber,
        tempArt2: article,
        billDate: byDate,
        billName: ' ',
        toName: billingReceiver,
        billSaldo: balance,
      };

      getData();
    }

    function showDialogRemarkComment(status, remark) {
      state.selectedRemark = remark;
      isUpdateComment.value = status;
    }

    async function remarkComment(remark: string) {
      const selectDept = state.selectedRow[0];
      const debitor = await $api.accountReceivable.getReadDebitor({
        caseType: '7',
        artNo: selectDept['ar-recid'],
      });

      const updateData: ResDebitor = {
        ...debitor,
        vesrcod: remark,
      };

      const response = await $api.accountReceivable.manualARWriteDebt({
        caseType: 2,
        tDebitor: { 't-debitor': [updateData] },
      });

      if (response.outputOkFlag === true && response.successFlag === true) {
        showDialogRemarkComment(false, remark);
        $q.notify({
          type: 'warning',
          message: 'Remark Has Been Updated',
          timeout: 2000,
        });
        getData();
      } else {
        $q.notify({
          type: 'negative',
          message: 'Select data to add Payment',
        });
      }
    }

    function onRowClick(remark: string) {
      state.selectedRemark = remark;
    }

    function onSelection(selectedRow: ResPaymentDebtPayList[]) {
      state.selectedRow = selectedRow.map(({ selected, ...rest }) => ({
        selected: true,
        ...rest,
      }));
    }

    function showAddPaymentDialog(status) {
      if (state.selectedRow.length < 1) {
        $q.notify({
          type: 'negative',
          message: 'Please Select a Row',
        });
        return;
      }
      isAddPayment.value = status;
    }

    return {
      ...toRefs(state),
      getData,
      showAddPaymentDialog,
      isUpdateComment,
      showDialogRemarkComment,
      onSearch,
      onRowClick,
      onSelection,
      remarkComment,
      isAddPayment,
    };
  },
  components: {
    SearchPayment: () => import('./components/SearchPayment.vue'),
    TablePayment: () => import('./components/TablePayment.vue'),
    DialogRemarkDebt: () => import('./components/DialogRemarkDebt.vue'),
    DialogAddPayment: () => import('./components/DialogAddPayment.vue'),
  },
});
</script>
