<template>
  <section class="mt-7">
    <div class="q-pa-md">
        <v-date-picker mode="range" v-model="searches.date" :columns="2" :popover="{ visibility: 'click' }">
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="Select Date"
            readonly
            v-bind="inputProps"
            @clear="searches.date = null" />
        </v-date-picker>

        <q-radio v-model="searches.optionSortType" val='2' label="Cost Allocation" />
        <q-radio v-model="searches.optionSortType" val='3' label="Guest Name" />
        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch} from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    return {
      ...toRefs,
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  }
});
</script>

<style lang="scss" scoped></style>
