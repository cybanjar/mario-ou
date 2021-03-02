<template>
  <div class="q-mb-md">
    <div v-if="$slots.icon" class="row items-center justify-between q-mb-sm">
      <p class="q-mb-none">{{ label }}</p>
      <slot name="icon"></slot>
    </div>
    <p v-else class="q-mb-sm">{{ label }}</p>

    <div
      class="remark q-pa-xs"
      :class="[right && 'text-right']"
      :style="remarkStyle"
    >
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, default: null },
    right: { type: Boolean, default: false },
    remarkStyle: { type: [String, Object, Array], default: '' },
  },
});
</script>

<style lang="scss" scoped>
.remark {
  color: #2887d2;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
