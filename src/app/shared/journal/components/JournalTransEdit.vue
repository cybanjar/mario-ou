<template>
  <DialogJournalEdit
    v-bind="$attrs"
    v-on="$listeners"
    :jnr="jnr"
    @onOKClick="saveData"
    @delRecord="delData"
  />
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Journal, JournalTrans } from '../../models/journal.model';
import { reformSaveAddParam } from '../utils/reformParam';
export default defineComponent({
  inheritAttrs: true,
  props: {
    jnr: { type: Number, required: true },
  },
  setup(props, { root: { $api, $q } }) {
    async function saveData(journal: Journal, tranList: JournalTrans[]) {
      const requests = [];
      tranList.forEach((trans) => {
        const mode = trans.recid ? 'chg' : 'add';
        const paramSave = reformSaveAddParam(journal, trans, mode);
        requests.push($api.common.saveLedgerTrans(paramSave));
      });

      Promise.all(requests).then((res) => {
        const isOk = res.reduce((p, v) => p && !v.msgStr, true);
        if (isOk) {
          $q.notify({
            type: 'positive',
            message: 'Succesfully to edit journal',
          });
        } else {
          $q.notify({
            type: 'negative',
            message: 'Failed to edit journal',
          });
        }
      });
    }

    async function delData(params: JournalTrans) {
      try {
        await $api.common.chgGLJournalBtnDel({
          jnr: props.jnr,
          recId: params.recid,
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.toString(),
        });
      }
    }

    return {
      saveData,
      delData,
    };
  },
  components: {
    DialogJournalEdit: () => import('../../components/DialogJournalEdit.vue'),
  },
});
</script>
