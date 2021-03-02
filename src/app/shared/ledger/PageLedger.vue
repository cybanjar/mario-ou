<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchLedger
        :module="module"
        :credit="creaditAcc"
        :debit="debitAcc"
        :journal-type="journalType"
        @search="findTrans"
        @update:sort="changeSort"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableLedger
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
        :display="tableDisplay"
        @update:selected="handleSelect"
        @action:view="showViewTrans"
        @action:edit="showEditTrans"
      />
    </div>
    <template v-if="viewDialog.status === true">
      <ViewDialogTrans
        :value="viewDialog.status"
        :jnr="selectTrans.jnr"
        :refno="selectTrans.refno"
        :record-id="selectTrans.recordId"
        @hide="viewDialog.hide"
        @onOKClick="viewDialog.hide"
        @onCancelClick="viewDialog.hide"
      ></ViewDialogTrans>
    </template>
    <template v-if="editDialog.status === true">
      <JournalTransEdit
        ref="editDialog"
        :set="(ref = selectTrans.refno)"
        :title="`G/L Journal Edit - ${ref}`"
        :value="editDialog.status"
        :journaltype="3"
        :jnr="selectTrans.jnr"
        @hide="editDialog.hide() && tablePrep.refetch()"
        @onOKClick="editDialog.hide"
        @onCancelClick="editDialog.hide"
      ></JournalTransEdit>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ModuleLedgerAbbr, ledgerType } from '../../helpers/ledgerType.helper';
import { reformLedgerData, LedgerData } from './helpers/reformData.helper';
import { useMoney } from '../compositions/use-money.composition';
import { usePrepare } from '../compositions/use-prepare.composition';
import { SortType } from './tables/ledger.tables';
import { useDialog } from '../compositions/use-dialog.composition';

export default defineComponent({
  props: {
    module: { type: String as () => ModuleLedgerAbbr, required: true },
  },
  setup(props, { root: { $api, $q } }) {
    const params = ledgerType(props.module);
    const searchParams = ref();
    const { acc: debitAcc, add: addDebitAcc } = useMoney(0);
    const { acc: creaditAcc, add: addCreditAcc } = useMoney(0);
    const selectTrans = ref<LedgerData>();
    const tableDisplay = ref(SortType.REMARK);
    const editDialog = useDialog();
    const viewDialog = useDialog();

    const tablePrep = usePrepare(
      true,
      () => $api.common.getGLJoulistData(searchParams.value),
      undefined,
      (data) => reformLedgerData(data),
      []
    );

    const permPrep = usePrepare(
      false,
      () =>
        $api.common.checkPermission({
          arrayNr: params.ACCESS_NR,
          expectedNr: params.CODE,
        }),
      (data) => {
        if (data.zugriff === 'false') {
          $q.notify({
            type: 'negative',
            message: data.messStr,
          });
        }
      },
      (data) => data.zugriff === 'true',
      false
    );

    function findTrans(params) {
      searchParams.value = params;
      tablePrep.refetch();
    }

    function changeSort(type) {
      tableDisplay.value = type;
    }

    function handleSelect(rows: LedgerData[]) {
      debitAcc.value = 0;
      creaditAcc.value = 0;

      rows.forEach((rowItem) => {
        addDebitAcc(rowItem.debit);
        addCreditAcc(rowItem.credit);
      });
    }

    async function showEditTrans(ledger: LedgerData) {
      await permPrep.refetch();
      if (permPrep.result.value === true) {
        selectTrans.value = ledger;
        editDialog.show();
      }
    }

    function showViewTrans(ledger: LedgerData) {
      selectTrans.value = ledger;
      viewDialog.show();
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
      debitAcc,
      tablePrep,
      findTrans,
      mapActions,
      viewDialog,
      handleSelect,
      creaditAcc,
      changeSort,
      selectTrans,
      tableDisplay,
      editDialog,
      showViewTrans,
      showEditTrans,
      journalType: params.CODE,
    };
  },
  components: {
    SearchLedger: () => import('./components/SearchLedger.vue'),
    TableLedger: () => import('./components/TableLedger.vue'),
    ViewDialogTrans: () => import('./components/ViewDialogTrans.vue'),
    JournalTransEdit: () => import('./components/JournalTransEdit.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
