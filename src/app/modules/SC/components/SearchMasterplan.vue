<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="Search By"
        :options="searches.departments"
        v-model="searchby"
      />

      <div v-if="searchby.value == 'date'">
        <SDateRange :range.sync="range" />
      </div>
      <div v-else-if="searchby.value == 'number'">
        <SInputMoney
          label-text="Prepare"
          v-model.number="duit"
          hide-bottom-space
        ></SInputMoney>
      </div>
      <div v-else>
        <SInput label-text=" " v-model="input" />
      </div>

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
      searchby: '',
      duit: 0,
      input: ref(null),
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
