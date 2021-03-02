<template>
  <section class="mt-7">
    <template>
      <div class="q-pa-md">
        <q-form @submit="onSearch">
          <SDateRange :range.sync="range" />
          <SSelect label-text="From Departement"/>
          <SSelect label-text="To Departement"/>
          <q-checkbox style="marginLeft: -8px" size="sm" v-model="shape" label="Display Total of Each VAT" />
          <q-btn
            class="q-mt-md full-width"
            color="primary"
            style="height: 25px;"
            icon="mdi-magnify"
            size="sm"
            label="Search"
          />
        </q-form>
      </div>

      <q-separator class="q-my-md" />

    </template>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
} from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  setup(_, { emit, root: { $api } }) {
    const searches = reactive({
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
      shape: false,
      reference: '',
    });


    const range = computed({
      get: () => {
        const { startDate, endDate } = searches.date;

        return {
          startDate,
          endDate,
          dateInput: `${startDate} - ${endDate}`,
        };
      },
      set: ({ startDate, endDate }) => {
        searches.date.startDate = startDate;
        searches.date.endDate = endDate;
      },
    });

    const onSearch = () => {
      emit('onSearch', { date: searches.date, reference: searches.reference });
    };

    return {
      ...toRefs(searches),
      onSearch,
      range,
    };
  },
});
</script>
