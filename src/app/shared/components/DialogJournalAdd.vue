<template>
  <DialogJournal
    v-bind="$attrs"
    v-on="restListener"
    :title="title"
    :label="label"
    @setRecord="checkAccNo"
    @delRecord="chgTouchEdit(false)"
    @editRecord="chgTouchEdit(true)"
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
import { computed, defineComponent, ref } from '@vue/composition-api';
import { date } from 'quasar';
import { JournalTrans } from '../models/journal.model';

export default defineComponent({
  inheritAttrs: true,
  props: {
    title: { type: String, required: false, default: 'Add' },
    labelAdd: { type: String, required: false, default: 'Add' },
    labelEdit: { type: String, required: false, default: 'Edit' },
    resetFields: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
  },
  setup(props, { root: { $api, $q }, listeners }) {
    const { setRecord, ...restListener } = listeners;
    const touchEdit = ref(false);
    const label = computed(() =>
      !touchEdit.value ? props.labelAdd : props.labelEdit
    );
    async function checkAccNo(params: JournalTrans, exists, reset) {
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
        chgTouchEdit(false);
        setRecord(params, exists, reset);
      }
    }

    function chgTouchEdit(inEdit: boolean) {
      touchEdit.value = inEdit;
    }

    return {
      restListener,
      checkAccNo,
      label,
      chgTouchEdit,
    };
  },
  components: {
    DialogJournal: () => import('./DialogJournal.vue'),
  },
});
</script>
