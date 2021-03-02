<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchFOTransaction @search="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableFOTransaction
        :data="tablePrep.result"
        :loading="tablePrep.data.isLoading"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';

import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformFOTrans } from './utils/reformData';
export default defineComponent({
  setup(_, { root: { $api } }) {
    const searchParams = ref();
    const tablePrep = usePrepare(
      true,
      () => $api.accountReceivable.getARJournal(searchParams.value),
      undefined,
      (tempData) => reformFOTrans(tempData),
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

    return { tablePrep, mapActions, onSearch };
  },
  components: {
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
    SearchFOTransaction: () => import('./components/SearchFOTransaction.vue'),

    TableFOTransaction: () => import('./components/TableFOTransaction.vue'),
  },
});
</script>
