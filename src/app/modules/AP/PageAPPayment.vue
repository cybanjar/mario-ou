<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchPayment
        @onSearch="onSearch"
        :selected-remark="selectedRemark"
        :selected-row="selectedRow"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="getData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg" @click="showDialog">
          <img :src="require('~/app/icons/Icon-Pay.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img
            :src="require('~/app/icons/Icon-Attach-Payment.svg')"
            height="30"
          />
        </q-btn>
      </div>

      <TablePayment
        :payment-list="paymentList"
        :is-fetching="isFetching"
        @onRowClick="onRowClick"
        @onSelection="onSelection"
      />

      <DialogPayAPPayment
        :show="dialogVisible"
        @hide="dialogVisible = false"
        :selected-row="selectedRow"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { ReqPaymentList, ResPaymentList } from './models/payment.model';

export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const state = reactive({
      isFetching: false,
      paymentList: [] as (ResPaymentList & { key: number })[],
      selectedRemark: '',
      selectedRow: [] as ResPaymentList[],
    });

    let requestData: ReqPaymentList;

    async function getData() {
      if (requestData) {
        state.isFetching = true;
        const data = await $api.accountsPayable.getPaymentList(requestData);
        state.paymentList = data.map((item, index) => {
          const itemWithKey: ResPaymentList & { key: number } = {
            key: index,
            ...item,
          };
          return itemWithKey;
        });
        state.isFetching = false;
      }
    }

    function onSearch(supplierName: string, date: string) {
      requestData = {
        artSelected: 1,
        billDate: date,
        billName: supplierName,
      };

      getData();
    }

    function onRowClick(remark: string) {
      state.selectedRemark = remark;
    }

    function onSelection(selectedRow: ResPaymentList[]) {
      state.selectedRow = selectedRow;
    }

    const dialogVisible = ref(false);
    function showDialog() {
      if (state.selectedRow.length < 1) {
        $q.notify({
          type: 'warning',
          message: 'Select data to add Payment',
          timeout: 2000,
        });
        return;
      }

      dialogVisible.value = true;
    }

    return {
      ...toRefs(state),
      onSearch,
      getData,
      onRowClick,
      onSelection,
      dialogVisible,
      showDialog,
    };
  },
  components: {
    SearchPayment: () => import('./components/SearchPayment.vue'),
    TablePayment: () => import('./components/TablePayment.vue'),
    DialogPayAPPayment: () => import('./components/DialogPayAPPayment.vue'),
  },
});
</script>
