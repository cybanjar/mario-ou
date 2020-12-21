<template>
  <STable
    row-key="key"
    :loading="loading"
    :columns="viewTransColumns"
    :data="data"
    :pagination="{ rowsPerPage: 5 }"
    :rows-per-page-options="[5]"
    v-on="$listeners"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { viewTransColumns } from '../tables/transaction-view.tables';

export default defineComponent({
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
  },
  setup(_, { emit }) {
    const selected = ref([]);

    function viewTransaction(key) {
      emit('action:view', key);
    }

    function editTransaction(key) {
      emit('action:edit', key);
    }
    return {
      viewTransColumns,
      selected,
      viewTransaction,
      editTransaction,
    };
  },
});
</script>
