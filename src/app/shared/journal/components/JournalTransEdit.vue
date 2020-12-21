<template>
  <DialogJournalEdit v-bind="$attrs" v-on="$listeners" @setRecord="saveData" />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { JournalTrans } from '../../models/journal.model';
import { reformSaveAddParam } from '../utils/reformParam';
export default defineComponent({
  inheritAttrs: true,
  setup(_, { root: { $api, $q } }) {
    async function saveData(params: JournalTrans, exists: boolean) {
      const mode = exists ? 'chg' : 'add';
      const paramSave = reformSaveAddParam(mode, params);
      const saveResult = await $api.common.saveLedgerTrans(paramSave);

      if (saveResult.flagCode !== 1) {
        $q.notify({
          type: 'negative',
          message: saveResult.msgStr,
        });
      }
    }

    return {
      saveData,
    };
  },
  components: {
    DialogJournalEdit: () => import('../../components/DialogJournalEdit.vue'),
  },
});
</script>
