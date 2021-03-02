<template>
  <v-date-picker
    v-model="dateValue"
    :is-required="isRequired"
    :masks="{ input: 'DD/MM/YY' }"
    :max-date="maxDate"
    :popover="{
      visibility: 'click',
      placement,
      positionFixed,
    }"
  >
    <template #default="{ inputValue, inputEvents }">
      <SInput
        v-bind="$attrs"
        readonly
        :value="inputValue"
        v-on="!disable && inputEvents"
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
import { defineComponent } from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';

export default defineComponent({
  inheritAttrs: false,
  components: {
    'v-date-picker': DatePicker,
  },
  props: {
    value: { type: Date, default: null },
    disable: { type: Boolean, default: false },
    positionFixed: { type: Boolean, default: false },
    placement: { type: String, default: 'bottom-start' },
    maxDate: { type: Date, default: null },
    isRequired: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    return {
      dateValue: useModelWrapper(props, emit, 'value', false),
    };
  },
});
</script>
