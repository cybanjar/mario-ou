<template>
  <div>
    <div class="q-pa-md">
      <q-form @submit="onSearch">
        <SelectFilter
          label-text="Supplier Name"
          :options="supplierOptions"
          option-value="lief-nr"
          option-label="firma"
          v-model="formData.supplier"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select supplier']"
        />

        <SInput
          label-text="Date"
          v-model="formData.date"
          hide-bottom-space
          readonly
          :rules="['date']"
        >
          <template #append>
            <q-icon name="mdi-calendar" />
          </template>

          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="formData.date"
              mask="DD/MM/YYYY"
              today-btn
              @input="() => $refs.qDateProxy.hide()"
            />
          </q-popup-proxy>
        </SInput>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </q-form>
    </div>

    <q-separator style="border-width: 1px;" class="q-mt-md" />

    <div class="q-pa-md">
      <SInput
        label-text="Supplier Address"
        type="textarea"
        rows="5"
        disable
        :value="selectedAddress"
      />
      <SInput
        label-text="Remark"
        type="textarea"
        rows="5"
        disable
        :value="selectedRemark"
      />
      <SRemarkLeftDrawer label="Balance" :value="totalBalance" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watchEffect,
  computed,
} from '@vue/composition-api';
import { date } from 'quasar';
import { ResSupplierList } from '../models/supplier-profile.model';
import { ResPaymentList } from '../models/payment.model';
import { formatterMoney } from '../../../helpers/formatterMoney.helper';

export default defineComponent({
  props: {
    selectedRemark: { type: String },
    selectedRow: { type: Array, default: [] },
  },
  setup(props, { emit, root: { $api } }) {
    const formData = reactive({
      supplier: null,
      date: date.formatDate(new Date('01/14/2019'), 'DD/MM/YYYY'),
    });

    // Start setup form options
    const supplierOptions = ref<ResSupplierList[]>([]);
    (async () => {
      const supplierList = await $api.accountsPayable.getSupplierList();
      supplierOptions.value = supplierList.sort((a, b) =>
        a.firma.localeCompare(b.firma)
      );
    })();
    // End setup form options

    const selectedAddress = ref('');
    watchEffect(() => {
      const selectedSupplier = supplierOptions.value.find(
        (supplier) => supplier['lief-nr'] === formData.supplier
      );
      selectedAddress.value = selectedSupplier
        ? `${selectedSupplier.wohnort} ${selectedSupplier.adresse1} ${selectedSupplier.adresse2} ${selectedSupplier.adresse3}`
        : '';
    });

    function onSearch() {
      const selectedSupplier = supplierOptions.value.find(
        (supplier) => supplier['lief-nr'] === formData.supplier
      );
      const supplierName = selectedSupplier?.firma ?? '';

      const parseDate = date.extractDate(formData.date, 'DD/MM/YYYY');
      const formatDate = date.formatDate(parseDate, 'MM/DD/YY');

      emit('onSearch', supplierName, formatDate);
    }

    const totalBalance = computed(() => {
      const sumBalance = (props.selectedRow as ResPaymentList[]).reduce(
        (accumulator, currentValue) => accumulator + currentValue['tot-debt'],
        0
      );
      return formatterMoney(sumBalance);
    });

    return {
      formData,
      supplierOptions,
      selectedAddress,
      onSearch,
      totalBalance,
    };
  },
  components: {
    SelectFilter: () => import('./SelectFilter.vue'),
  },
});
</script>
