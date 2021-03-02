<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateRange :range.sync="range" />

      <SSelect
        label-text="From Store"
        :options="searches.fromStore"
        v-model="fromStore"
      />

      <SSelect
        label-text="To Store"
        :options="searches.toStore"
        v-model="toStore"
      />

      <SSelect
        label-text="From Article"
        fill-input
        use-input
        v-for="i in searches.inputSearch.filter((x) =>
          ['Articel Number'].includes(x.name)
        )"
        :key="i"
        :options="i.options"
        v-model="fromArt"
        @filter="filterFn"
      />

      <SSelect
        label-text="To Article"
        fill-input
        use-input
        v-for="i in searches.inputSearch.filter((x) =>
          ['Articel Number'].includes(x.name)
        )"
        :key="i"
        :options="i.options"
        v-model="toArt"
        @filter="filterFn"
      />

      <SSelect label-text="Filter By" v-model="shape" :options="options">
      </SSelect>

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
  onBeforeUpdate,
  computed,
} from '@vue/composition-api';
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
      fromStore: ref(null),
      toStore: ref(null),
      fromArt: ref(null),
      toArt: ref(null),
      shape: ref(null),
      options: [
        { label: 'All Price', value: 1 },
        { label: 'Received Price > Ordered Price ', value: 2 },
        { label: 'Ordered Price > Received Price', value: 3 },
      ],
      modelConfig: { type: 'number' },
    });

    onBeforeUpdate(() => {
      if (state.fromArt === null) {
        state.fromArt = props.searches.selectedArt1;
        state.toArt = props.searches.selectedArt2;
        state.shape = state.options[0];
      }
    });

    const filterFn = (val, update) => {
      emit('filterFn', val, update);
    };

    const filterFn2 = (val, update) => {
      emit('filterFn2', val, update);
    };

    const onSearch = () => {
      emit('onSearch', { ...state });
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
      ...toRefs(state),
      filterFn,
      filterFn2,
      onSearch,
      range,
    };
  },
});
</script>

<style lang="scss" scoped></style>
