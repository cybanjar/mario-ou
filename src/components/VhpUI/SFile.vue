<template>
  <div>
    <label v-if="labelText" class="inline-block q-mb-xs">
      {{ labelText }}
    </label>
    <q-file
      dense
      outlined
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      @change="onChange"
      :class="inputClasses"
      class="s-input"
      ref="sInput"
    >
      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="scope"
      >
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-file>
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
  setup(_, { emit }) {
    const onChange = (event) => {
      emit('input', event.target.value);
    };

    return {
      onChange,
    };
  },
});
</script>
