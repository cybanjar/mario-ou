<template>
  <SDialog v-bind="$attrs" v-on="$listeners">
    <template #title> Release A/R Payment Records </template>
    <template #body>
      <div class="row">
        <div class="col-3 q-pa-sm">
          <q-form @submit="submit">
            <SSelect
              :options="statusDisplay"
              v-model="articleNumber"
              label-text="Article Number"
              emit-value
              map-options
            ></SSelect>
            <SSelect
              :options="statusDisplay"
              v-model="billNumber"
              label-text="Bill Number"
              emit-value
              map-options
            ></SSelect>
            <SDateInput v-model="date" label-text="Date"></SDateInput>
            <SInput v-model="amount" label-text="Amount" type="number"></SInput>
            <div>
              <q-btn
                dense
                color="primary"
                icon="mdi-magnify"
                label="Search"
                class="q-mt-md full-width"
                type="submit"
              />
            </div>
          </q-form>
        </div>
        <div class="col-9 q-pa-sm">
          <STable
            row-key="key"
            :fixed-header="true"
            :columns="secondListColumns"
            :data="data"
            table-style="height: 45vh;"
            @row-click="dialog.show"
          />
        </div>
      </div>
      <DialogDep :data="data" :value="dialog.status" @hide="dialog.hide" />
    </template>
    <template #action-cancel>
      <q-btn
        v-close-popup
        label="Cancel"
        color="primary"
        flat
        class="q-mr-sm"
      />
    </template>
    <template #action-ok>
      <q-btn v-close-popup label="Save" color="primary" />
    </template>
  </SDialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
import { secondListColumns } from '../tables/paid-ar-secondary.table';

const statusDisplay = [
  { value: 'all', label: 'all' },
  { value: 'full', label: 'full' },
  { value: 'booked', label: 'booked' },
  { value: 'out of order', label: 'out of order' },
];

export default defineComponent({
  inheritAttrs: true,
  props: {
    data: { type: Array, required: true },
  },
  setup() {
    const filter = reactive({
      articleNumber: null,
      billNumber: null,
      date: null,
      amount: null,
    });

    const dialog = useDialog();

    function submit() {
      console.log('');
    }

    return {
      ...toRefs(filter),
      dialog,
      submit,
      statusDisplay,
      secondListColumns,
    };
  },
  components: {
    DialogDep: () => import('./DialogPaidARDep.vue'),
  },
});
</script>
