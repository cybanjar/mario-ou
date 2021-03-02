<template>
  <div>
    <STable
      v-bind="$attrs"
      row-key="key"
      :columns="paymentListColumns"
      :data="data"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      virtual-scroll
      fixed-header
      fixed-width
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="onRowClick(props.row)">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <STooltip
              :key="col.name"
              v-if="col.name !== 'actions'"
              :value="col.value"
              :spacing="8"
              @set:tip="updateTooltip"
            />
          </q-td>
        </q-tr>
      </template>
    </STable>
    <q-tooltip
      :target="tooltip.target"
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
    >
      <strong>{{ tooltip.value }}</strong>
    </q-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import { ResPaymentDebtPayList } from '../models/payment.model';
import { paymentListColumns } from '../tables/payment-list.table';

export default defineComponent({
  inheritAttrs: true,
  props: {
    data: {
      type: Array as () => Array<ResPaymentDebtPayList & { key: number }>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selected = ref<(ResPaymentDebtPayList & { key: number })[]>([]);
    const pagination = ref();
    const tooltip = reactive({
      target: false,
      value: null,
    });

    function onRowClick(row: ResPaymentDebtPayList & { key: number }) {
      const rr = selected.value.findIndex((it) => it.key === row.key);

      if (rr >= 0) {
        selected.value = [
          ...selected.value.slice(0, rr),
          ...selected.value.slice(rr + 1),
        ];
      } else {
        selected.value = [...selected.value, row];
      }
      emit('update:selected', { selected: selected.value });
    }

    function updateTooltip({ selector, text }) {
      tooltip.target = selector;
      tooltip.value = text;
      console.log(selector, text);
    }

    return {
      paymentListColumns,
      selected,
      tooltip: toRefs(tooltip),
      onRowClick,
      updateTooltip,
      pagination,
    };
  },
});
</script>
