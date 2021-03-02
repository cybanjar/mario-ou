<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SDateRange :range.sync="range" />
      <SSelect
        label-text="From Department"
        :options="searches.departments"
        v-model="fromDept"
      />
      <SSelect
        label-text="To Department"
        :options="searches.departments"
        v-model="toDept"
      />
      <SInput label-text="Delivery Number" v-model="ReqNumber" />
      <q-btn
        size="sm"
        color="primary"
        max-height="10"
        style="height: 25px"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        @click="onSearch"
        unelevated
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
        startDate:  date.formatDate(new Date(2019, 0, 14),'DD/MM/YY'),
        endDate: date.formatDate(new Date(2019, 0, 14),'DD/MM/YY')
      },
      fromDept: ref(null),
      toDept: ref(null),
      ReqNumber: ref(''),
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

<style lang="scss" scoped>
#input {
  width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#radio {
  margin-left: -9px;
}
</style>
