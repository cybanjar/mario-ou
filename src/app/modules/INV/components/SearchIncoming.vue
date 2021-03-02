<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateRange :range.sync="range" />

      <SSelect
        label-text="From Main Group"
        :options="searches.departments"
        v-model="fromMain"
      />

      <SSelect
        label-text="To Main Group"
        :options="searches.departments"
        v-model="toMain"
      />

      <SSelect
        label-text="Store Number"
        :options="searches.store"
        v-model="store"
      />

      <SInput
        label-text="Supplier"
        v-model="supplier"
        placeholder="Supplier"
        :disabled="all"
      >
        <template #append>
          <q-btn
            round
            dense
            flat
            icon="mdi-magnify"
            @click="showDialog()"
            :disabled="all"
          />
        </template>
      </SInput>

      <q-checkbox v-model="all" label="Display All Supplier" />

      <div id="radio">
        <q-radio size="xs" v-model="shape" val="1" label="By Supplier" />
        <q-radio size="xs" v-model="shape" val="2" label="By Document" />
        <q-radio size="xs" v-model="shape" val="3" label="By Sub Group" />
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
    <DialogSupplier
      :show="show"
      @onDialog="onDialog"
      @getSupplier="getSupplier"
    />
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
      store: ref(null),
      fromMain: ref(null),
      toMain: ref(null),
      shape: ref('1'),
      all: ref(false),
      supplier: ref(null),
      supplierVal: ref(null),
      show: false,
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    const onDialog = (val) => {
      state.show = val;
    };

    const getSupplier = (dataSelected) => {
      state.supplierVal = dataSelected['t-recid'];
      state.supplier = dataSelected['t-recid'] + ' - ' + dataSelected.firma;
    };
    const showDialog = () => {
      onDialog(true);
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
      onDialog,
      showDialog,
      getSupplier,
      range,
    };
  },
  components: {
    DialogSupplier: () => import('./DialogSupplier.vue'),
  },
});
</script>

<style lang="scss" scoped></style>
