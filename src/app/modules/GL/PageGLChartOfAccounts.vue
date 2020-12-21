<template>
  <SModulePage @onActions="onActions">
    <template #filters>
      <SearchGLChartOfAccounts
        :filters="filterOptions"
        :remark="remark"
        :is-fetching="isFetching"
        @onSearch="onSearch"
      />
    </template>

    <template #table>
      <TableGLChartOfAccounts
        :is-fetching="isFetching"
        :rows="tableColumns"
        :filters="filters"
        @onRowClick="onRowClick"
        @onShowBudget="onShowBudget"
      />
    </template>

    <DialogGLChartOfAccounts
      :dialog="dialog"
      @onDialog="onDialog"
      :account-id="accountId"
    />
  </SModulePage>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { ResChartOfAccounts } from './models/responses/chartOfAccount.response';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';

interface State {
  isFetching: boolean;
  tableColumns: ResChartOfAccounts[];
  filterOptions: {
    mains: any[];
    categories: any[];
    departments: any[];
  };
  filters: any;
  remark: string;
  accountId: string | null;
  dialog: boolean;
}

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      isFetching: true,
      tableColumns: [],
      filterOptions: {
        mains: [],
        categories: [],
        departments: [],
      },
      filters: {},
      remark: 'Select a row',
      accountId: null,
      dialog: false,
    });

    // Fetch columns
    async function fetchColumns() {
      state.isFetching = true;

      const [resChart, resMain, resTypes, resDepart] = await Promise.all([
        $api.generalLedger.getChartOfAccount(),
        $api.generalLedger.getGLMainAccount(),
        $api.generalLedger.getGLFSType(),
        $api.generalLedger.getGLDeptAccount(),
      ]);
      state.tableColumns = resChart;
      state.filterOptions.mains = mapWithBezeich(resMain, 'code');
      state.filterOptions.categories = mapWithBezeich(resTypes, 'nr');
      state.filterOptions.departments = mapWithBezeich(resDepart, 'nr');

      state.isFetching = false;
    }
    fetchColumns();

    function onRowClick({ bemerk }) {
      state.remark = bemerk;
    }

    function onShowBudget(accountId) {
      state.accountId = accountId;
      onDialog(true);
    }

    function onSearch(filters) {
      state.filters = filters;
    }

    function onDialog(val) {
      state.dialog = val;
    }

    function onActions(actions) {
      switch (actions) {
        case 'onRefresh':
          fetchColumns();
          break;
        case 'onPrint':
          // TODO: put print logic here
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      onSearch,
      onRowClick,
      onDialog,
      onShowBudget,
      onActions,
    };
  },
  components: {
    SearchGLChartOfAccounts: () =>
      import('./components/SearchGLChartOfAccounts.vue'),
    TableGLChartOfAccounts: () =>
      import('./components/TableGLChartOfAccounts.vue'),
    DialogGLChartOfAccounts: () =>
      import('./components/DialogGLChartOfAccounts.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
