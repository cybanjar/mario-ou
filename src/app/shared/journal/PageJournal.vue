<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchJournal
        :debit="debit"
        :credit="credit"
        @search="onSearch"
      ></SearchJournal>
    </q-drawer>
    <div class="q-pa-lg">
      <SharedModuleAction
        :actions="[{ name: 'Add', position: 'prefix' }]"
        @onActions="mapActions"
      />
      <TableGroupJournal
        :sort-type="sortType"
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
        @detail="calcDebitCredit"
        @edit-journal="editTrans"
      ></TableGroupJournal>
    </div>
    <JournalTransAdd
      ref="addDialog"
      :value="addDialog.status"
      @dismit="tablePrep.refetch"
      @hide="addDialog.hide"
      @onOKClick="addDialog.hide"
      @onCancelClick="addDialog.hide"
    ></JournalTransAdd>
    <JournalTransEdit
      ref="editDialog"
      :value="editDialog.status"
      :jnr="selectTrans"
      :is-fixed="true"
      @dismit="tablePrep.refetch"
      @hide="editDialog.hide"
      @onOKClick="editDialog.hide"
      @onCancelClick="editDialog.hide"
    ></JournalTransEdit>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import {
  ModuleJournalAbbr,
  journalType,
} from '~/app/helpers/journalType.helper';
import { usePrepare } from '../compositions/use-prepare.composition';
import { reformActiveJournalData } from './utils/reformData';
import { useDialog } from '../compositions/use-dialog.composition';

export default defineComponent({
  props: {
    module: { type: String as () => ModuleJournalAbbr, required: true },
  },
  setup(props, { root: { $api } }) {
    const debit = ref(0);
    const credit = ref(0);
    const moduleParams = journalType(props.module);
    const selectTrans = ref(0);
    const searchParams = ref();
    const sortType = ref();

    const tablePrep = usePrepare(
      false,
      (params) =>
        $api.common.commonJourList({
          caseType: '1', // fixed
          journaltype: moduleParams.code, // Modular params
          jtype1: moduleParams.jType, // Modular params
          ...params,
        }),
      undefined,
      (tempData) =>
        reformActiveJournalData(
          tempData?.glJouhdrList?.['gl-jouhdr-list'] || tempData
        ),
      []
    );
    const editDialog = useDialog();
    const addDialog = useDialog();

    function calcDebitCredit(journals: any[]) {
      debit.value = 0;
      credit.value = 0;
      journals.forEach((it: any) => {
        debit.value += it.debit;
        credit.value += it.credit;
      });
    }

    function editTrans(params: number) {
      selectTrans.value = params;
      editDialog.show();
    }

    function fetchTableData() {
      const params = unref(searchParams);
      if (params) {
        tablePrep.refetch(params);
      }
    }

    function onSearch(params) {
      searchParams.value = params;
      sortType.value = params.sorttype;

      fetchTableData();
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
        case 'onAdd':
          addDialog.show();
          break;
        default:
          break;
      }
    }

    return {
      tablePrep,
      debit,
      calcDebitCredit,
      credit,
      onSearch,
      searchParams,
      fetchTableData,
      sortType,
      addDialog,
      editDialog,
      mapActions,
      editTrans,
      selectTrans,
    };
  },
  components: {
    SearchJournal: () => import('./components/SearchJournal.vue'),
    TableGroupJournal: () => import('./components/TableGroupJournal.vue'),
    SharedModuleAction: () => import('../components/SharedModuleActions.vue'),
    JournalTransAdd: () => import('./components/JournalTransAdd.vue'),
    JournalTransEdit: () => import('./components/JournalTransEdit.vue'),
  },
});
</script>
