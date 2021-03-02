<template>
  <STable
    v-bind="$attrs"
    row-key="key"
    :columns="columns"
    :data="data"
    v-on="$listeners"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    fixed-header
    fix-width
  >
  </STable>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { columns } from '../tables/outlet-transaction-main.table';

export default defineComponent({
  inheritAttrs: true,
  props: {
    data: { type: Array, required: true },
  },
  setup() {
    const pagination = ref();
    function getProp(params: any[], as, asa) {
      const hasField = params.findIndex((a) => a.name === as);
      return !!~hasField ? asa : undefined;
    }

    return {
      pagination,
      getProp,
      columns,
    };
  },
});
</script>
