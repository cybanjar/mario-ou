<template>
  <q-dialog v-bind="$attrs" v-on="$listeners">
    <div :class="`dialog ${$attrs.class}`">
      <div class="dialog__header">
        <span class="dialog__title">
          <slot name="title">
            Dialog Title
          </slot>
        </span>
      </div>
      <div class="bg-white q-pa-lg">
        <slot name="body">
          Empty Content
        </slot>
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
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 1000px !important;

  .input-field {
    padding-left: 24px;
    padding-right: 32px;
  }
}
</style>
