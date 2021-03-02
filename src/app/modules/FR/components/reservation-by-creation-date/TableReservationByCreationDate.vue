<template>
  <div class="row q-col-gutter-x-md">
    <!-- The beginning of Table1 Main Reservation -->
    <div class="col-5">
      <STable
        row-key="$_index"
        :loading="isFetchingMainReservation"
        :columns="tableHeadersMainReservation"
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
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section>Insert Reservation</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>View Allotment</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>View Rate</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>
    </div>

    <!-- The beginning of Table2 Reservation Member -->
    <div class="col-7">
      <STable
        :loading="isFetchingReservationMember"
        :columns="tableHeadersReservationMember"
        :data="rowsReservationMember"
        no-data-text="Please select one row from Main Reservation table"
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
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section>View Guest Profile</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>View Expected Revenue</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Reservation Log</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Modify Reservation</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Cancel Reservation</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>Delete Reservation</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { useSelectedRow } from '../../composables/selectedRow';
import {
  tableHeadersMainReservation,
  tableHeadersReservationMember,
} from '../../tables/reservation-by-creation-date/reservationByCreationDate.table';
import {
  MainReservation,
  ReservationMember,
} from '../../models/reservation-by-creation-date/reservationByCreationDate.model';

export default defineComponent({
  props: {
    isFetchingMainReservation: { type: Boolean, default: false },
    isFetchingReservationMember: { type: Boolean, default: false },
    rows: {
      type: Array as PropType<MainReservation[]>,
      required: true,
    },
    rowsReservationMember: {
      type: Array as PropType<ReservationMember[]>,
      required: true,
    },
    selectedRow: {
      type: Object as PropType<MainReservation>,
      default: null,
    },
  },

  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(props, emit);

    return {
      tableHeadersMainReservation,
      tableHeadersReservationMember,
      rowsWithIndex,
      selected,
      onRowClick,
    };
  },
});
</script>
