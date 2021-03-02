<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateRange :range.sync="range" />

      <SSelect
        label-text="From Storage"
        :options="searches.store"
        v-model="fromstore"
      />
      <SSelect
        label-text="To Storage"
        :options="searches.store"
        v-model="tostore"
      />
      <SSelect
        label-text="From Article Number"
        :options="searches.allArt"
        v-model="fromarticle"
      />
      <SSelect
        label-text="To Article Number"
        :options="searches.allArt"
        v-model="toarticle"
      />
      <SSelect
        label-text="Main Group"
        :options="searches.departments"
        v-model="departments"
      />
      <div v-if="searches.availUnter === true">
        <SSelect
          label-text="Display"
          :options="searches.option"
          v-model="display"
        />
      </div>
      <div v-else></div>
      <SSelect
        label-text="Cost Allocation"
        :options="searches.allocation"
        v-model="alloc"
      />

      <q-option-group
        v-model="by"
        :options="searches.pilihan"
        color="primary"
        left-label
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
import { date } from 'quasar';

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
      departments: ref(null),
      alloc: ref(null),
      fromarticle: ref(null),
      toarticle: ref(null),
      fromstore: ref(null),
      tostore: ref(null),
      display: ref(null),
      by: 'document',
    });

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
      onSearch,
      range,
    };
  },
});
</script>

<style lang="scss" scoped></style>
