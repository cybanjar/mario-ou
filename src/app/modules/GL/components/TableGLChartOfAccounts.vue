<template>
  <STable
    :loading="isFetching"
    :columns="tableHeaders"
    :data="rows"
    :rows-per-page-options="[10, 13, 16]"
    :pagination.sync="pagination"
    :filter="filters"
    :filter-method="onFilter"
    @row-click="
      (evt, row) => {
        $emit('onRowClick', row);
      }
    "
  >
    <template #header-cell-fibukonto="props">
      <q-th :props="props" class="fixed-col left">
        {{ props.col.label }}
      </q-th>
    </template>

    <template #body-cell-fibukonto="props">
      <q-td :props="props" class="fixed-col left">
        {{ props.row.fibukonto }}
      </q-td>
    </template>

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
                @click="$emit('onShowBudget', props.row.fibukonto)"
              >
                <q-item-section>Show Account Budget</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { tableHeaders } from '../tables/chartOfAccounts.table';
import { filterTable } from '../utils/filterTables.utils';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: { type: Array, required: true },
    filters: { type: Object, required: true },
  },
  setup() {
    return {
      tableHeaders,
      onFilter: filterTable,
      pagination: { rowsPerPage: 10 },
    };
  },
});
</script>
