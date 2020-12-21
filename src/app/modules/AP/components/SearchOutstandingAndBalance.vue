<template>
  <section>
    <!-- Unset the position so v-date-picker can show up -->
    <q-form @submit="onSearch" style="position: unset;">
      <div class="q-pa-md">
        <SelectFilter
          label-text="Supplier Name"
          :options="supplierOptions"
          option-value="firma"
          option-label="firma"
          v-model="formData.supplierName"
        />

        <v-date-picker
          mode="range"
          v-model="formData.date"
          :columns="2"
          :popover="{ visibility: 'click' }"
          :masks="{ input: 'DD/MM/YYYY' }"
        >
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="From - Until"
            readonly
            v-bind="inputProps"
          >
            <template v-slot:append>
              <q-icon name="mdi-calendar" />
            </template>
          </SInput>
        </v-date-picker>

        <q-option-group
          :options="sortTypeOptions"
          type="radio"
          dense
          class="q-mb-md"
          v-model="formData.sortType"
        />

        <SSelect
          label-text="Type"
          emit-value
          map-options
          :options="typeOptions"
          v-model="formData.type"
          :clearable="false"
        />

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </div>
    </q-form>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import { date } from 'quasar';
import { SearchOutstandingAndBalance } from '../models/outstanding-and-balance.model';
import { ResSupplierList } from '../models/supplier-profile.model';

export default defineComponent({
  setup(_, { emit, root: { $api } }) {
    const today = new Date();
    const formData = reactive<SearchOutstandingAndBalance>({
      supplierName: null,
      date: {
        start: date.subtractFromDate(today, { month: 1 }),
        end: today,
      },
      sortType: 1,
      type: 2,
    });

    // Start setup form options
    const supplierOptions = ref<ResSupplierList[]>([]);
    (async () => {
      const supplierList = await $api.accountsPayable.getSupplierList();
      supplierOptions.value = supplierList.sort((a, b) =>
        a.firma.localeCompare(b.firma)
      );
    })();

    const sortTypeOptions = [
      { value: 1, label: 'All' },
      { value: 0, label: 'Open' },
      { value: 2, label: 'Balance' },
    ];

    const typeOptions = [
      { value: 2, label: 'All' },
      { value: 0, label: 'Receiving AP' },
      { value: 1, label: 'Manual AP' },
    ];
    // End setup form options

    function onSearch() {
      // TODO: Need to use toRaw to pass formData. But still not supported
      emit('onSearch', { ...formData });
    }

    return {
      formData,
      supplierOptions,
      sortTypeOptions,
      typeOptions,
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
    SelectFilter: () => import('./SelectFilter.vue'),
  },
});
</script>
