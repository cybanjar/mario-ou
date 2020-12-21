<template>
  <DialogJournalAdd
    :transactions="transactions"
    v-bind="$attrs"
    v-on="$listeners"
    @setRecord="saveRecord"
  >
  </DialogJournalAdd>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { JournalTrans, TransTable } from '../../models/journal.model';
import { reformSaveParam } from '../utils/reformParam';
export default defineComponent({
  inheritAttrs: true,
  setup(_, { root: { $api, $q } }) {
    const transactions = ref<TransTable[]>([]);
    async function uniqRefNo(params: JournalTrans) {
      const dupRefNo = await $api.common.glJourtransPostJournal({
        refno: params.referenceNo,
      });

      if (dupRefNo.flCode === 1) {
        $q.notify({
          type: 'negative',
          message: `Same reference number exists, date = ${dupRefNo.datum}`,
        });
        return false;
      }
      return true;
    }

    async function saveRecord(journal: JournalTrans) {
      const validUniq = await uniqRefNo(journal);
      if (validUniq) {
        const paramSave = reformSaveParam(journal);
        // make server save data
        const saveResult = await $api.common.glJourtransPostJournalBtnGo(
          paramSave
        );

        if (saveResult.errorFlag !== 'false') {
          $q.notify({
            type: 'negative',
            message: saveResult.msgStr,
          });

          return;
        }
        $q.notify({
          type: 'positive',
          message: 'Data has bee added',
        });
        transactions.value.push(journal);
        return;
      }
    }
    return {
      saveRecord,
      uniqRefNo,
      transactions,
    };
  },
  components: {
    DialogJournalAdd: () => import('../../components/DialogJournalAdd.vue'),
  },
});
</script>
