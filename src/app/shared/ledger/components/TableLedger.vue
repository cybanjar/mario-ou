<template>
  <STable
    row-key="key"
    :loading="loading"
    :columns="columns"
    :data="data"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10]"
    :selected.sync="selected"
    selection="multiple"
    v-on="$listeners"
  >
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

    function viewTransaction(key) {
      emit('action:view', key);
    }

    const columns = computed(() => getLedgerColumn(props.display));

    watch(
      () => props.loading,
      (value) => {
        if (value === true) {
          selected.value = [];
        }
      }
    );

    function editTransaction(key) {
      emit('action:edit', key);
    }
    return {
      columns,
      selected,
      viewTransaction,
      editTransaction,
    };
  },
});
</script>
