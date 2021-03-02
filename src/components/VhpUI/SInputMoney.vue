<template>
  <SInput
    type="number"
    :value="value"
    :label-text="labelText"
    :input-classes="inputClasses"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: true,
  props: {
    value: { required: true },
    labelText: { type: String, default: null },
    inputClasses: { type: String, default: 'q-mb-md' },
    allowMinus: { type: Boolean, default: true, required: false },
  },
});
</script>
