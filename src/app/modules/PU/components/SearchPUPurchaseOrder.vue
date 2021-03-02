<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="Status"
        :options="statusOptions"
        v-model="status"
        :loading="isPreparing"
        emit-value
        map-options
      />

      <v-date-picker
        v-model="date"
        :masks="{ input: 'DD/MM/YYYY' }"
        :columns="2"
        :popover="{
          visibility: 'click',
          placement: 'bottom-start',
        }"
        is-range
      >
        <template #default="{ inputValue, inputEvents }">
          <SInput
            label-text="Date"
            placeholder="From - Until"
            readonly
            :value="`${inputValue.start} - ${inputValue.end}`"
            v-on="inputEvents.start"
          >
            <template #append>
              <q-icon name="mdi-calendar" />
            </template>
          </SInput>
        </template>
      </v-date-picker>

      <SSelect
        label-text="User"
        :options="filters.users"
        v-model="user"
        :loading="isPreparing"
        emit-value
        map-options
      />

      <SSelect
        label-text="Department"
        :options="filters.departments"
        v-model="department"
        :loading="isPreparing"
        emit-value
        map-options
      />

      <SSelect
        label-text="Supplier"
        :options="supplierOptions"
        v-model="supplier"
        :loading="isPreparing"
        :option-label="supplierLabel"
        use-input
        @filter="filterSuppliers"
        fill-input
        hide-selected
        input-debounce="0"
        placeholder="Please select"
      />

      <SInput label-text="Purchase Order Number" v-model="poNumber" />

      <q-checkbox
        dense
        v-model="dmlOnly"
        label="Display From Market List Only"
      />

      <q-btn
        block
        color="primary"
        max-height="28"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { store } from '~/store';
import { DatePicker } from 'v-calendar';
import { date } from 'quasar';

interface FilterModel {
  status: number;
  date: { start: Date; end: Date };
  user: string | null;
  department: string | number | null;
  supplier: string | null;
  poNumber: string;
  dmlOnly: boolean;
}

export default defineComponent({
  components: {
    'v-date-picker': DatePicker,
  },

  props: {
    isPreparing: { type: Boolean, default: false },
    filters: { type: Object, required: true },
  },

  setup(props, { emit }) {
    const statusOptions = [
      { value: 0, label: 'Outstanding' },
      { value: 2, label: 'Expired' },
      { value: 1, label: 'Closed' },
      { value: 3, label: 'Deleted' },
    ];

    const today = new Date();

    const searches = reactive<FilterModel>({
      status: 0,
      date: {
        start: date.subtractFromDate(today, { days: 30 }),
        end: today,
      },
      user: '',
      department: '',
      supplier: '',
      poNumber: '',
      dmlOnly: false,
    });

    function onSearch() {
      emit('search', { ...searches });
    }

    const supplierOptions = ref([...props.filters.suppliers]);
    function supplierLabel(supp) {
      if (supp) {
        if (supp.label === 'All') {
          return supp.label;
        }

        return `${supp.value} - ${supp.label}`;
      }

      return '';
    }

    function filterSuppliers(val, update) {
      update(() => {
        const text = val.toLowerCase();
        supplierOptions.value = props.filters.suppliers.filter(
          (v) => v.label.toLowerCase().indexOf(text) > -1
        );
      });
    }

    return {
      statusOptions,

      ...toRefs(searches),
      supplierOptions,
      supplierLabel,
      filterSuppliers,
      onSearch,
      placeholder: store.state.auth.user?.coaFormat || '',
      mask: store.getters.auth.getCoaFormat,
    };
  },
});
</script>
