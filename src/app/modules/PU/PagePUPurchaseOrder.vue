<template>
  <SModulePage
    @onActions="onActions"
    :actions="[{ name: 'Add', position: 'prefix' }]"
  >
    <template #filters>
      <SearchPUPurchaseOrder
        :filters="filterOptions"
        :is-preparing="isPreparing"
        @search="onSearch"
      />
    </template>

    <template #table>
      <TablePUPurchaseOrder :is-fetching="isFetching" :rows="tableRows" />
    </template>

    <DialogPUPurchaseOrder :dialog.sync="dialog" />
  </SModulePage>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, ref } from '@vue/composition-api';
import { date } from 'quasar';

interface State {
  isPreparing: boolean;
  isFetching: boolean;
  filterOptions: {
    users: any[];
    departments: any[];
    suppliers: any[];
  };
  tableRows: any[];
}

export default defineComponent({
  components: {
    SearchPUPurchaseOrder: () =>
      import('./components/SearchPUPurchaseOrder.vue'),
    TablePUPurchaseOrder: () => import('./components/TablePUPurchaseOrder.vue'),
    DialogPUPurchaseOrder: () =>
      import('./components/DialogPUPurchaseOrder.vue'),
  },

  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      isPreparing: true,
      isFetching: false,
      filterOptions: {
        users: [],
        departments: [],
        suppliers: [],
      },
      tableRows: [],
    });

    // Fetch columns
    (async function () {
      state.isPreparing = true;

      const [resPrepare, resDepartments, resSuppliers] = await Promise.all([
        $api.accountsPayable.getPreparePurchaseOrderList(),
        $api.accountsPayable.readParameter(),
        $api.accountsPayable.getSupplierList(),
      ]);

      state.filterOptions.users = [
        { value: '', label: 'All' },
        ...resPrepare.users.map((user) => {
          return {
            label: `${user.userinit} - ${user.username}`,
            value: user.userinit,
          };
        }),
      ];

      state.filterOptions.departments = [
        { value: '', label: 'All' },
        ...resDepartments.map((department) => {
          return {
            label: `${department.varname} - ${department.vstring}`,
            value: department.varname,
          };
        }),
      ];

      state.filterOptions.suppliers = [
        { value: '', label: 'All' },
        ...resSuppliers.map((supplier) => {
          return {
            label: supplier.firma,
            value: supplier['lief-nr'],
          };
        }),
      ];

      state.isPreparing = false;
    })();

    const searches = ref<any>({});

    function onSearch(filters) {
      searches.value = filters;
      fetchPO();
    }

    async function fetchPO() {
      state.isFetching = true;

      const requestData = {
        usrname: searches.value.user || ' ',
        poNumber: searches.value.poNumber || ' ',
        lastDocNr: ' ',
        dmlOnly: searches.value.dmlOnly,
        tLiefNo: searches.value.supplier || 0,
        deptnr: searches.value.department || '-1',
        allSupp: searches.value.supplier === '',
        stattype: searches.value.status,
        sorttype: 1,
        fromDate: date.formatDate(searches.value.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(searches.value.date.end, 'MM/DD/YY'),
        billdate: '01/14/19',
      };

      state.tableRows = await $api.accountsPayable.getPurchaseOrderList(
        requestData
      );

      state.isFetching = false;
    }

    function onActions(actions) {
      switch (actions) {
        case 'onAdd':
          onAddNewPO();
        case 'onRefresh':
          fetchPO();
          break;
        case 'onPrint':
          // TODO: put print logic here
          break;
        default:
          break;
      }
    }

    const dialog = ref(false);

    function onAddNewPO() {
      dialog.value = true;
    }

    return {
      ...toRefs(state),
      onSearch,
      onActions,

      dialog,
    };
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
