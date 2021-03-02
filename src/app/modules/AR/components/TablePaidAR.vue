<template>
  <STable
    v-bind="$attrs"
    v-on="$listeners"
    row-key="key"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    :columns="columns"
    :data="data"
    fixed-header
  >
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right" width="50px">
        <q-icon
          v-if="props.row.billNumber != undefined"
          name="mdi-dots-vertical"
          size="16px"
        >
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section @click="emitAction('print-selected')(props.row)"
                  >Print Selected Payment</q-item-section
                >
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section @click="emitAction('print-all')(props.row)"
                  >Print All Payment With Same Bill Number</q-item-section
                >
              </q-item>
              <q-separator />
              <q-item clickable v-ripple>
                <q-item-section @click="emitAction('cancel-ar')(props.row)"
                  >Cancel AR Payment</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { TablePaymentList } from '../models/payment-list.model';
import { getMainColumns } from '../tables/paid-ar-main.table';

export default defineComponent({
  inheritAttrs: true,
  props: {
    data: { type: Array as () => TablePaymentList[], required: true },
    showInv: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selected = ref<[]>([]);
    const columns = computed(() => getMainColumns(props.showInv));

    function emitAction(key) {
      return (data) => emit(`action:${key}`, data);
    }

    const pagination = ref({
      rowsPerPage: 0,
    });

    return {
      columns,
      selected,
      emitAction,
      pagination,
    };
  },
});
</script>
