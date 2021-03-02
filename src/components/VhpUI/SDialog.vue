<template>
  <q-dialog v-bind="$attrs" v-on="$listeners">
    <div :class="`dialog ${$attrs['content-class']}`">
      <div class="dialog__header">
        <span class="dialog__title">
          <slot name="title"> Dialog Title </slot>
        </span>
      </div>
      <div class="bg-white q-pa-lg">
        <slot name="body"> Empty Content </slot>
      </div>
      <div
        v-if="$scopedSlots['action-cancel'] || $scopedSlots['action-ok']"
        class="dialog__footer row justify-end"
      >
        <div v-if="$scopedSlots['action-cancel']">
          <slot name="action-cancel"></slot>
        </div>
        <div v-if="$scopedSlots['action-ok']">
          <slot name="action-ok"></slot>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: true,
  props: {
    dialogStyle: { type: String, requreid: false },
  },
});
</script>
