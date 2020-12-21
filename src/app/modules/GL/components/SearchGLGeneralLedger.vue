<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateRange :range.sync="dateRange" />

      <SSelect
        fill-input
        use-input
        clearable
        hide-selected
        label-text="From"
        :options="fromOptions"
        v-model="fromFibu"
        input-debounce="0"
        @filter="filterFrom"
        :loading="filters.isPreparing"
      />

      <SSelect
        fill-input
        use-input
        clearable
        hide-selected
        label-text="To"
        :options="fromOptions"
        v-model="toFibu"
        input-debounce="0"
        @filter="filterTo"
        :loading="filters.isPreparing"
      />
    </div>

    <q-separator />

    <div class="q-pa-md">
      <SSelect
        label-text="Display"
        :options="displayStatusItems"
        v-model="displayStatus"
        map-options
        emit-value
      />

      <q-btn-toggle
        v-model="mode"
        spread
        no-caps
        dense
        toggle-color="primary"
        :options="modeOptions"
        class="q-mb-md"
      />

      <q-checkbox v-model="exclOther" label="Exclude Other Dept" />
      <q-checkbox v-model="summDate" label="Summary Per Date" />

      <SSelect
        label-text="Display"
        :options="filters.mainAccounts"
        v-model="displayStatus"
        map-options
        emit-value
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
      <SRemarkLeftDrawer
        right
        label="Debit"
        :value="formatThousands(filters.credit)"
      />
      <SRemarkLeftDrawer
        right
        label="Credit"
        :value="formatThousands(filters.debit)"
      />
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  Ref,
  toRef,
  ref,
  watch,
} from '@vue/composition-api';
import { SelectItem } from '~/app/shared/models/select.model';
import { date } from 'quasar';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import {
  CoaState,
  FilterRef,
  Props,
} from '../models/components/searchGLGeneralLedger.models';

const coaState = reactive<CoaState>({
  fromOptions: [],
  toOptions: [],
});

const tableFilters = reactive<FilterRef>({
  fromDate: '14/01/19',
  toDate: date.formatDate(new Date(), 'DD/MM/YYYY'),
  fromFibu: null,
  toFibu: null,
});

const displayStatus = ref<number>(-1);
const displayStatusItems: SelectItem[] = [
  { label: 'All', value: -1 },
  { label: 'Main Account', value: 1 },
  { label: 'Department', value: 3 },
  { label: 'Reference Number', value: 4 },
];

const modeOptions: SelectItem[] = [
  { label: 'Description', value: 'description' },
  { label: 'Remark', value: 'remark' },
];

function useDateRange() {
  const dateRange = computed<any>({
    get() {
      const { fromDate, toDate } = tableFilters;
      return {
        startDate: fromDate,
        endDate: toDate,
        dateInput: `${fromDate} - ${toDate}`,
      };
    },
    set(val) {
      tableFilters.fromDate = val.startDate;
      tableFilters.toDate = val.endDate;
    },
  });

  return { dateRange };
}

function useMode(modeProp, emit) {
  const mode = computed<string>({
    get() {
      return modeProp.value;
    },
    set(val) {
      emit('onMode', val);
    },
  });

  return { mode };
}

function useCheckboxes() {
  const exclOther = ref(false);
  const summDate = ref(false);

  return {
    exclOther,
    summDate,
  };
}

function useCoaOptions(coaOptions: Ref<SelectItem[]>) {
  coaState.fromOptions = coaOptions.value;
  coaState.toOptions = coaOptions.value;

  const filterCoa = (val, update, coaKey: 'fromOptions' | 'toOptions') => {
    update(() => {
      coaState[coaKey] = coaOptions.value.filter(
        (v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
      );
    });
  };

  return {
    ...toRefs(coaState),
    filterFrom(val, update) {
      filterCoa(val, update, 'fromOptions');
    },
    filterTo(val, update) {
      filterCoa(val, update, 'toOptions');
    },
  };
}

watch(displayStatus, (val) => {
  console.log('hihi -> val', val);
});

export default defineComponent<Props>({
  props: {
    filters: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const coaOptions = toRef(props.filters, 'coaOptions');
    const modeProp = toRef(props.filters, 'mode');

    return {
      ...useCoaOptions(coaOptions),
      ...useDateRange(),
      ...useMode(modeProp, emit),
      ...toRefs(tableFilters),
      ...useCheckboxes(),
      formatThousands,
      displayStatusItems,
      displayStatus,
      modeOptions,
    };
  },
});
</script>
