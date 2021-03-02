<template>
  <SInput
    v-bind="$attrs"
    :value="value"
    v-on="$listeners"
    class="vp-input-limit"
    :maxlength="limit"
  >
    <template #after>
      <span class="vp-input-hint">{{ limitHint }}</span>
    </template>
    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>
  </SInput>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: true,
  props: {
    limit: { type: Number, required: true },
    value: { type: String, required: true },
  },
  setup(props) {
    const limitHint = computed(() => props.limit - props.value.length);

    return {
      limitHint,
    };
  },
});
</script>
<style lang="scss">
.vp-input-limit {
  .q-field__control {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .q-field__after {
    padding: 0 !important;
  }
  .vp-input-hint {
    position: relative;
    padding: 0 11px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
    font-size: 14px;
    text-align: center;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 100%;
  }
}
</style>
