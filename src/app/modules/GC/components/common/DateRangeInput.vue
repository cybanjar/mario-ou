<template>
  <v-date-picker
    v-model="dateValue"
    :masks="{ input: 'DD/MM/YY' }"
    :columns="2"
    :popover="{
      visibility: 'click',
      placement: 'bottom-start',
      positionFixed,
    }"
    is-range
  >
    <template #default="{ inputValue, inputEvents }">
      <SInput
        readonly
        :label-text="labelText"
        :placeholder="placeholder"
        :value="`${inputValue.start} - ${inputValue.end}`"
        v-on="!disable && inputEvents.start"
        :disable="disable"
      >
        <template #append>
          <q-icon name="mdi-calendar" />
        </template>
      </SInput>
    </template>
  </v-date-picker>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';

export interface DateRangeValue {
  start: Date;
  end: Date;
}

export default defineComponent({
  components: {
    'v-date-picker': DatePicker,
  },
  props: {
    value: { type: Object as PropType<DateRangeValue>, default: null },
    labelText: { type: String, required: true },
    placeholder: { type: String, default: 'From - Until' },
    disable: { type: Boolean, default: false },
    positionFixed: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    return {
      dateValue: useModelWrapper(props, emit, 'value', false),
    };
  },
});
</script>
