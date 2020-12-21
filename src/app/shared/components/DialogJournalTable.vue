<template>
  <STable
    v-bind="$attrs"
    row-key="key"
    :columns="columns"
    v-on="$listeners"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10]"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols.slice(0, 4)"
          :key="col.name"
          :rowspan="2"
          :props="props"
        >
          {{ col.label }}
        </q-th>
        <th :colspan="3">Before</th>
        <th :colspan="2">After</th>
        <q-th
          v-for="col in props.cols.slice(9, 11)"
          :key="col.name"
          :rowspan="2"
          :props="props"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
      <tr>
        <q-th
          v-for="col in props.cols.slice(4, 9)"
          :key="col.name"
          :rowspan="2"
          :props="props"
        >
          {{ col.label }}
        </q-th>
      </tr>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable @click="emitDelete(props.row)" v-ripple>
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
import { defineComponent, computed } from '@vue/composition-api';
import { journalTransColumns } from '../table/journal-transaction.table';

export default defineComponent({
  inheritAttrs: true,
  props: {
    isFixed: { type: Boolean, required: false, default: false },
  },
  setup(prop, { emit }) {
    const columns = computed(() => {
      if (!prop.isFixed) {
        return [
          ...journalTransColumns,
          {
            field: 'actions',
            name: 'actions',
          },
        ];
      }
      return journalTransColumns;
    });

    function emitDelete(data) {
      emit('delete', data);
    }
    return {
      columns,
      emitDelete,
    };
  },
});
</script>
