<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchOutstanding @search="onSearch" />
    </q-drawer>
    <div class="q-pa-lg row">
      <SharedModuleActions @onActions="mapActions" />
      <div class="col-12">
        <TableOutstanding
          :loading="tablePrep.data.isLoading"
          :is-manual-inv-checked="searchFilter && searchFilter.showInv"
          :data="tablePrep.result"
          @action:delete="onDelete"
          @action:edit="onEdit"
        />
      </div>
    </div>
    <DialogManualAR
      :value="manualARDialog.status"
      @hide="manualARDialog.hide"
    ></DialogManualAR>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformDebitListData } from './utils/reformData';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';
export default defineComponent({
  setup(props, { root: { $api, $q } }) {
    const searchFilter = ref();
    const billNumber = ref('');
    const manualARDialog = useDialog(false);

    useExtraMenu([
      {
        handler: () => {
          manualARDialog.show();
        },
        icon: 'AR/Icon-ManualAR',
      },
    ]);

    const tablePrep = usePrepare(
      false,
      () => $api.accountReceivable.getDebitList(unref(searchFilter)),
      undefined,
      (tempData) => reformDebitListData(tempData, unref(billNumber)),
      []
    );

    const editPrep = usePrepare(
      false,
      (params) => $api.accountReceivable.writeDebitor(params),
      showStatusNotify('successfuly edit data', "Can't edit data ")
    );

    const delPrep = usePrepare(
      false,
      (params) => $api.accountReceivable.manualARDelete(params),
      showStatusNotify('successfuly delete data', "Can't delete data ")
    );

    function showStatusNotify(sucessMsg, failMsg) {
      return (tempData) => {
        const isSave = tempData.successFlag === 'true';
        $q.notify({
          type: isSave ? 'positive' : 'negative',
          message: isSave ? sucessMsg : tempData.msgStr || failMsg,
          onDismiss: () => {
            if (isSave) {
              tablePrep.refetch();
            }
          },
        });
      };
    }

    function hideManualAR() {
      // showManualAR.status.value = false;
    }

    function onSearch(filter, billNum) {
      searchFilter.value = filter;
      billNumber.value = billNum;
      tablePrep.refetch();
    }

    function onDelete(dataSelected) {
      let recid =
        dataSelected?.arRecid || '731473211807199714090471301296089626105445';
      let billNumber = dataSelected?.billNo || 1807199714;
      let initialManualARDeleteParams = {
        pvILanguage: 1,
        rechnr: billNumber,
        arRecid: recid,
      };
      delPrep.refetch(initialManualARDeleteParams);
    }

    function onEdit(params) {
      editPrep.refetch(params);
    }

    function mapActions(name: string) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
        default:
          break;
      }
    }

    return {
      manualARDialog,
      mapActions,
      onSearch,
      tablePrep,
      searchFilter,
      onDelete,
      onEdit,
    };
  },
  components: {
    DialogManualAR: () => import('./components/DialogManualAR.vue'),
    SearchOutstanding: () => import('./components/SearchAROutstanding.vue'),
    TableOutstanding: () => import('./components/TableAROutstanding.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
