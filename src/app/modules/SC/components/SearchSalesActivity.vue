<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <!-- <span>Status</span>
      <br />
      <q-btn-toggle
        v-model="model"
        toggle-color="primary"
        :options="[
          { label: 'Active', value: 'one' },
          { label: 'Close', value: 'two' },
        ]"
      />
      <br />
      <br /> -->

      <SDateRange :range.sync="range" />

      <SSelect
        label-text="Sales Name"
        :options="searches.departments"
        v-model="fromdepartment"
      />

      <SSelect
        label-text="Task Type"
        :options="searches.departments"
        v-model="todepartment"
      />
      <SInput label-text="Customer Name" v-model="Company" />
      <SSelect
        label-text="Priority"
        :options="searches.departments"
        v-model="todepartment"
      />
      <span>All User's Activity</span>
      <div class="q-gutter-sm">
        <q-checkbox v-model="right" />
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
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

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
      fromdepartment: ref(null),
      todepartment: ref(null),
      model: 'one',
      right: false,
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
