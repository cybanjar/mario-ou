<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchLostFound @search="findItem" />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <TableLostFound
        :loading="tablePrep.data.isLoading"
        :data="tablePrep.result"
        @delete="deleteData"
        @row-click="showAdd"
      />
    </div>
    <template v-if="addRecord">
      <DialogAddLostFound
        :record="addRecord"
        :value="addDialog.status"
        @hide="addDialog.hide"
        @add-record="saveRecord"
      />
    </template>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { reformHKMainTable } from './utils/reformData';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
import { date } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api, $q } }) {
    const searchQuery = reactive({
      display: 1,
      search: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
    const addDialog = useDialog();
    const addRecord = ref();
    const tablePrep = usePrepare(
      false,
      () =>
        $api.housekeeping.getLostAndFound({
          comments: searchQuery.search || ' ',
          frDate: searchQuery.fromDate,
          sorttype: searchQuery.display,
          toDate: searchQuery.toDate,
        }),
      undefined,
      (tempData) => reformHKMainTable(tempData),
      []
    );

    const delPrep = usePrepare(
      false,
      (targetId) =>
        $api.housekeeping.deleteLostAndFound({
          recId: targetId,
        }),
      (tempData) => {
        if (tempData.outputOkFlag == 'true') {
          $q.notify({
            type: 'positive',
            message: 'delete success',
          });
          tablePrep.refetch();
        } else {
          $q.notify({
            type: 'negative',
            message: 'delete error',
          });
        }
      }
    );

    const addRecordPrep = usePrepare(
      false,
      (record) => $api.housekeeping.updateAddLostAndFound(record),
      (tempData) => {
        console.log(tempData);
        if (tempData.outputOkFlag == 'true') {
          $q.notify({
            type: 'positive',
            message: 'successfuly save record',
            onDismiss: () => {
              addDialog.hide();
              tablePrep.refetch();
            },
          });
        } else {
          $q.notify({
            type: 'negative',
            message: 'failed save record',
          });
        }
      }
    );

    const addAccShow = usePrepare(
      false,
      async (record) => {
        const { zugriff } = await $api.common.checkPermission({
          arrayNr: '16',
          expectedNr: '2',
        });
        if (zugriff === 'true') {
          addRecord.value = record.row;
          return true;
        }
        return false;
      },
      (hasAccess) => {
        if (!hasAccess) {
          $q.notify({
            type: 'negative',
            message: 'Sorry, No Access Right. Access Code 16,2',
          });
        } else {
          addDialog.show();
        }
      }
    );

    function deleteData(key: number) {
      const item = tablePrep.result.value.find((it) => it.key === key);

      if (item) {
        delPrep.refetch(item.recid);
      }
    }

    function showAdd(record: any) {
      addAccShow.refetch(record);
    }

    function findItem(incomeQuery) {
      console.log(incomeQuery);
      Object.assign(searchQuery, incomeQuery);
      tablePrep.refetch();
    }

    function saveRecord(record: any) {
      addRecordPrep.refetch({
        recId: record.recid, //update
        zinr: record.room,
        itemDescription: record.desc,
        fromDate: date.formatDate(record.date, 'MM/DD/YY'),
        zeit: record.time, // note
        remark: record.remark,
        claimBy: record.claim,
        claimDate: date.formatDate(record.claim_date, 'MM/DD/YY'),
        expiredDate: date.formatDate(record.exp, 'MM/DD/YY'),
        reportedBy: record.reported,
        reportDate: date.formatDate(record.report_date, 'MM/DD/YY'),
        phoneNo: record.phone,
        refNo: record.ref,
        foundby: record.found,
        location: record.location,
        submitted: record.submitted,
        userInit: record.userinit,
      });
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          tablePrep.refetch();
          break;
        default:
          break;
      }
    }
    return {
      mapActions,
      tablePrep,
      deleteData,
      findItem,
      addDialog,
      addRecord,
      showAdd,
      saveRecord,
      addAccShow,
    };
  },
  components: {
    SearchLostFound: () => import('./components/SearchLostFound.vue'),
    TableLostFound: () => import('./components/TableLostFound.vue'),
    DialogAddLostFound: () => import('./components/DialogAddLostFound.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
