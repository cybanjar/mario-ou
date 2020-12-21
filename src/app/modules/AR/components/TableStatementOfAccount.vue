<template>
  <div>
    <STable
      row-key="key"
      :loading="isFetching"
      :columns="soaListColumns"
      :data="soaList"
      :virtual-scroll="true"
      :pagination="{ rowsPerPage: 0 }"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="28"
      selection="single"
      :selected.sync="selectedsoaList"
      class="virtual-scroll-sticky-header soa-list-table"
    ></STable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { soaListColumns } from '../tables/soa-list.table';
export default defineComponent({
  props: {
    isFetching: { type: Boolean, required: true },
    soaList: { type: Array, required: true },
  },
  setup() {
    const selectedsoaList = ref([]);
    return {
      soaListColumns,
      selectedsoaList,
    };
  },
});
</script>
<style lang="scss" scoped>
.soa-list-table {
  height: 80vh;
}
</style>
