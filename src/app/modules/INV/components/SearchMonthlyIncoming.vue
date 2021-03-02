<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateRange :range.sync="range" />
      <SSelect
        label-text="From Store"
        :options="searches.store"
        v-model="fromStore"
        dense
      />
      <SSelect 
        label-text="To Store" 
        :options="searches.store" 
        v-model="toStore" 
        dense 
      />

      <SSelect
        label-text="From Article"
        :options="searches.articles"
        v-model="fromArt"
        dense
      />
      <SSelect 
        label-text="To Article" 
        :options="searches.articles" 
        v-model="toArt" 
        dense 
      />

      <div id="radio">
        <q-radio size="xs" v-model="sortBy" val="1" label="Article Number" />
        <q-radio size="xs" v-model="sortBy" val="2" :label="getLabel('by_description', 'titleCase')" />
        <q-radio size="xs" v-model="sortBy" val="3" label="by sub group" />
      </div>
      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        :label="getLabel('search', 'titleCase')"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from '@vue/composition-api';
import { getLabels } from '~/app/helpers/getLabels.helpers';
import { date } from 'quasar';

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      fromStore: null,
      toStore: null,
      fromArt: null,
      toArt: null,
      sortBy: '1',
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
  });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    const getLabel = (key: string, opts: string) => {
      return getLabels(key, opts)
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
      onSearch,
      getLabel,
      range,
    };
  },
});
</script>

<style lang="scss" scoped></style>
