<template>
  <STable
    row-key="$_index"
    :class="rows.length > 0 && 'reinstate-table'"
    :loading="isFetching"
    :columns="tableHeaders"
    :data="rowsWithIndex"
    @row-click="onRowClick"
    :selected.sync="selected"
    no-pagination
    style="max-height: 510px"
    class="sticky-header"
  >
    <template #header-cell-resnr="props">
      <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-resnr="props">
      <q-td :props="props" class="fixed-col left">
        <div>{{ props.value }}</div>
      </q-td>
    </template>

    <template #header-cell-rsvname="props">
      <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-rsvname="props">
      <q-td :props="props" class="fixed-col left">
        <div class="ellipsis">{{ props.value }}</div>
      </q-td>
    </template>

    <template #header-cell-rsname="props">
      <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-rsname="props">
      <q-td :props="props" class="fixed-col left">
        <div>{{ props.value }}</div>
      </q-td>
    </template>

    <template #header-cell-actions="props">
      <q-th :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right cursor-pointer">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Reinstate This Reservation</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Reinstate Group Reservation</q-item-section>
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
import { ReinstateCancelledReservation } from '../../models/reinstate-cancelled-reservation/reinstateCancelledReservation.model';
import { useSelectedRow } from '../../composables/selectedRow';
import { tableHeaders } from '../../tables/reinstate-cancelled-reservation/reinstateCancelledReservation.table';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    rows: {
      type: Array as PropType<ReinstateCancelledReservation[]>,
      required: true,
    },
    selectedRow: {
      type: Object as PropType<ReinstateCancelledReservation>,
      default: null,
    },
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

<style lang="scss" scoped>
.reinstate-table {
  tr th:first-child {
    white-space: normal;
  }

  tr td:first-child > div {
    width: 85px;
  }

  tr th:nth-child(2),
  tr td:nth-child(2) {
    left: 110px !important;
  }

  tr td:nth-child(2) > div {
    width: 140px;
  }

  tr th:nth-child(3),
  tr td:nth-child(3) {
    left: 268px !important;
  }

  tr td:nth-child(3) > div {
    white-space: normal;
    width: 286px;
  }
}
</style>
