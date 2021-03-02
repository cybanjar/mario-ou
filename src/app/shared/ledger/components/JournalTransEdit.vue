<template>
  <DialogJournalEdit
    v-bind="$attrs"
    v-on="$listeners"
    :columns="columns"
    :shape="shape"
    @setRecord="saveData"
    @delrecord="delRec"
  />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { JournalTrans, TransTable } from '../../models/journal.model';
import paramDataTrans from '../helpers/reformParam.helper';
import { journalTransColumns, colShape } from '../tables/journal-edit.table';

export default defineComponent({
  inheritAttrs: true,
  setup(_, { root: { $api, $q } }) {
    async function saveData(params: JournalTrans, exists: boolean) {
      const mode = exists ? 'chg' : 'add';

      const reqParams = paramDataTrans(
        {
          account: params?.accNo,
          debit: params?.debit,
          credit: params?.credit,
          remark: params?.remark,
          description: params?.description,
          referenceNo: params?.referenceNo,
        },
        {
          remaining: params?.remaining,
          jnr: params.jnr + '',
          recordId: params?.recjournid,
        },
        {
          id: ' ',
          recJournId: params?.recjournid,
          mode: mode,
        }
      );
      const saveResult = await $api.common.saveLedgerTrans(reqParams);

      if (saveResult.flagCode !== 1) {
        $q.notify({
          type: 'negative',
          message: saveResult.msgStr,
        });
      }
    }

    async function delRec(params: TransTable) {
      const status = await $api.common.chgGLJournBtnDel(
        params.jnr + '',
        params.recid,
        ''
      );
      if (status.msgStr === '') {
        $q.notify({
          type: 'positive',
          message: 'Data',
        });
      }
    }

    return {
      saveData,
      delRec,
      columns: journalTransColumns,
      shape: colShape,
    };
  },
  components: {
    DialogJournalEdit: () => import('../../components/DialogJournalEdit.vue'),
  },
});
</script>
