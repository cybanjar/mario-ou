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
    <template v-if="addDialog.status">
      <JournalTransAdd
        ref="addDialog"
        :journaltype="2"
        :columns="journalTransColumns"
        :shape="colShape"
        :value="addDialog.status"
        @dismit="tablePrep.refetch"
        @hide="addDialog.hide"
        @onOKClick="addDialog.hide"
        @onCancelClick="addDialog.hide"
      ></JournalTransAdd>
    </template>
    <template v-if="editDialog.status === true">
      <JournalTransEdit
        ref="editDialog"
        :journaltype="2"
        :value="editDialog.status"
        :jnr="selectTrans"
        :is-fixed="true"
        :columns="editColumns"
        :shape="shpeEdit"
        @dismit="tablePrep.refetch"
        @hide="editDialog.hide"
        @onOKClick="editDialog.hide"
        @onCancelClick="editDialog.hide"
      ></JournalTransEdit>
    </template>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { journalTransColumns, colShape } from './table/journal-add.table';
import {
  journalTransColumns as editColumns,
  colShape as shpeEdit,
} from './table/journal-edit.table';
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
  setup(props, { root: { $api, $q } }) {
    const debit = ref(0);
    const credit = ref(0);
    const permission = ref(false);
    const moduleParams = journalType(props.module);
    const selectTrans = ref(0);
    const searchParams = ref();
    const sortType = ref();

    const msgAccess = usePrepare(
      true,
      () =>
        $api.common.checkPermission({
          arrayNr: moduleParams.accessNr,
          expectedNr: 1,
        }),
      (data) => {
        // has a permission
        permission.value = data.zugriff === 'true';
      },
      (tempData) => tempData.messStr
    );

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
      if (permission.value === true) {
        selectTrans.value = params;
        editDialog.show();
      } else {
        $q.notify({
          type: 'negative',
          message: msgAccess.result.value,
        });
      }
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
          if (permission.value === true) {
            addDialog.show();
          } else {
            $q.notify({
              type: 'negative',
              message: msgAccess.result.value,
            });
          }
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
      journalTransColumns,
      colShape,
      editColumns,
      shpeEdit,
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
