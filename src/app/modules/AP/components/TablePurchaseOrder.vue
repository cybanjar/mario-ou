<template>
  <STable
    row-key="docu-nr"
    :loading="isFetching"
    :columns="purchaseOrderListColumns"
    :data="purchaseOrderList"
    :virtual-scroll="true"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    :virtual-scroll-sticky-size-start="28"
    :class="purchaseOrderList.length > 0 && 'purchase-order-list-table'"
    class="virtual-scroll-sticky-header"
    :selected.sync="selected"
    @row-click="onRowClick"
  >
    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">
        {{ props.col.label }}
      </q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item
                clickable
                v-ripple
                @click="viewDetail(props.row['docu-nr'])"
              >
                <q-item-section>View In Detail</q-item-section>
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
import { ResPurchaseOrderList } from '../models/purchase-order.model';
import { purchaseOrderListColumns } from '../tables/purchase-order-list.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, required: true },
    purchaseOrderList: { type: Array, required: true },
  },
  setup(_, { emit }) {
    const selected = ref<ResPurchaseOrderList[]>([]);

    function onRowClick(_, row: ResPurchaseOrderList) {
      selected.value = [row];
    }

    function viewDetail(documentNumber: string) {
      emit('viewDetail', documentNumber);
    }

    return {
      purchaseOrderListColumns,
      onRowClick,
      selected,
      viewDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.purchase-order-list-table {
  height: 80vh;
}
</style>
