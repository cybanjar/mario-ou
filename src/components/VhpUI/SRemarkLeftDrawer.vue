<template>
  <div class="q-mb-md">
    <p class="q-mb-sm">
      {{ label }}
    </p>

    <div class="remark q-pa-xs" :class="[right && 'text-right']">
      {{ value }}
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
  },
});
</script>

<style lang="scss" scoped>
.remark {
  overflow-x: scroll;
  color: #2887d2;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
