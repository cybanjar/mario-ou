<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchPayment
        :payment="paymentSelected"
        :total-balance="totalBalance"
        @search="onSearch"
        @remark="dialogRemark.show"
      ></SearchPayment>
    </q-drawer>
    <div class="q-pa-lg">
      <SharedModuleActions
        :actions="[
          {
            name: 'Pay',
          },
        ]"
        @onActions="mapActions"
      />
      <TablePayment
        :data="tablePrep.result"
        :loading="tablePrep.data.isLoading"
        @update:selected="selectData"
      />
    </div>
    <template v-if="paymentSelected.length > 0">
      <DialogRemarkDebt
        :value="dialogRemark.status"
        :payment="paymentSelected"
        @submit="remarkComment"
        @hide="dialogRemark.hide"
      ></DialogRemarkDebt>
    </template>
    <DialogAddPayment
      :data-selected="paymentSelected"
      :debit-article="requestData.artnr"
      :value="dialogPayment.status"
      :total-balance="totalBalance"
      @hide="dialogPayment.hide"
    ></DialogAddPayment>
  </q-page>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed,
} from '@vue/composition-api';
import { ResPaymentDebtPayList } from './models/payment.model';
import { ResDebitor } from './models/debitor.model';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformPaymentData } from './utils/reformData';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const dialogRemark = useDialog();
    const dialogPayment = useDialog();
    const paymentSelected = ref([]);
    const state = reactive({
      isFetching: false,
      paymentList: [] as (ResPaymentDebtPayList & { key: number })[],
      selectedRemark: '',
      selectedRow: [] as ResPaymentDebtPayList[],
    });

    const { result: isDisable } = usePrepare(
      true,
      () =>
        $api.common.checkPermission({
          arrayNr: '15',
          expectedNr: '2',
        }),
      (tempData) => {
        if (tempData.zugriff !== 'true') {
          $q.notify({
            type: 'negative',
            message: tempData.messStr,
          });
        }
      },
      (tempData) => tempData.zugriff !== 'true',
      true
    );

    const isUpdateComment = ref(false);
    const requestData = ref({
      artnr: undefined,
    });

    const totalBalance = computed(() =>
      paymentSelected.value.reduce((t, s) => (t += s.balanceOri), 0)
    );

    const tablePrep = usePrepare(
      false && !isDisable.value,
      (requestData) =>
        $api.accountReceivable.getPaymentDebtPayList(requestData),
      undefined,
      (tempData) => reformPaymentData(tempData),
      []
    );

    function onSearch(param) {
      requestData.value = param;
      fetchData();
    }

    function fetchData() {
      if (requestData.value) {
        tablePrep.refetch(requestData.value);
      }
    }

    async function remarkComment(remark: string) {
      const selectDept: ResPaymentDebtPayList = paymentSelected.value[0];
      const debitor = await $api.accountReceivable.getReadDebitor({
        caseType: '7',
        artNo: selectDept['ar-recid'],
      });

      const updateData: ResDebitor = {
        ...debitor,
        'tb-recid': selectDept.recid,
        rechnr: selectDept.referenceNumber,
        vesrcod: remark,
      };

      const response = await $api.accountReceivable.manualARWriteDebt({
        caseType: 2,
        tDebitor: { 't-debitor': [updateData] },
      });

      if (response.outputOkFlag === true && response.successFlag === true) {
        $q.notify({
          type: 'positive',
          message: 'Remark Has Been Updated',
          timeout: 2000,
          onDismiss: () => {
            dialogRemark.hide();
            tablePrep.refetch();
          },
        });
      } else {
        $q.notify({
          type: 'negative',
          message: 'Select data to add Payment',
        });
      }
    }

    function onRowClick(remark: string) {
      state.selectedRemark = remark;
    }

    function onSelection(selectedRow: ResPaymentDebtPayList[]) {
      state.selectedRow = selectedRow;
    }

    function selectData({ selected }) {
      paymentSelected.value = selected;
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
        case 'onPay':
          if (0 >= totalBalance.value) {
            $q.notify({
              type: 'warning',
              message: 'Select data to add Payment',
            });
          } else {
            dialogPayment.show();
          }
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      isUpdateComment,
      onSearch,
      onRowClick,
      tablePrep,
      onSelection,
      remarkComment,
      selectData,
      dialogRemark,
      requestData,
      dialogPayment,
      paymentSelected,
      mapActions,
      totalBalance,
    };
  },
  components: {
    SearchPayment: () => import('./components/SearchPayment.vue'),
    TablePayment: () => import('./components/TablePayment.vue'),
    DialogRemarkDebt: () => import('./components/DialogRemarkDebt.vue'),
    DialogAddPayment: () => import('./components/DialogAddPayment.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
