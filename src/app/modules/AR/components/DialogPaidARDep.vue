<template>
  <SDialog dialog-style="width: 50%" v-bind="$attrs" v-on="$listeners">
    <template #title> MODAL DEPARTMENT </template>
    <template #body>
      <div class="row">
        <div class="col-12 q-pa-sm">
          <STable
            row-key="key"
            :fixed-header="true"
            :columns="columns"
            :data="data"
            table-style="height: 25vh;"
          />
        </div>
      </div>
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
import { deptartementListColumns } from '../tables/paid-ar-departement.table';

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
    function submit() {
      console.log('');
    }

    return {
      ...toRefs(filter),
      submit,
      columns: deptartementListColumns,
    };
  },
});
</script>
