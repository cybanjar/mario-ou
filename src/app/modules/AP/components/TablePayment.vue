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
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { ResPaymentList } from '../models/payment.model';
import { paymentListColumns } from '../tables/payment-list.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, required: true },
    paymentList: { type: Array, required: true },
  },
  setup(props, { emit }) {
    const selected = ref<(ResPaymentList & { key: number })[]>([]);

    watch(
      () => props.paymentList,
      () => (selected.value = [])
    );

    function onRowClick(_, row: ResPaymentList & { key: number }) {
      if (selected.value.find((item) => item.key === row.key)) {
        selected.value = selected.value.filter((item) => item.key !== row.key);
        emit('onRowClick', '');
      } else {
        selected.value = [...selected.value, row];
        emit('onRowClick', row.comments);
      }
    }

    watch(selected, (newValue) => {
      const selectedRow: ResPaymentList[] = newValue.map(({ key, ...item }) => {
        item.selected = true;
        return item;
      });

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
