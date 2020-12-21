<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchOutstandingBalance @search="onSearch" />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="tablePrep.refetch">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>
      <TableOutstandingBalance
        :loading="tablePrep.data.isLoading"
        :is-manual-inv-checked="searchFilter && searchFilter.showInv"
        :data="tablePrep.result"
        @action:delete="onDelete"
        @action:edit="onEdit"
      />
    </div>
    <DialogManualAR
      :value="showManualAR.status"
      @hide="showManualAR.hide"
    ></DialogManualAR>
  </q-page>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  onUnmounted,
  onMounted,
  ref,
  unref,
} from '@vue/composition-api';
import { IconSymbol } from '~/layouts/MainLayout.vue';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformDebitListData } from './utils/reformData';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
export default defineComponent({
  setup(props, { root: { $api, $q } }) {
    const menu: any = inject(IconSymbol);
    const searchFilter = ref();
    const billNumber = ref('');
    const showManualAR = useDialog();
    onMounted(() => {
      if (menu?.value) {
        menu.value.push({
          handler: () => {
            showManualAR.show();
          },
          icon: require('../../icons/AR/Icon-ManualAR.svg'),
        });
      }
    });

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

    onUnmounted(() => {
      if (menu?.value) {
        menu.value = [];
      }
    });

    function hideManualAR() {
      showManualAR.status.value = false;
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

    return {
      showManualAR,
      onSearch,
      tablePrep,
      searchFilter,
      onDelete,
      onEdit,
    };
  },
  components: {
    DialogManualAR: () => import('./components/DialogManualAR.vue'),
    SearchOutstandingBalance: () =>
      import('./components/SearchOutstandingBalance.vue'),
    TableOutstandingBalance: () =>
      import('./components/TableOutstandingBalance.vue'),
  },
});
</script>
