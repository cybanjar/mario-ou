<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchLedger
        :module="module"
        :credit="creaditAcc"
        :debit="debitAcc"
        @search="findTrans"
        @update:sort="changeSort"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="refetch">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <TableLedger
        :loading="resCode.isLoading"
        :error="resCode.isError"
        :data="tableData"
        :display="tableDisplay"
        @update:selected="handleSelect"
        @action:view="showViewTrans"
        @action:edit="showEditTrans"
      />
    </div>
    <template v-if="selectTrans">
      <ViewDialogTrans
        :value="viewDialog.status"
        :transaction="selectTrans"
        @hide="viewDialog.hide"
        @onOKClick="viewDialog.hide"
        @onCancelClick="viewDialog.hide"
      ></ViewDialogTrans>
      <JournalTransEdit
        ref="editDialog"
        :value="editDialog.status"
        :jnr="selectTrans.jnr"
        @dismit="refetch"
        @hide="editDialog.hide"
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
    const tableData = ref<LedgerData[]>([]);
    const selectTrans = ref<LedgerData>();
    const permission = ref(true); // allow all by default
    const tableDisplay = ref(SortType.DESC);
    const editDialog = useDialog();
    const viewDialog = useDialog();

    const { data: resCode, refetch } = usePrepare(
      true,
      () => {
        tableData.value = []; // clear table
        return $api.common.getGLJoulistData(searchParams.value);
      },
      (data) => {
        tableData.value = reformLedgerData(data);
      }
    );

    usePrepare(
      false,
      () => $api.common.checkPermission({ arrayNr: params.ACCESS_NR }),
      (data) => {
        // has a permission to perform edit
        permission.value = data.zugriff === 'true';
      }
    );

    function findTrans(params) {
      searchParams.value = params;
      refetch();
    }

    function changeSort(type) {
      if (tableData.value.length) {
        tableDisplay.value = type;
      }
    }

    function handleSelect(rows: LedgerData[]) {
      debitAcc.value = 0;
      creaditAcc.value = 0;

      rows.forEach((rowItem) => {
        addDebitAcc(rowItem.debit);
        addCreditAcc(rowItem.credit);
      });
    }

    function showEditTrans(ledger: LedgerData) {
      // check permission
      if (permission.value === true) {
        selectTrans.value = ledger;
        editDialog.show();
      } else {
        $q.notify({
          type: 'negative',
          message: "Don't Have Access To Edit",
        });
      }
    }

    function showViewTrans(ledger: LedgerData) {
      selectTrans.value = ledger;
      viewDialog.show();
    }

    return {
      debitAcc,
      refetch,
      findTrans,
      resCode,
      tableData,
      viewDialog,
      handleSelect,
      creaditAcc,
      changeSort,
      selectTrans,
      tableDisplay,
      editDialog,
      showViewTrans,
      showEditTrans,
    };
  },
  components: {
    SearchLedger: () => import('./components/SearchLedger.vue'),
    TableLedger: () => import('./components/TableLedger.vue'),
    ViewDialogTrans: () => import('./components/ViewDialogTrans.vue'),
    JournalTransEdit: () => import('./components/JournalTransEdit.vue'),
  },
});
</script>
