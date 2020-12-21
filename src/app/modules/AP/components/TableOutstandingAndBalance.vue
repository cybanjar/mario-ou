<template>
  <STable
    row-key="key"
    :loading="isFetching"
    :columns="apListColumns"
    :data="apList"
    :virtual-scroll="true"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    :virtual-scroll-sticky-size-start="28"
    :class="apList.length > 0 && 'ap-list-table'"
    class="virtual-scroll-sticky-header"
    :selected.sync="selected"
    @row-click="onRowClick"
  >
    <template #header-cell-firma="props">
      <q-th :props="props" class="fixed-col left"> {{ props.col.label }}</q-th>
    </template>

    <template #body-cell-firma="props">
      <q-td :props="props" class="fixed-col left">
        <span
          v-if="!['T O T A L', 'GRAND TOTAL'].includes(props.row.firma.trim())"
          >{{ props.row.firma }}</span
        >
      </q-td>
    </template>

    <template #body-cell-lscheinnr="props">
      <q-td :props="props">
        <strong v-if="props.row.firma.trim() === 'T O T A L'">Subtotal</strong>
        <strong v-else-if="props.row.firma.trim() === 'GRAND TOTAL'"
          >Total</strong
        >
        <span v-else>{{ props.row.lscheinnr }}</span>
      </q-td>
    </template>

    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">
        {{ props.col.label }}
      </q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon
          name="mdi-dots-vertical"
          size="16px"
          v-if="!['T O T A L', 'GRAND TOTAL'].includes(props.row.firma.trim())"
        >
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple v-if="sortType !== 2">
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="viewDisplayPayment(props.row['ap-recid'])"
              >
                <q-item-section>Display Payment</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="viewStockItemList(props.row.firma)"
              >
                <q-item-section>Stock Item List</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-if="sortType !== 2 && type !== 0">
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { APList } from '../models/outstanding-and-balance.model';
import { apListColumns } from '../tables/outstanding-and-balance.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, required: true },
    apList: { type: Array, required: true },
    sortType: { type: Number, required: true },
    type: { type: Number, required: true },
  },
  setup(_, { emit }) {
    const selected = ref<APList[]>([]);

    function onRowClick(_, row: APList) {
      selected.value = [row];
    }

    function viewStockItemList(supplierName: string) {
      emit('viewStockItemList', supplierName);
    }

    function viewDisplayPayment(recid: number) {
      emit('viewDisplayPayment', recid);
    }

    return {
      apListColumns,
      selected,
      onRowClick,
      viewStockItemList,
      viewDisplayPayment,
    };
  },
});
</script>

<style lang="scss" scoped>
.ap-list-table {
  height: 80vh;
}
</style>
