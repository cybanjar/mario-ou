<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <v-date-picker mode="range" v-model="date" :columns="2" :popover="{ visibility: 'click' }">
        <SInput
          label-text="Date"
          slot-scope="{ inputProps }"
          placeholder="Select Date"
          readonly
          v-bind="inputProps"
          @clear="date = null" />
      </v-date-picker>
      
      <q-btn-toggle
            v-model="sortType"
            spread
            no-caps
            toggle-color="primary"
            color="white"
            text-color="black"
            :options="[
            {label: 'Food', value: 1},
            {label: 'beverage', value: 2}
            ]"/>

      <q-checkbox v-model="sortByDescription" label="Sort By Description" />
      <q-checkbox v-model="incBeverageFood" :label="sortType == 1 ? 'Incl. Beverage to Food' : 'Incl. Food to Beverage' " />

      <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { watch } from 'fs';
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
      date: {start: ref(new Date()), end: ref(new Date()) },
      sortType: ref(1),
      sortByDescription: ref(false),
      incBeverageFood : ref(false)
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    return {
      ...toRefs(state),
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  }
});
</script>

<style lang="scss" scoped></style>
