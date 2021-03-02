<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchPaidAR @search="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TablePaidAR
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
        :show-inv="searchParams.showInv"
        @action:cancel-ar="dialog.show"
      />
      <DialogPaidARPay
        :data="tablePrep.result"
        :value="dialog.status"
        @hide="dialog.hide"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformPaymentListData } from './utils/reformData';
export default defineComponent({
  setup(_, { root: { $api } }) {
    const searchParams = ref({
      showInv: false,
    });
    const dialog = useDialog();

    const tablePrep = usePrepare(
      false,
      () => $api.accountReceivable.getARPaymentList(searchParams.value),
      undefined,
      (tempData) => reformPaymentListData(tempData),
      []
    );

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

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
          break;
        default:
          break;
      }
    }

    return {
      onSearch,
      mapActions,
      tablePrep,
      searchParams,
      dialog,
    };
  },
  components: {
    SearchPaidAR: () => import('./components/SearchPaidAR.vue'),
    TablePaidAR: () => import('./components/TablePaidAR.vue'),
    DialogPaidARPay: () => import('./components/DialogPaidARPay.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
