<template>
  <SSelect
    v-bind="$attrs"
    v-on="$listeners"
    :emit-value="mapping"
    :map-options="mapping"
    :options-sanitize="true"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :loading="loading"
    :label-text="labelText"
    :options="state.options"
    :option-value="optionValue"
    :option-label="optionLabel"
    @filter="filter"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </SSelect>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: false,
  props: {
    labelText: { type: String, default: null },
    options: { required: true, type: Array },
    optionValue: { type: String, default: null },
    optionLabel: { type: String, default: null },
    mapping: { type: Boolean, default: true },
  },
  setup(props) {
    const optionData = computed(() => props.options); // Store all of options data here to process later with state
    const loading = computed(() => props.options.length < 1);

    const state = reactive({
      options: optionData.value,
    });

    function filter(val: string, update: any) {
      if (props.mapping && (!props.optionLabel || !props.optionValue)) {
        throw new Error('Please provide option-label and option-value props');
      }

      update(() => {
        const keyword = val.toLowerCase();
        state.options = optionData.value.filter((v: any) => {
          let label = v;
          if (props.mapping && props.optionLabel) label = v[props.optionLabel];

          return label.toLowerCase().includes(keyword);
        });
      });
    }

    return {
      loading,
      state,
      filter,
    };
  },
});
</script>
