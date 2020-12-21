<template>
  <div>
    <STable
      class="table-rooming-list"
      :loading="isFetching"
      :columns="roomTableHeaders"
      :data="filterRooms.status === 'Arrival' ? tableArrival : tableRooms"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination"
      hide-pagination
      row-key="zinr"
      :filter="filterRooms"
      :filter-method="filterMain"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th
            :props="props"
            key="icons"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; width: 70px;"
          />
          <q-th
            :props="props"
            key="roomNumber"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; left: 70px;"
          >
            {{ props.colsMap.roomNumber.label }}
          </q-th>
          <q-th colspan="3">Room</q-th>
          <q-th colspan="2">Guest</q-th>
          <q-th colspan="2">Arrival</q-th>
          <q-th colspan="2">Departure</q-th>
          <q-th colspan="3">Reservation</q-th>
          <q-th
            :props="props"
            key="guestName"
            rowspan="2"
            class="fixed-col right"
            style="z-index: 4;"
          >
            {{ props.colsMap.guestName.label }}
          </q-th>
        </q-tr>
        <q-tr :props="props">
          <q-th
            v-for="col in getDefaultColumns(props.cols)"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr
          :props="props"
          class="cursor-pointer"
          :class="{
            selected: selectedRoom && selectedRoom.zinr === props.key,
          }"
          @click="onClickRow(props.row)"
        >
          <q-td
            :props="props"
            key="icons"
            class="fixed-col left"
            style="padding-left: 8px;"
          >
            <template v-if="props.row.statusIcons.length !== 0">
              <span
                v-for="statusIcon in props.row.statusIcons"
                :key="statusIcon.icon"
              >
                <q-icon
                  :name="statusIcon.icon"
                  :class="`text-${statusIcon.color}`"
                  style="font-size: 22px;"
                >
                  <q-tooltip
                    anchor="bottom middle"
                    self="center middle"
                    style="font-size: 14px;"
                  >
                    {{ statusIcon.title }}
                  </q-tooltip>
                </q-icon>
              </span>
            </template>
          </q-td>

          <q-td
            :props="props"
            key="roomNumber"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 70px;"
          >
            {{ props.row.zinr }}
          </q-td>

          <q-td
            :props="props"
            v-for="col in getDefaultColumns(props.cols)"
            :key="col.name"
            :class="[col.name === 'reserveRemark' && 'ellipsis']"
          >
            <template v-if="col.name === 'reserveRemark'">
              {{ props.row.bemerk }}

              <q-tooltip
                v-if="props.row.bemerk !== ''"
                anchor="bottom middle"
                self="top middle"
                :offset="[0, 0]"
              >
                {{ props.row.bemerk }}
              </q-tooltip>
            </template>
            <template v-else>
              {{ props.row[col.field] }}
            </template>
          </q-td>

          <q-td
            :props="props"
            key="guestName"
            class="fixed-col right"
            style="box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);"
          >
            {{ props.row.gname }}
          </q-td>
        </q-tr>
      </template>
    </STable>

    <q-expansion-item
      class="q-mt-md"
      label="Guest History"
      header-class="bg-primary text-white"
      expand-icon-class="text-white"
      default-opened
    >
      <STable
        class="table-history-list"
        :data="tableHistory"
        :columns="historyTableHeaders"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        hide-pagination
        :filter="guestNumber"
        :filter-method="filterHistory"
      />
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import {
  roomTableHeaders,
  roomTableColumns,
  historyTableHeaders,
} from '../tables/roomList.table';
import { ResRoomList } from '../models/responseRoomList.model';
import { filterRoomList, filterHistory } from '../utils/filterTables.utils';

interface State {
  isFetching: boolean;
  tableRooms: ResRoomList[];
  tableArrival: ResRoomList[];
  tableHistory: ResRoomList[];
  guestNumber: number | null;
}

export default defineComponent({
  props: {
    filterRooms: { type: Object, default: null },
    selectedRoom: { type: Object, default: null },
  },
  setup(_, { emit, root: { $api } }) {
    const state = reactive<any>({
      isFetching: true,
      tableRooms: [],
      tableArrival: [],
      tableHistory: [],
      guestNumber: {},
    });
    const iconHeader = ref<any>(null);
    let ciDate = '';

    async function fetchColumns() {
      const roomPayload = {
        casetype: 1,
        pvILanguage: '1',
        currDate: '2019-01-14',
        progName: 'hk-roomlist',
      };

      const arrivalPayload = {
        casetype: 2,
        pvILanguage: '1',
        currDate: '2019-01-14',
        progName: 'hk-roomlist',
      };

      const [[, resRoom], [, resArrival]] = await Promise.all([
        $api.housekeeping.getRoomingList(roomPayload),
        $api.housekeeping.getRoomingList(arrivalPayload),
      ]);

      if (resRoom) {
        state.tableRooms = roomTableColumns(resRoom.outputList['output-list']);
        state.tableHistory = resRoom.tHistory['t-history'];
        ciDate = resRoom.ciDate;
      }

      if (resArrival) {
        state.tableArrival = roomTableColumns(
          resArrival.outputList['output-list']
        );
      }

      state.isFetching = false;
    }

    function onClickRow(room) {
      state.guestNumber = room;
      emit('update:selectedRoom', room);
    }

    function getDefaultColumns(cols) {
      return cols.filter(
        (col) => !['icons', 'roomNumber', 'guestName'].includes(col.name)
      );
    }

    fetchColumns();

    return {
      ...toRefs(state),
      roomTableHeaders,
      historyTableHeaders,
      onClickRow,
      getDefaultColumns,
      iconHeader,
      filterMain: filterRoomList(ciDate),
      filterHistory: filterHistory,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.table-rooming-list {
  max-height: 50vh;

  thead tr th {
    position: sticky;
    z-index: 3;
  }

  thead tr:first-child th {
    top: 0;
  }

  thead tr:last-child th {
    top: 28px;
  }

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}

.table-history-list {
  max-height: 40vh;
}
</style>
