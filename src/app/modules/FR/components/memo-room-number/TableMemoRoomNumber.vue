<template>
  <STable
    row-key="$_index"
    :columns="tableHeaders"
    :data="rowsWithIndex"
    :loading="isFetching"
    :selected.sync="selected"
    @row-click="onRowClick"
    no-data-text="No Data"
  >
    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right cursor-pointer">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Modify Reservation</q-item-section>
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
import { MemoRoomNumber } from '../../models/memo-room-number/memoRoomNumber.model';
import { tableHeaders } from '../../tables/memo-room-number/memoRoomNumber.table';
import { useSelectedRow } from '../../composables/selectedRow';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: { type: Array as PropType<MemoRoomNumber[]>, required: true },
    selectedRow: { type: Object as PropType<MemoRoomNumber>, default: null },
  },
  setup(props, { emit }) {
    const { selected, onRowClick, rowsWithIndex } = useSelectedRow(props, emit);

    return {
      tableHeaders,
      selected,
      onRowClick,
      rowsWithIndex,
    };
  },
});
</script>
