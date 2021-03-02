<template>
  <STable
    row-key="$_index"
    no-data-text="No Data"
    :loading="isFetching"
    :columns="tableHeaders"
    :data="rowsWithIndex"
    :selected.sync="selected"
    @row-click="onRowClick"
  >
    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Edit Group Member</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { tableHeaders } from '../../tables/group-check-in/groupCheckIn.table';
import { GroupCheckIn } from '../../models/group-check-in/groupCheckIn.model';
import { useSelectedRow } from '../../composables/selectedRow';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: { type: Array as PropType<GroupCheckIn[]>, required: true },
    selectedRow: { type: Object as PropType<GroupCheckIn>, default: null },
  },
  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(props, emit);

    return {
      tableHeaders,
      rowsWithIndex,
      selected,
      onRowClick,
    };
  },
});
</script>
