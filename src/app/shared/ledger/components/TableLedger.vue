<template>
  <div class="table-ledger">
    <STable
      row-key="key"
      :loading="loading"
      :columns="columns"
      :data="data"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :selected.sync="selected"
      selection="multiple"
      v-on="$listeners"
      fixed-header
      fixed-width
    >
      <template #body-cell="props">
        <q-td :props="props">
          <b v-if="boldTotal(props.row)">{{ props.value }}</b>
          <template v-else>{{ props.value }}</template>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" class="fixed-col right">
          <q-icon name="mdi-dots-vertical" size="16px">
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list>
                <q-item clickable v-ripple>
                  <q-item-section @click="viewTransaction(props.row)"
                    >View Transaction</q-item-section
                  >
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section @click="editTransaction(props.row)"
                    >Edit Transaction</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed } from '@vue/composition-api';
import { getLedgerColumn, SortType } from '../tables/ledger.tables';
import { LedgerData } from '../helpers/reformData.helper';

export default defineComponent({
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
    display: {
      type: Number as () => SortType,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selected = ref<LedgerData[]>([]);
    const pagination = ref();

    const columns = computed(() => getLedgerColumn(props.display));

    watch(
      () => props.loading,
      (value) => {
        if (value === true) {
          selected.value = [];
        }
      }
    );

    function viewTransaction(key: LedgerData) {
      if (key.jnr !== undefined) {
        emit('action:view', key);
      }
    }

    function editTransaction(key: LedgerData) {
      if (key.jnr !== undefined) {
        emit('action:edit', key);
      }
    }

    function boldTotal(row) {
      const desc = row.description.replace(/ /g, '').toLowerCase();
      return desc === 'subtotal';
    }
    return {
      columns,
      selected,
      viewTransaction,
      editTransaction,
      pagination,
      boldTotal,
    };
  },
});
</script>
<style lang="scss">
.table-ledger {
  thead tr th:first-child,
  tbody tr td:first-child {
    width: 50px;
  }
  tbody tr td:first-child {
    justify-content: center;
    display: flex;
  }
}
</style>
