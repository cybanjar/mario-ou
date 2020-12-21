<template>
  <SModulePage @onActions="onActions">
    <template #filters>
      <SearchPUSupplierQuotation
        :suppliers="suppliers"
        :is-fetching="isFetching"
      />
    </template>

    <template #table>
      <!-- <TableGLChartOfAccounts
        :is-fetching="isFetching"
        :rows="tableColumns"
        :filters="filters"
        @onRowClick="onRowClick"
        @onShowBudget="onShowBudget"
      /> -->
    </template>

    <!-- <DialogGLChartOfAccounts
      :dialog="dialog"
      @onDialog="onDialog"
      :account-id="accountId"
    /> -->
  </SModulePage>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { usePagePUSupplierQuotation } from './functions/usePagePUSupplierQuotation';

export default defineComponent({
  components: {
    SearchPUSupplierQuotation: () =>
      import('./components/SearchPUSupplierQuotation.vue'),
  },
  setup(_, { root: { $api } }) {
    // Fetch columns
    // async function fetchColumns() {
    //   state.isFetching = true;

    //   const [resChart, resMain, resTypes, resDepart] = await Promise.all([
    //     $api.generalLedger.getChartOfAccount(),
    //     $api.generalLedger.getGLMainAccount(),
    //     $api.generalLedger.getGLFSType(),
    //     $api.generalLedger.getGLDeptAccount(),
    //   ]);
    //   state.tableColumns = resChart;
    //   state.filterOptions.mains = mapWithBezeich(resMain, 'code');
    //   state.filterOptions.categories = mapWithBezeich(resTypes, 'nr');
    //   state.filterOptions.departments = mapWithBezeich(resDepart, 'nr');

    //   state.isFetching = false;
    // }
    // fetchColumns();

    return {
      ...usePagePUSupplierQuotation($api),
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
