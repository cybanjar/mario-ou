<template>
  <STable
    class="table-rooming-list"
    :columns="roomTableHeaders"
    :data="tableRoom"
    :rows-per-page-options="[0]"
    :pagination.sync="pagination"
    hide-bottom
    row-key="zinr"
    :filter="filterRooms"
    :filter-method="filterTable"
  >
    <template #header="props">
      <q-tr :props="props">
        <q-th
          :props="props"
          key="articelNumber"
          rowspan="2"
          class="fixed-col right"
          style="z-index: 4;"
        >{{ props.colsMap.articelNumber.label }}</q-th>
        <q-th
          :props="props"
          key="guestName"
          rowspan="2"
          class="fixed-col right"
          style="z-index: 4;"
        >{{ props.colsMap.roomType.label }}</q-th>

        <q-th colspan="2">Mess</q-th>
        <q-th colspan="2">Delivery</q-th>
        <q-th colspan="3">Price</q-th>
        <q-th
          :props="props"
          key="guestName"
          rowspan="2"
          class="fixed-col right"
          style="z-index: 4;"
        >{{ props.colsMap.roomType.label }}</q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th
          v-for="col in getDefaultColumns(props.cols)"
          :key="col.name"
          :props="props"
        >{{ col.label }}</q-th>
      </q-tr>
    </template>

    <!-- <template #body="props">
      <q-tr
        :props="props"
        class="cursor-pointer"
        :class="{
          selected: selectedRoom && selectedRoom.zinr === props.key,
        }"
        @click="onClickRow(props.row)"
      >
        <q-td :props="props" key="icons" class="fixed-col left" style="padding-left: 8px;">
          <template v-if="props.row.statusIcons.length !== 0">
            <span v-for="statusIcon in props.row.statusIcons" :key="statusIcon.icon">
              <q-icon
                :name="statusIcon.icon"
                :class="`text-${statusIcon.color}`"
                style="font-size: 20px;"
              >
                <q-tooltip
                  anchor="bottom middle"
                  self="center middle"
                  style="font-size: 14px;"
                >{{ statusIcon.title }}</q-tooltip>
              </q-icon>
            </span>
          </template>
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
            >{{ props.row.bemerk }}</q-tooltip>
          </template>
          <template v-else>{{ props.row[col.field] }}</template>
        </q-td>
      </q-tr>
    </template>-->
  </STable>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { roomTableHeaders } from '../tables/stockItem.table';
import { ResRoomList } from '../../HK/models/responseRoomList.model';

export default defineComponent({
  props: {
    filterRooms: { type: Object, default: null },
    selectedRoom: { type: Object, default: null },
  },
  setup(_, { emit, root: { $api } }) {
    const state = reactive({
      isFetching: true,
      tableRoom: [],
      tableArrival: [],
    });
    const iconHeader = ref<any>(null);

    const filterTable = (rows) => rows;

    function onClickRow(room) {
      emit('update:selectedRoom', room);
    }

    function getDefaultColumns(cols) {
      return cols.filter((col) => col.name);
    }

    return {
      ...toRefs(state),
      roomTableHeaders,
      filterTable,
      onClickRow,
      getDefaultColumns,
      iconHeader,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.table-rooming-list {
  max-height: 75vh;

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
</style>
