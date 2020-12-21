<template>
  <STable
    row-key="key"
    :loading="isFetching"
    :columns="paymentListColumns"
    :data="paymentList"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    class="payment-list-table"
    :selected.sync="selected"
    selection="multiple"
    @row-click="onRowClick"
  >
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Print Selected Payment</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section
                  >Print All Payment With Same Bill Number</q-item-section
                >
              </q-item>
              <q-separator></q-separator>
              <q-item clickable v-ripple>
                <q-item-section>Cancel AR Payment</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { ResPaymentDebtPayList } from '../models/payment.model';
import { paymentListColumns } from '../tables/payment-list.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, required: true },
    paymentList: {
      type: Array as () => Array<ResPaymentDebtPayList & { key: number }>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selected = ref<(ResPaymentDebtPayList & { key: number })[]>([]);

    watch(
      () => props.paymentList,
      () => (selected.value = [])
    );

    function onRowClick(_, row: ResPaymentDebtPayList & { key: number }) {
      if (selected.value.find((item) => item.key === row.key)) {
        selected.value = selected.value.filter((item) => item.key !== row.key);
        emit('onRowClick', '');
      } else {
        selected.value = [...selected.value, row];
        // emit('onRowClick', row.comments);
      }
    }

    watch(selected, (newValue) => {
      const selectedRow: ResPaymentDebtPayList[] = newValue.map(
        ({ key, ...item }) => {
          item.selected = true;
          return item;
        }
      );

      emit('onSelection', selectedRow);
    });

    return {
      paymentListColumns,
      selected,
      onRowClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.payment-list-table {
  max-height: 80vh;
}
</style>
