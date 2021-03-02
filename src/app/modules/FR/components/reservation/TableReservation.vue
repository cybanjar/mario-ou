<template>
  <div>
    <STable
      row-key="$_index"
      :class="rows.length > 0 && 'reservation-table'"
      :loading="isFetching"
      :columns="tableHeaders"
      :data="rowsWithIndex"
      :selected.sync="selected"
      @row-click="onRowClick"
      :rows-per-page-options="[10, 13, 16]"
      :pagination="{ rowsPerPage: 16 }"
    >
      <template #body-cell="props">
        <q-td :props="props">
          <div>{{ props.value }}</div>
        </q-td>
      </template>

      <template #header-cell-resnr="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>
      <template #body-cell-resnr="props">
        <q-td
          :props="props"
          class="fixed-col left"
          :class="
            checkResStatus(props.row, ['Accompanying Guest', 'Room Sharer']) &&
            'blue-left-border'
          "
        >
          <div>{{ props.value }}</div>
        </q-td>
      </template>

      <template #header-cell-rsv-name="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>
      <template #body-cell-rsv-name="props">
        <q-td :props="props" class="fixed-col left">
          <div class="row justify-between no-wrap">
            <span class="ellipsis">{{ props.value }}</span>
            <q-badge v-if="props.row.groupname.length > 0" class="q-ml-sm">
              G
              <q-tooltip anchor="top middle" self="center middle">
                Group Reservation
              </q-tooltip>
            </q-badge>
          </div>
        </q-td>
      </template>

      <template #header-cell-zinr="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>
      <template #body-cell-zinr="props">
        <q-td :props="props" class="fixed-col left">
          <div class="row justify-between no-wrap">
            <span>{{ props.value }}</span>
            <q-badge v-if="props.row['zinr-bgcol'] === 6" class="q-ml-sm">
              VD+
              <q-tooltip anchor="top middle" self="center middle">
                Vacant Dirty - Queueing Room
              </q-tooltip>
            </q-badge>
            <q-badge v-else-if="props.row['zinr-bgcol'] === 10" class="q-ml-sm">
              VD
              <q-tooltip anchor="top middle" self="center middle">
                Vacant Dirty
              </q-tooltip>
            </q-badge>
          </div>
        </q-td>
      </template>

      <template #header-cell-resline-name="props">
        <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
      </template>
      <template #body-cell-resline-name="props">
        <q-td :props="props" class="fixed-col left">
          <div class="row justify-between">
            <span class="col">{{ props.value }}</span>
            <div class="q-ml-sm">
              <TooltipIcon
                v-if="checkResStatus(props.row, 'Accompanying Guest')"
                name="mdi-account"
                tooltip-text="Accompanying Guest"
              />
              <TooltipIcon
                v-if="checkResStatus(props.row, 'Room Sharer')"
                name="mdi-account-multiple"
                tooltip-text="Room Sharer"
              />
              <TooltipIcon
                v-if="props.row.pseudofix"
                name="mdi-incognito"
                tooltip-text="Incognito Guest"
                color="black"
              />
            </div>
          </div>
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
            <q-menu anchor="bottom right" self="top right">
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  @click="
                    dialogGuestProfile.open({
                      type: props.row.karteityp,
                      guestNumber: props.row.gastnrmember,
                    })
                  "
                >
                  <q-item-section>View Guest Profile</q-item-section>
                </q-item>
                <q-item clickable v-ripple v-close-popup>
                  <q-item-section>Make Trace</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  :clickable="isCheckinEnabled(props.row)"
                  :class="!isCheckinEnabled(props.row) && 'disabled'"
                  v-ripple
                  v-close-popup
                  @click="onCheckin"
                >
                  <q-item-section>Check-in</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple>
                  <q-item-section>Room</q-item-section>
                  <q-item-section side>
                    <q-icon name="mdi-chevron-right" />
                  </q-item-section>
                  <MenuRoom :row="props.row" />
                </q-item>
                <q-item clickable v-ripple v-close-popup>
                  <q-item-section>Reservation</q-item-section>
                </q-item>
                <q-item clickable v-ripple v-close-popup>
                  <q-item-section>Keycard</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>

    <DialogGuestProfile
      :show.sync="dialogGuestProfile.state.show"
      :key="dialogGuestProfile.state.key"
      :type="dialogGuestProfile.state.data.type"
      :guest-number="dialogGuestProfile.state.data.guestNumber"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { date } from 'quasar';
import { useDisposableDialog } from '../../composables/disposableDialog';
import { useSelectedRow } from '../../composables/selectedRow';
import { DialogGuestProfileProps } from '../../models/common/dialogGuestProfile.model';
import { GuestProfileType } from '../../models/guest-profile/guestProfile.model';
import {
  PrepareReservation,
  Reservation,
  ReservationStatus,
} from '../../models/reservation/reservation.model';
import {
  tableHeaders,
  checkResStatus,
} from '../../tables/reservation/reservation.table';
import TooltipIcon from '../common/TooltipIcon.vue';
import type { SearchReservation } from './SearchReservation.vue';

export default defineComponent({
  components: {
    TooltipIcon,
    DialogGuestProfile: () => import('../common/DialogGuestProfile.vue'),
    MenuRoom: () => import('./MenuRoom.vue'),
  },
  props: {
    isFetching: { type: Boolean, default: false },
    rows: { type: Array as PropType<Reservation[]>, required: true },
    selectedRow: { type: Object as PropType<Reservation>, default: null },
    checkinEnabled: { type: Boolean, required: true },
    prepareData: {
      type: Object as PropType<PrepareReservation>,
      default: null,
    },
    searchData: {
      type: Object as PropType<SearchReservation>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { rowsWithIndex, selected, onRowClick } = useSelectedRow(props, emit);

    function isCheckinEnabled(row: Reservation) {
      if (props.searchData.reservationStatus !== ReservationStatus.Reservation)
        return false;

      const isSameDate = date.isSameDate(props.prepareData.ciDate, row.ankunft);
      if (isSameDate) return true;

      return props.checkinEnabled;
    }

    function onCheckin() {
      console.log('checkin');
    }

    return {
      tableHeaders,
      checkResStatus,
      rowsWithIndex,
      selected,
      onRowClick,
      isCheckinEnabled,
      onCheckin,
      dialogGuestProfile: useDisposableDialog<DialogGuestProfileProps>({
        guestNumber: null,
        type: GuestProfileType.Individual,
      }),
    };
  },
});
</script>

<style lang="scss" scoped>
.reservation-table::v-deep {
  tr th:first-child,
  tr th:nth-child(3) {
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
    width: 65px;
  }

  tr th:nth-child(4),
  tr td:nth-child(4) {
    left: 351px !important;
  }

  tr td:nth-child(4) > div {
    width: 255px;

    span {
      white-space: normal;
    }
  }

  .blue-left-border {
    border-left: 4px solid $primary;
  }

  @for $i from 23 through 26 {
    tr th:nth-child(#{$i}) {
      white-space: normal;
    }

    tr td:nth-child(#{$i}) > div {
      width: 90px;
    }
  }
}
</style>
