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
    <template #body-cell-description="props">
      <q-td
        :props="props"
        :set="(description1 = props.row.description.substring(0, 12))"
      >
        <div class="ellipsis phone-column">{{ description1 }}</div>
        <q-tooltip
          anchor="top middle"
          self="center middle"
          v-if="description1.trim().length > 0"
          >{{ description1 }}</q-tooltip
        >
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { mainColumn } from '../tables/fo-transaction-main.table';

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
      columns: mainColumn,
    };
  },
});
</script>
