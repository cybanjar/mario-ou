<template>
  <STable
    row-key="$_index"
    no-data-text="No Data"
    :columns="tableHeaderManageReservationList"
    :loading="isFetching"
    :data="rowsWithIndex"
    :selected.sync="selected"
    @row-click="onRowClick"
    no-pagination
    class="sticky-header"
    style="max-height: 500px"
  >
    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">
        {{ props.col.label }}
      </q-th>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right cursor-pointer">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Edit Main Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Split Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Insert Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Update Guest Name</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>View Reservation</q-item-section>
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
import { ReservationListData } from '../../../models/extra/manage-reservation/manageReservation.model';
import { useSelectedRow } from '../../../composables/selectedRow';
import { useDisposableDialog } from '../../../composables/disposableDialog';
import { tableHeaderManageReservationList } from '../../../tables/extra/manage-reservation/manageReservationList.table';

export default defineComponent({
  props: {
    rows: {
      type: Array as PropType<ReservationListData[]>,
      required: true,
    },
    selectedRow: {
      type: Object as PropType<ReservationListData>,
      default: null,
    },
    isFetching: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(
      props,
      emit,
      true
    );
    return {
      rowsWithIndex,
      selected,
      onRowClick,

      tableHeaderManageReservationList,
    };
  },
});
</script>
