<template>
  <section>
    <!-- Unset the position so v-date-picker can show up -->
    <q-form @submit="onSearch" style="position: unset">
      <div class="q-pa-md">
        <SSelect
          label-text="Status"
          emit-value
          map-options
          :options="statusOptions"
          v-model="formData.status"
          :clearable="false"
          input-classes="q-mb-none"
        />
      </div>

      <q-separator />
      <div class="q-pa-md">
        <v-date-picker
          v-model="formData.date"
          :masks="{ input: 'DD/MM/YY' }"
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

        <select-filter
          label-text="User"
          :mapping="false"
          :options="userOptions"
          v-model="formData.user"
        />

        <SInput
          label-text="Document Number"
          v-model="formData.documentNumber"
        />

        <select-filter
          label-text="Department"
          :options="departmentOptions"
          option-value="nr"
          option-label="bezeich"
          v-model="formData.department"
        />

        <select-filter
          label-text="Supplier"
          :options="supplierOptions"
          option-value="lief-nr"
          option-label="firma"
          :disable="formData.displayAllSupplier"
          v-model="formData.supplier"
        />

        <q-checkbox
          dense
          v-model="formData.displayAllSupplier"
          label="Display All Supplier"
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
import {
  SearchPurchaseOrder,
  ResDepartment,
} from '../models/purchase-order.model';
import { ResSupplierList } from '../models/supplier-profile.model';

export default defineComponent({
  setup(_, { emit, root: { $api } }) {
    const today = new Date();
    const formData = reactive<SearchPurchaseOrder>({
      status: 0,
      date: {
        start: date.subtractFromDate(today, { month: 1 }),
        end: today,
      },
      user: null,
      documentNumber: '',
      department: null,
      supplier: null,
      displayAllSupplier: true,

      // Bill date doesn't directly use in form UI, it used for hidden input
      // It's because bill date data got data from API request on getPreparePurchaseOrderList (see line 141 on this file)
      billDate: null,
    });

    // Start setup form options
    const statusOptions = [
      { value: 0, label: 'Outstanding' },
      { value: 2, label: 'Expired' },
      { value: 1, label: 'Closed' },
      { value: 3, label: 'Deleted' },
    ];

    const userOptions = ref<string[]>([]);
    const departmentOptions = ref<ResDepartment[]>([]);
    const supplierOptions = ref<ResSupplierList[]>([]);
    (async () => {
      const response = await $api.accountsPayable.getPreparePurchaseOrderList();
      const users = response.users;
      userOptions.value = users.map((user) => user.username);

      const departments = response.department;
      departmentOptions.value = departments;

      formData.billDate = new Date(response.billDate);

      const supplierList = await $api.accountsPayable.getSupplierList();
      supplierOptions.value = supplierList.sort((a, b) =>
        a.firma.localeCompare(b.firma)
      );
    })();
    // End setup form options

    function onSearch() {
      emit('onSearch', { ...formData });
    }

    return {
      statusOptions,
      userOptions,
      departmentOptions,
      supplierOptions,
      formData,
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
    SelectFilter: () => import('./SelectFilter.vue'),
  },
});
</script>
