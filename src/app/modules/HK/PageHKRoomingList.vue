<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchRoomingList
        :selected-room="selectedRoom"
        @onFilterChange="onFilterChange"
      />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions @onActions="mapActions" />
      <HKRoomingListRoomTable
        :filter-rooms="filterRooms"
        :selected-room.sync="selectedRoom"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

interface State {
  filterRooms: any;
  selectedRoom: any;
}

export default defineComponent({
  setup() {
    const state = reactive<State>({
      filterRooms: {},
      selectedRoom: null,
    });

    function onChangeSelectedRoom(room) {
      state.selectedRoom = room;
    }

    function onFilterChange(filterRooms) {
      state.selectedRoom = null;
      state.filterRooms = filterRooms;
    }

    function mapActions(name) {
      switch (name) {
        case 'onRefresh':
          break;
        default:
          break;
      }
    }

    return {
      ...toRefs(state),
      onChangeSelectedRoom,
      onFilterChange,
      mapActions,
    };
  },
  components: {
    HKRoomingListRoomTable: () =>
      import('./components/HKRoomingListRoomTable.vue'),
    SearchRoomingList: () => import('./components/SearchRoomingList.vue'),
        SharedModuleActions: () =>
      import('../../shared/components/SharedModuleActions.vue'),
  },
});
</script>
