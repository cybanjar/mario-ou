<template>
  <STable
    row-key="key"
    :loading="loading"
    :columns="viewTransColumns"
    :data="data"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    fixed-header
    height="180px"
    v-on="$listeners"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { viewTransColumns } from '../tables/journal-view.tables';

export default defineComponent({
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
  },
  setup(_, { emit }) {
    const selected = ref([]);
    const pagination = ref();

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
      pagination,
    };
  },
});
</script>
