<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateRange :range.sync="range" />

      <SSelect
        label-text="Main Group"
        :options="searches.departments"
        v-model="searches.fromDeptVal"
        @input="onChange($options, true)"
      />

      <q-checkbox
        v-model="searches.summary"
        label="Summary Expenses by Main Acct"
      />

      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import { date } from 'quasar';

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(props, { emit }) {
    const state = reactive({
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
    });

    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    const onChange = (input) => {
      const searchesValue = input.propsData.searches;
      const main = searchesValue.fromDeptVal.value;
      const summary = searchesValue.summary;
    };

    const range = computed({
      get: () => {
        const { startDate, endDate } = state.date;
        return {
          startDate,
          endDate,
          dateInput: `${startDate} - ${endDate}`,
        };
      },
      set: ({ startDate, endDate }) => {
        state.date.startDate = startDate;
        state.date.endDate = endDate;
      },
    });
    return {
      ...toRefs,
      onSearch,
      onChange,
      range,
    };
  },
});
</script>

<style lang="scss" scoped></style>
