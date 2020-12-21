<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <q-form>
        <SSelect
          label-text="Supplier"
          :options="suppliers"
          v-model="supplier"
          option-label="firma"
        />
        <!-- 
        <SSelect
          label-text="Account Category"
          :options="filters.categories"
          v-model="category"
          :loading="isFetching"
        />

        <SSelect
          label-text="Account Department"
          :options="filters.departments"
          v-model="department"
          :loading="isFetching"
        /> -->

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

    <q-separator style="border-width: 1px" class="q-my-md" />

    <!-- <div class="q-px-md">
      <SRemarkLeftDrawer label="Remark & Last User Changed" :value="remark" />
    </div> -->
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useSearchPUSupplierQuotation } from '../functions/useSearchPUSupplierQuotation';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    suppliers: { type: Array, required: true },
  },
  setup(_, { emit }) {
    return {
      ...useSearchPUSupplierQuotation(),
    };
  },
});
</script>
