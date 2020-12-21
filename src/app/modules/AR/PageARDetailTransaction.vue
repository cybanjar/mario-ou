<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchTransaction
        :dept="dept"
        :balance="balance"
        :paid="paid"
        :select-remarks="remarks"
        @search="onSearch"
      ></SearchTransaction>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="fetchTableData">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>
      <TableTransaction
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
        @update:selected="mapToRemarks"
      ></TableTransaction>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformTransactionDataTable } from './utils/reformData';
export default defineComponent({
  setup(props, { root: { $api } }) {
    const tablePrep = usePrepare(
      false,
      (params) => $api.accountReceivable.arSubledgerCreateAgeList(params),
      (tempData) => {
        dept.value = tempData.totBal;
        balance.value = tempData.totDebt;
        paid.value = tempData.totPaid;
      },
      (tempData) =>
        reformTransactionDataTable(tempData?.ageList?.['age-list'] || tempData),
      []
    );
    const dept = ref(0);
    const balance = ref(0);
    const paid = ref(0);
    const remarks = ref([]);
    const searchParams = ref();

    function mapToRemarks(trans: any[]) {
      remarks.value = trans.map((it) => it.billName || 'Unknown');
    }
    function fetchTableData() {
      const params = unref(searchParams);
      if (params) {
        tablePrep.refetch(params);
      }
    }

    function onSearch(params) {
      searchParams.value = params;

      fetchTableData();
    }

    return {
      tablePrep,
      onSearch,
      dept,
      balance,
      paid,
      remarks,
      mapToRemarks,
      fetchTableData,
    };
  },
  components: {
    SearchTransaction: () => import('./components/SearchTransaction.vue'),
    TableTransaction: () => import('./components/TableTransaction.vue'),
  },
});
</script>
