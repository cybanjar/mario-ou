<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchAgingBalance
        :balance="withBalance"
        :detail="showDetail"
        :display-main="displayMain"
        @search="onSearch"
        @filter="changeMode"
        @back-main="switchToMain"
      />
    </q-drawer>
    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableAgingBalance
        :data="tablePrep.result"
        :show-detail="showDetail"
        :with-balance="withBalance"
        :display-main="displayMain"
        @showCustomer="switchToCust"
        @showReserv="showReserv"
      />
      <template v-if="billNo">
        <DialogReservation
          :bill-no="billNo"
          :value="resvDialog.status"
          @hide="resvDialog.hide"
        />
      </template>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformAgingBalanceData, reformCustomerData } from './utils/reformData';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const searchParams = ref();
    const showDetail = ref(false);
    const withBalance = ref(false);
    const displayMain = ref(true);
    const billNo = ref(null);
    const resvDialog = useDialog(false);
    // permission check
    const permPrep = usePrepare<any, boolean>(
      true,
      () =>
        $api.common.checkPermission({
          arrayNr: 15,
          expectedNr: 1,
        }),
      undefined,
      (checkPermission) => checkPermission.zugriff === 'true',
      false
    );

    const tablePrep = usePrepare(
      false,
      () => $api.accountReceivable.getARAge1(searchParams.value),
      undefined,
      (tempData) =>
        unref(displayMain)
          ? reformAgingBalanceData(tempData)
          : reformCustomerData(tempData),
      []
    );

    function fetchTableData() {
      const params = unref(searchParams);
      if (params && unref(permPrep.result) === true) {
        tablePrep.refetch(params);
      } else {
        $q.notify({
          type: 'negative',
          message: 'User does not has access or permission',
        });
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

    function changeMode({
      showDetail: pShowDetail,
      withBalance: pWithBalance,
    }) {
      showDetail.value = pShowDetail;
      withBalance.value = pWithBalance;
    }

    function switchToMain() {
      searchParams.value.artnr = undefined;
      searchParams.value.gastnr = undefined;
      displayMain.value = true;

      fetchTableData();
    }

    function showReserv({ billNo: sBillNo }) {
      billNo.value = sBillNo;
      resvDialog.show();
    }

    function switchToCust({ user, guest }) {
      searchParams.value.artnr = user;
      searchParams.value.gastnr = guest;
      displayMain.value = false;

      fetchTableData();
    }

    return {
      onSearch,
      mapActions,
      tablePrep,
      showDetail,
      withBalance,
      changeMode,
      displayMain,
      switchToCust,
      switchToMain,
      resvDialog,
      showReserv,
      billNo,
    };
  },
  components: {
    SearchAgingBalance: () => import('./components/SearchAgingBalance.vue'),
    TableAgingBalance: () => import('./components/TableAgingBalance.vue'),
    DialogReservation: () => import('./components/DialogReservation.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
