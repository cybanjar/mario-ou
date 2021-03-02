<template>
  <div class="q-mb-md">
    <div class="label-layout">
      <p class="q-mb-sm">
        {{ label }}
      </p>
      <img
        v-if="icon"
        :src="require(`~/app/icons${icon}`)"
        alt="icon"
        class="q-mb-sm cursor-pointer"
        @click="onClickIcon"
      />
    </div>

    <div class="remark q-pa-xs" :class="[right && 'text-right']">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    value: { type: String, default: null },
    right: { type: Boolean, default: false },
    icon: { type: String },
    onClickIcon: { type: Function },
  },
});
</script>

<style lang="scss" scoped>
.label-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

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
