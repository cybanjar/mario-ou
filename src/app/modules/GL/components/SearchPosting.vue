<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <label class="block q-mb-sm">Display</label>
      <q-btn-toggle
        v-model="display"
        spread
        no-caps
        dense
        toggle-color="primary"
        :options="[
          { label: 'Active', value: 'active' },
          { label: 'Closed', value: 'closed' },
        ]"
      />
    </div>

    <q-separator class="q-my-sm" />

    <div class="q-pa-md">
      <v-date-picker
        mode="range"
        v-model="date"
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
          @clear="date = null"
        >
          <template v-slot:append>
            <q-icon name="mdi-event" />
          </template>
        </SInput>
      </v-date-picker>

      <SInput label-text="Reference Number" />

      <SSelect
        label-text="Show"
        :options="[
          'All',
          'F/O',
          'A/R',
          'INV',
          'A/P',
          'RCV',
          'GCASH',
          'F-ASSET',
          'PCHASE',
        ]"
        v-model="show"
      />

      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
      />
    </div>

    <q-separator class="q-my-sm" />

    <div class="q-px-md">
      <SRemarkLeftDrawer right label="Debit" :value="formatThousands(credit)" />
      <SRemarkLeftDrawer right label="Credit" :value="formatThousands(debit)" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup() {
    const state = reactive({
      credit: 0,
      debit: 0,
      display: 'active',
      date: {
        start: date.startOfDate(new Date(), 'month'),
        end: new Date(),
      },
      referenceNumber: null,
      show: 'All',
    });

    return {
      ...toRefs(state),
      formatThousands,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>

<style lang="scss" scoped></style>
