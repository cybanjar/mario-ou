<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchTransaction
        :debt="debt"
        :balance="balance"
        :paid="paid"
        :select-remarks="remarks"
        @search="onSearch"
      ></SearchTransaction>
    </q-drawer>
    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableTransaction
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
        @update:selected="mapToRemarks"
        @view:bill="showBillDetail"
      ></TableTransaction>
    </div>
    <template v-if="billNumber">
      <DialogBillDetail
        :bill-number="billNumber"
        :value="billDetail.status"
        @hide="billDetail.hide"
      />
    </template>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformTransactionDataTable } from './utils/reformData';
export default defineComponent({
  setup(props, { root: { $api } }) {
    const tablePrep = usePrepare(
      false,
      (params) => $api.accountReceivable.arSubledgerCreateAgeList(params),
      (tempData) => {
        debt.value = tempData.totDebt;
        balance.value = tempData.totBal;
        paid.value = tempData.totPaid;
      },
      (tempData) =>
        reformTransactionDataTable(tempData?.ageList?.['age-list'] || tempData),
      []
    );
    const debt = ref(0);
    const balance = ref(0);
    const paid = ref(0);
    const remarks = ref([]);
    const searchParams = ref();
    const billDetail = useDialog();
    const billNumber = ref();

    function mapToRemarks(trans: any[]) {
      remarks.value = trans.length ? trans : ['Unknown'];
    }
    function fetchTableData() {
      const params = unref(searchParams);
      if (params) {
        remarks.value = [];
        debt.value = 0;
        balance.value = 0;
        paid.value = 0;

        tablePrep.refetch(params);
      }
    }

    function onSearch(params) {
      searchParams.value = params;

      fetchTableData();
    }

    function showBillDetail(target: any) {
      billNumber.value = target.billNumber;
      billDetail.show();
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          fetchTableData();
          break;
        default:
      }
    }

    return {
      tablePrep,
      onSearch,
      debt,
      balance,
      paid,
      remarks,
      billDetail,
      mapToRemarks,
      fetchTableData,
      billNumber,
      showBillDetail,
      mapActions,
    };
  },
  components: {
    SearchTransaction: () => import('./components/SearchTransaction.vue'),
    TableTransaction: () => import('./components/TableTransaction.vue'),
    DialogBillDetail: () => import('./components/DialogBillDetail.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
