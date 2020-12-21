<template>
  <SModulePage @onActions="onActions"> </SModulePage>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';

// interface State {
//   isFetching: boolean;
//   tableColumns: ResChartOfAccounts[];
//   filterOptions: {
//     mains: any[];
//     categories: any[];
//     departments: any[];
//   };
//   filters: any;
//   remark: string;
//   accountId: string | null;
//   dialog: boolean;
// }

export default defineComponent({
  setup(_, { root: { $api, $route } }) {
    const state = reactive({
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
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
