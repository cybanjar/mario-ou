<template>
  <div>
    <label v-if="labelText" class="inline-block q-mb-xs">
      {{ labelText }}
    </label>
    <q-select
      dense
      outlined
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      :class="inputClasses"
      class="s-input"
    >
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="scope"
      >
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: { required: false },
    labelText: { type: String, default: null },
    inputClasses: { type: String, default: 'q-mb-md' },
  },
});
</script>
