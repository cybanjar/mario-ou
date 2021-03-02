<template>
  <div>
    <div class="label-layout">
      <label v-if="labelText" class="inline-block q-mb-xs">
        {{ labelText }}
      </label>
      <img
        v-if="icon"
        :src="require(`~/app/icons${icon}`)"
        alt="icon"
        class="q-mb-sm cursor-pointer"
        @click="onClickIcon"
      />
    </div>
    <q-input
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
    </q-input>
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
    icon: { type: String },
    onClickIcon: { type: Function },
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

<style lang="scss" scoped>
.label-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
