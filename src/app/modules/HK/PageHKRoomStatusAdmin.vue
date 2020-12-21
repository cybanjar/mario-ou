<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchRoomStatusAdmin
        :selected-rooms="selectedRooms"
        @resetSelectedRooms="resetSelectedRooms"
        @onChangeFilter="onChangeFilter"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="tableColumns"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        hide-bottom
        selection="multiple"
        :selected.sync="selectedRooms"
        row-key="roomNumber"
        :filter="filterRoom"
        :filter-method="filterTable"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { tableHeaders, tableColumns } from './tables/roomStatus.table';

interface State {
  isFetching: boolean;
  selectedLabel: string;
  tableColumns: any[];
  selectedRooms: any[];
  filterRoom: {
    number: string;
    status: any;
  };
}

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      isFetching: true,
      selectedLabel: 'None',
      tableColumns: [],
      selectedRooms: [],
      filterRoom: {
        number: '',
        status: 'all',
      },
    });

    let rooms: any[] = [];

    const resetSelectedRooms = () => {
      state.selectedRooms = [];
    };

    const onChangeFilter = (filterRoom) => {
      state.filterRoom = filterRoom;
    };

    const filterTable = (rows, terms) =>
      rows.filter((row) => {
        const hasRoom = row.roomNumber.indexOf(terms.number) !== -1;
        const allStatus = !terms.status || terms.status === 'all';
        const hasStatus = terms.status === row.statusId;

        return hasRoom && (allStatus || hasStatus);
      });

    // Fetch columns
    (async () => {
      const res = await $api.housekeeping.getRoomStatus();
      rooms = tableColumns(res);
      state.tableColumns = rooms;
      state.isFetching = false;
    })();

    return {
      ...toRefs(state),
      resetSelectedRooms,
      tableHeaders,
      onChangeFilter,
      filterTable,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
  components: {
    SearchRoomStatusAdmin: () =>
      import('./components/SearchRoomStatusAdmin.vue'),
  },
});
</script>
