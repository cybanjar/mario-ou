<template>
  <DialogJournal
    v-bind="$attrs"
    v-on="restListener"
    :title="title"
    :label="title"
    @setRecord="checkAccNo"
  >
    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>
  </DialogJournal>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { JournalTrans } from '../models/journal.model';

export default defineComponent({
  inheritAttrs: true,
  props: {
    title: { type: String, required: false, default: 'Add' },
    label: { type: String, required: false, default: 'Add' },
  },
  setup(_, { root: { $api, $q }, listeners }) {
    const { setRecord, ...restListener } = listeners;
    async function checkAccNo(params: JournalTrans) {
      const accExist = await $api.common.glJourtransPostJournalAcct({
        currMode: '',
        elimJournal: '',
        fibukonto: params.accNo,
        pvILanguage: '1',
      });

      if (accExist.flagCode === 0) {
        $q.notify({
          type: 'negative',
          message: accExist.msgStr,
        });
      } else {
        setRecord(params);
      }
    }

    return {
      restListener,
      checkAccNo,
    };
  },
  components: {
    DialogJournal: () => import('./DialogJournal.vue'),
  },
});
</script>
