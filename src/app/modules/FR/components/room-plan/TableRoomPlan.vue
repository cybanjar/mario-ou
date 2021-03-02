<template>
  <STable
    class="sticky-header"
    :class="tableRows.length > 0 && 'room-plan-table'"
    :loading="isFetching"
    :columns="tableHeaders"
    :data="tableRows"
    no-pagination
    virtual-scroll
  >
    <template #header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="fixed-col left"
        >
          <span>{{ col.label }}</span>
          <q-icon
            name="mdi-menu-down"
            class="cursor-pointer"
            size="24px"
            :color="filter.floor === '' ? 'grey-5' : 'white'"
            v-if="col.name === 'etage'"
          >
            <q-popup-edit
              v-model.number="filter.floor"
              buttons
              label-set="OK"
              :cover="false"
              @save="setupTableRows()"
            >
              <SInput
                label-text="Floor"
                v-model.number="filter.floor"
                input-classes="q-mb-none"
                placeholder="All"
                type="number"
                autofocus
              />
            </q-popup-edit>
          </q-icon>

          <q-icon
            name="mdi-menu-down"
            class="cursor-pointer"
            size="24px"
            :color="filter.bedType.all ? 'grey-5' : 'white'"
            v-if="col.name === 'c-char'"
          >
            <q-popup-edit
              v-model="filter.bedType"
              buttons
              label-set="OK"
              :cover="false"
              @save="setupTableRows()"
            >
              <q-checkbox label="All" v-model="filter.bedType.all" />
              <q-option-group
                type="checkbox"
                :options="bedTypeOptions"
                v-model="filter.bedType.data"
                :disable="filter.bedType.all"
              />
            </q-popup-edit>
          </q-icon>

          <q-icon
            name="mdi-menu-down"
            class="cursor-pointer"
            size="24px"
            :color="filter.roomStatus.all ? 'grey-5' : 'white'"
            v-if="col.name === 'ststr'"
          >
            <q-popup-edit
              v-model="filter.roomStatus"
              buttons
              label-set="OK"
              :cover="false"
              @save="setupTableRows()"
            >
              <q-checkbox label="All" v-model="filter.roomStatus.all" />
              <q-option-group
                type="checkbox"
                :options="roomStatusOptions"
                v-model="filter.roomStatus.data"
                :disable="filter.roomStatus.all"
              />
            </q-popup-edit>
          </q-icon>

          <q-icon
            name="mdi-menu-down"
            class="cursor-pointer"
            size="24px"
            :color="filter.roomType.all ? 'grey-5' : 'white'"
            v-if="col.name === 'rmcat'"
          >
            <q-popup-edit
              v-model="filter.roomType"
              buttons
              label-set="OK"
              :cover="false"
              @save="setupTableRows()"
            >
              <q-checkbox label="All" v-model="filter.roomType.all" />
              <q-option-group
                type="checkbox"
                :options="roomTypeOptions"
                v-model="filter.roomType.data"
                :disable="filter.roomType.all"
              />
            </q-popup-edit>
          </q-icon>
        </q-th>
        <q-th v-for="{ date, day } in dateHeaders" :key="date">
          {{ date }}<br />{{ day }}
        </q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="fixed-col left"
        >
          <div
            v-if="col.name === 'zinr' && props.row['i-char'] !== ''"
            class="row justify-between"
          >
            <span>{{ col.value }}</span>
            <q-badge class="q-ml-sm">
              i
              <q-tooltip anchor="top right" self="center middle">
                Inactive
              </q-tooltip>
            </q-badge>
          </div>
          <div v-else>{{ col.value }}</div>
        </q-td>
        <q-td
          v-for="(item, index) in props.row.rooms"
          :key="index"
          :colspan="item.colspan"
          class="room-column"
        >
          <div
            :style="{ width: 85 * item.colspan + 'px' }"
            class="room-column__content"
          >
            <div
              v-if="item.name !== ''"
              class="room-column__chip ellipsis cursor-pointer"
              :class="roomStatus[item.status] && 'room-column__chip--with-icon'"
            >
              <q-icon
                v-if="roomStatus[item.status]"
                :name="roomStatus[item.status].icon"
                size="18px"
              />
              <span>{{ item.name }}</span>

              <q-tooltip
                v-if="item.tooltip"
                anchor="bottom middle"
                self="center left"
              >
                <span class="room-column__tooltip-text" v-html="item.tooltip" />
              </q-tooltip>

              <q-popup-proxy>
                <PopupRoomReservation
                  :room="item"
                  :room-number="props.row.zinr"
                  :current-date="currentDate"
                />
              </q-popup-proxy>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </STable>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import { date } from 'quasar';
import { TableHeader } from '~/components/VhpUI/typings';
import {
  RoomList,
  RoomColumn,
  RoomPlan,
} from '../../models/room-plan/roomPlan.model';

interface DateHeader {
  date: string;
  day: string;
}

interface TableRow extends RoomList {
  rooms: RoomColumn[];
}

const tableHeaders: TableHeader<TableRow>[] = [
  { label: 'Floor', align: 'center', field: 'etage', name: 'etage' },
  {
    label: 'Room Number',
    align: 'left',
    sortable: true,
    field: 'zinr',
    name: 'zinr',
  },
  {
    label: 'Connecting',
    align: 'left',
    sortable: true,
    field: 'connec',
    name: 'connec',
  },
  { label: 'Bed Type', align: 'left', field: 'c-char', name: 'c-char' },
  { label: 'Room Status', align: 'left', field: 'ststr', name: 'ststr' },
  { label: 'Room Type', align: 'left', field: 'rmcat', name: 'rmcat' },
  { label: 'Checkout To Date', align: 'left', name: 'checkout-to-date' },
];

const roomStatus = {
  2: { name: 'In House Guest', icon: 'mdi-account' },
  1: { name: 'Reservation', icon: 'mdi-calendar-check-outline' },
  12: { name: 'Out of Service', icon: 'mdi-timer-sand-full' },
  9: { name: 'Out of Order', icon: 'mdi-tools' },
  10: { name: 'Off Market', icon: 'mdi-cancel' },
};

const bedTypeOptions = [
  { value: 'K', label: 'K - KING' },
  { value: 'D', label: 'D - DOUBLE' },
];

const roomStatusOptions = [
  { value: 'VC', label: 'VC - Vacant Clean Checked' },
  { value: 'VCU', label: 'VCU - Vacant Clean Unchecked' },
  { value: 'VD', label: 'VD - Vacant Dirty' },
  { value: 'OC', label: 'OC - Occupied Clean' },
  { value: 'OD', label: 'OD - OCcupied Dirty' },
];

const roomTypeOptions = [
  { value: 'HKN', label: 'HKN - Harris King Non Smoking' },
  { value: 'HKS', label: 'HKS - Harris King Smoking' },
];

const reservationStatus = {
  1: 'Guaranted',
  2: '6PM',
  3: 'Tentative',
  4: 'WaitList',
  5: 'VerbalConfirm',
  6: 'Inhouse',
  8: 'Departed',
  9: 'Cancelled',
  10: 'NoShow',
  11: 'ShareRes',
  13: 'RmSharer',
};

export default defineComponent({
  components: {
    PopupRoomReservation: () => import('./PopupRoomReservation.vue'),
  },
  props: {
    isFetching: { type: Boolean, default: false },
    data: { type: Object as PropType<RoomPlan>, default: null },
    currentDate: { type: Date, default: null },
  },
  setup(props) {
    const dateHeaders = computed<DateHeader[]>(() => {
      if (!props.currentDate) return [];

      return [...Array(28)].map((_, idx) => {
        const usedDate = date.addToDate(props.currentDate, { days: idx });
        return {
          date: date.formatDate(usedDate, 'DD/MM/YY'),
          day: date.formatDate(usedDate, 'ddd').toUpperCase(),
        };
      });
    });

    const filter = reactive({
      floor: '' as number | string,
      bedType: {
        all: true,
        data: bedTypeOptions.map(({ value }) => value),
      },
      roomStatus: {
        all: true,
        data: roomStatusOptions.map(({ value }) => value),
      },
      roomType: {
        all: true,
        data: roomTypeOptions.map(({ value }) => value),
      },
    });

    watch(
      () => filter.bedType.all,
      () => {
        filter.bedType.data = bedTypeOptions.map(({ value }) => value);
      }
    );

    watch(
      () => filter.roomStatus.all,
      () => {
        filter.roomStatus.data = roomStatusOptions.map(({ value }) => value);
      }
    );

    watch(
      () => filter.roomType.all,
      () => {
        filter.roomType.data = roomTypeOptions.map(({ value }) => value);
      }
    );

    watch(
      () => props.data,
      () => setupTableRows()
    );

    const tableRows = ref<TableRow[]>([]);

    function setupTableRows() {
      let data = props.data.roomList.map((row) => {
        const rooms: RoomColumn[] = [];

        row.room.forEach((item, index) => {
          if (rooms.length < 1 || item === '') {
            rooms.push({
              name: item,
              startIndex: index,
              status: row.gstatus[index],
              reservationId: row.recid1[index],
              colspan: 1,
              tooltip: createTooltip(
                row.recid1[index],
                row['off-mkt'][index],
                row.gstatus[index]
              ),
            });
            return;
          }

          const lastData = rooms[rooms.length - 1];
          if (item === lastData.name) {
            lastData.colspan++;
          } else {
            rooms.push({
              name: item,
              startIndex: index,
              status: row.gstatus[index],
              reservationId: row.recid1[index],
              colspan: 1,
              tooltip: createTooltip(
                row.recid1[index],
                row['off-mkt'][index],
                row.gstatus[index]
              ),
            });
          }
        });

        return { ...row, rooms };
      });

      if (typeof filter.floor === 'number') {
        data = data.filter((item) => item.etage === filter.floor);
      }

      if (!filter.bedType.all) {
        data = data.filter((item) =>
          filter.bedType.data.includes(item['c-char'].trim())
        );
      }

      if (!filter.roomStatus.all) {
        data = data.filter((item) =>
          filter.roomStatus.data.includes(item.ststr.trim())
        );
      }

      if (!filter.roomType.all) {
        data = data.filter((item) =>
          filter.roomType.data.includes(item.rmcat.trim())
        );
      }

      tableRows.value = data;
    }

    function createTooltip(
      reservationId: number,
      blockedRoom: boolean,
      gstatus: number
    ) {
      const reservation = props.data.reservations.find(
        (val) => val['rec-id'] === reservationId
      );
      if (reservation) {
        let status = reservationStatus[reservation.resstatus] ?? '';
        if (blockedRoom) status += ' (Blocking Room)';

        let text = 'Status: ' + status + '<br />';
        text += 'Guest: ' + reservation.name + '<br />';
        text +=
          'Arrival: ' +
          date.formatDate(reservation.ankunft, 'DD/MM/YY') +
          '<br />';
        text +=
          'Departure: ' +
          date.formatDate(reservation.abreise, 'DD/MM/YY') +
          '<br />';

        return text;
      }

      const outOfOrder = props.data.outOfOrders.find(
        (val) => val['rec-id'] === reservationId
      );
      if (outOfOrder) {
        return (
          (roomStatus[gstatus]?.name ?? '') +
          ' reason:<br />' +
          outOfOrder.gespgrund
        );
      }

      return null;
    }

    return {
      tableHeaders,
      roomStatus,
      dateHeaders,
      filter,
      tableRows,
      setupTableRows,
      bedTypeOptions,
      roomStatusOptions,
      roomTypeOptions,
    };
  },
});
</script>

<style lang="scss" scoped>
.room-plan-table {
  max-height: 628px;

  tr th span {
    white-space: normal;
  }

  tr td:first-child > div {
    width: 60px;
  }

  tr th:nth-child(2),
  tr td:nth-child(2) {
    left: 85px !important;
  }

  tr td:nth-child(2) > div {
    width: 65px;
  }

  tr th:nth-child(3),
  tr td:nth-child(3) {
    left: #{85 + 83}px !important;
  }

  tr td:nth-child(3) > div {
    width: 85px;
  }

  tr th:nth-child(4),
  tr td:nth-child(4) {
    left: #{85 + 83 + 103}px !important;
  }

  tr td:nth-child(4) > div {
    width: 80px;
  }

  tr th:nth-child(5),
  tr td:nth-child(5) {
    left: #{85 + 83 + 103 + 98}px !important;
  }

  tr td:nth-child(5) > div {
    width: 62px;
  }

  tr th:nth-child(6),
  tr td:nth-child(6) {
    left: #{85 + 83 + 103 + 98 + 80}px !important;
  }

  tr td:nth-child(6) > div {
    width: 56px;
  }

  tr th:nth-child(7),
  tr td:nth-child(7) {
    left: #{85 + 83 + 103 + 98 + 80 + 74}px !important;
  }
}

.room-column {
  padding: 0 !important;

  &__content {
    padding: 4px 8px;
  }

  &__chip {
    background-color: $primary;
    border-radius: 4px;
    color: #ffffff;
    font-weight: 700;
    padding: 4px 6px;
    position: relative;
    text-align: center;

    &--with-icon {
      padding-left: 30px;
    }

    i {
      left: 6px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__tooltip-text {
    font-size: 13px;
    font-weight: 700;
  }
}
</style>
