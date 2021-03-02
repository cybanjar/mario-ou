<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchGuestPreferenceList
        @edit="showEdit"
        @add="addDialog.show"
        @delete="delRecord"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions
        :actions="[
          {
            name: 'Add',
            position: 'prefix',
          },
        ]"
        @onActions="mapActions"
      />
      <TableGuestPreferenceList
        :loading="tablePrep.data.isLoading"
        :selected.sync="selected"
        :data="tablePrep.result"
        @edit="showEdit"
      />
    </div>
    <DialogGuestPrefList
      key="add"
      name="New Modal"
      :record="addRecord"
      :value="addDialog.status"
      @hide="addDialog.hide"
      @save="handleSave"
    />
    <DialogGuestPrefList
      key="edit"
      name="Edit Modal"
      :record="editRecord"
      :value="editDialog.status"
      @hide="editDialog.hide"
      @save="handleSave"
    />
    <SDialogAlert
      :value="editAlertDialog.status"
      title="warning"
      message="Please select only 1"
      @hide="editAlertDialog.hide"
    />
    <SPopAlert
      ref="popUp"
      :value="deleteMult.status || deleteConfirm.status"
      :target="!deleteMult.status || '#pref-delete'"
      :message="
        deleteMult.status && deleteConfirm.status === false
          ? 'Warning! Please select 1'
          : 'Delete this preference?'
      "
      @save="doSaveDelete"
      @hide="hideAllAlert"
    />
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from '@vue/composition-api';
import { date } from 'quasar';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';
import { toSecond } from '~/app/shared/ledger/helpers/reformData.helper';
import { reformData } from './reforms/guestPrefList.reform';
import { formatTime } from '~/app/shared/helpers/utils';

export default defineComponent({
  setup(_, { root: { $api, $q }, refs }) {
    const addDialog = useDialog();
    const selected = ref([]);
    const editDialog = useDialog();
    const editAlertDialog = useDialog();
    const deleteMult = useDialog();
    const deleteConfirm = useDialog();
    const addRecord = ref({
      room: undefined,
      date: undefined,
      time: undefined,
      remark: undefined,
    });
    const editRecord = ref({
      key: undefined,
      room: undefined,
      date: undefined,
      time: undefined,
      remark: undefined,
      number3: undefined,
      id: undefined,
    });
    const tablePrep = usePrepare(
      true,
      () =>
        $api.housekeeping.getGuestPreferenceList({
          caseType: '11',
          qNo: '24',
        }),
      undefined,
      (tempData) => reformData(tempData),
      []
    );

    const delPrep = usePrepare(
      false,
      (tQueasy) =>
        $api.housekeeping.getGuestPreferenceDeleteList({
          caseType: '11',
          tQueasy: {
            't-Queasy': tQueasy,
          },
        }),
      (tempData) => {
        if (tempData.successFlag === 'true') {
          $q.notify({
            type: 'positive',
            message: 'Data has been deleted',
            onDismiss: () => tablePrep.refetch(),
          });
        }
      }
    );
    function showEdit(key) {
      const target =
        selected.value.length === 1
          ? !key
            ? selected.value[0]
            : tablePrep.result.value.find((it) => it.key === key)
          : undefined;
      if (target) {
        editRecord.value = {
          key: key,
          room: target.room_number,
          date: target.date,
          time: formatTime(target.time),
          remark: target.guest_preference,
          number3: target.number3,
          id: target.id,
        };
        editDialog.show();
      } else {
        editAlertDialog.show();
      }
    }

    async function handleSave(data: any) {
      const inEdit =
        editDialog.status.value === true && addDialog.status.value === false;
      date.extractDate;
      // add record
      if (inEdit === false) {
        const queries = {
          iZeit: toSecond(data.time),
          reason: data.remark,
          answer: '',
          zinr: data.room,
          frDate: date.formatDate(data.date, 'MM/DD/YYYY'),
        };
        const result = await $api.housekeeping.getGuestPreferenceAddList(
          queries
        );
        if (result.tQueasy['t-queasy'].length > 0) {
          $q.notify({
            type: 'positive',
            message: 'succesfully add data',
          });
          addDialog.hide();
          tablePrep.refetch();
        } else {
          $q.notify({
            type: 'negative',
            message: 'succesfully edit data',
          });
        }
      } else {
        const editdata = unref(editRecord);
        const queries = {
          key: '24',
          number3: editdata.number3,
          date1: date.formatDate(editdata.date, 'DD/MM/YY'),
          char1: editdata.room,
          number1: toSecond(editdata.time),
          char2: editdata.id,
          char3: editdata.remark,
        };
        const queries1 = {
          key: '24',
          number3: editdata.number3,
          date1: date.formatDate(data.date, 'DD/MM/YY'),
          char1: data.room,
          number1: toSecond(data.time),
          char2: editdata.id,
          char3: data.remark,
        };

        const result = await $api.housekeeping.getGuestPreferenceChgList('11', {
          tQueasy: {
            't-Queasy': [queries1],
          },
          tQueasy1: {
            't-Queasy1': [queries],
          },
        });

        if (result.successFlag === 'true') {
          $q.notify({
            type: 'positive',
            message: 'succesfully edit data',
          });
          editDialog.hide();
          tablePrep.refetch();
        } else {
          $q.notify({
            type: 'negative',
            message: 'succesfully edit data',
          });
        }
      }
    }

    function hideAllAlert() {
      deleteConfirm.hide();
      deleteMult.hide();
    }

    function doSaveDelete() {
      if (deleteConfirm.status.value === true && selected.value.length === 1) {
        const queasy = selected.value.map((record) => ({
          key: '24',
          number3: record.number3,
          date1: date.formatDate(record.date, 'DD/MM/YY'),
          char1: record.room,
          number1: record.time,
          char2: record.id,
          char3: record.remark,
        }));
        queasy.forEach((data) => delPrep.refetch(data));
        selected.value = []; // clear
        (refs.popUp as any).hide();
      } else if (
        deleteMult.status.value === false &&
        selected.value.length === 1
      ) {
        deleteConfirm.show();
      } else {
        (refs.popUp as any).hide();
      }
    }

    function delRecord() {
      if (selected.value.length !== 1) {
        deleteMult.show();
      } else {
        deleteConfirm.show();
        deleteMult.show();
      }
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
      mapActions,
      tablePrep,
      addDialog,
      editDialog,
      editRecord,
      addRecord,
      showEdit,
      handleSave,
      selected,
      delRecord,
      editAlertDialog,
      doSaveDelete,
      deleteMult,
      deleteConfirm,
      hideAllAlert,
    };
  },
  components: {
    TableGuestPreferenceList: () =>
      import('./components/TableGuestPreferenceList.vue'),
    SearchGuestPreferenceList: () =>
      import('./components/SearchGuestPreferenceList.vue'),
    DialogGuestPrefList: () => import('./components/DialogGuestPrefList.vue'),
    SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
