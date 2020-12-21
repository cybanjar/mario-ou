<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="Display"
        :options="displayStatuses"
        v-model="filterStatus"
        :clearable="false"
      />
    </div>

    <q-separator />

    <div class="q-pa-md">
      <SInput v-model="filterSearch" label-text="Search" />

      <v-date-picker
        mode="range"
        v-model="filterDate"
        :columns="2"
        :popover="{ visibility: 'click' }"
      >
        <SInput
          label-text="Date"
          slot-scope="{ inputProps }"
          placeholder="From - Until"
          readonly
          v-bind="inputProps"
          clearable
          @clear="filterDate = null"
        >
          <template v-slot:append>
            <q-icon name="mdi-event" />
          </template>
        </SInput>
      </v-date-picker>

      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { displayStatuses } from '../models/outOfOrder.model';

setupCalendar({
  firstDayOfWeek: 2,
});

interface WatchTypes {
  value: any;
}

export default defineComponent({
  setup(props, { emit }) {
    const filterSearch = ref('');
    const filterStatus = ref<any>({ value: 0, label: 'All' });
    const filterDate = ref({
      start: '',
      end: '',
    });

    watch<WatchTypes[]>(
      [filterStatus, filterSearch],
      ([roomStatus, roomSearch]) => {
        emit('onChangeFilter', {
          status: roomStatus?.value,
          search: roomSearch,
        });
      }
    );

    watch(filterDate, (newDate) => {
      emit('onChangedDate', newDate);
    });

    return {
      filterDate,
      filterSearch,
      filterStatus,
      displayStatuses,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>
