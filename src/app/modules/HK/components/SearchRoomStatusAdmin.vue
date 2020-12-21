<template>
  <section class="mt-7">
    <q-form @submit="onChangeRoom">
      <div class="q-pa-md">
        <SSelect
          label-text="Display"
          :options="displayStatuses"
          v-model="filterStatus"
        />

        <SInput
          v-model="filterNumber"
          label-text="Search"
          placeholder="Room Number"
          type="number"
        />
      </div>

      <template v-if="isCanChange">
        <q-separator />

        <div class="q-pa-md">
          <p class="q-mb-sm">
            Room Selected
          </p>

          <div class="flex items-center q-mb-md">
            <div class="room-selected col-grow q-pa-xs q-mr-sm">
              {{ roomSelectedLabel }}
            </div>

            <q-btn
              icon="mdi-undo"
              round
              color="primary"
              size="xs"
              @click="resetSelectedRooms"
            />
          </div>

          <SSelect
            label-text="Change Into"
            :options="roomStatuses"
            v-model="roomStatus"
          >
            <template v-if="!roomStatus" #selected>
              <span class="text-grey-6">Room Status</span>
            </template>
          </SSelect>

          <div>
            <q-btn
              dense
              color="primary"
              label="Change"
              type="submit"
              class="q-mt-md full-width"
              :loading="isUpdating"
              :disable="isUpdating || selectedRooms.length === 0"
            >
            </q-btn>
            <q-tooltip v-if="selectedRooms.length === 0">
              Please select at least 1 room
            </q-tooltip>
          </div>
        </div>
      </template>

      <q-separator />

      <div class="q-pa-md">
        <p>Queuing Rooms</p>
        <STable
          :loading="isFetching"
          :columns="queueHeaders"
          :data="queueData"
          hide-bottom
        />
      </div>
    </q-form>

    <DialogRoomStatusAdmin
      :dialog="dialog"
      @onDialog="onDialog"
      :room-status="roomStatus"
      :selected-rooms="selectedRooms"
      @resetSelectedRooms="resetSelectedRooms"
    />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
  watch,
} from '@vue/composition-api';
import { displayStatuses, roomStatuses } from '../models/roomStatus.model';
import { queueHeaders } from '../tables/roomStatus.table';

interface State {
  queueData: any[];
  roomStatus: any;
  isFetching: boolean;
  isUpdating: boolean;
  dialog: boolean;
}

interface WatchTypes {
  value: any;
}

export default defineComponent({
  props: {
    selectedRooms: { type: Array, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      queueData: [],
      roomStatus: null,
      isFetching: true,
      isUpdating: false,
      dialog: false,
    });
    const filterNumber = ref('');
    const filterStatus = ref<any>({ value: 'all', label: 'All' });

    const resetSelectedRooms = () => {
      emit('resetSelectedRooms');
    };

    const onChangeRoom = async () => {
      const roomStatus = state.roomStatus?.value;

      if ([4, 5].includes(roomStatus)) {
        state.dialog = true;
      } else {
        state.isUpdating = true;

        const body = {
          chgsort: roomStatus,
          // TODO investigate hardcoded and why this is a string
          pvILanguage: '1',
          // TODO investigate hardcoded
          userInit: 0,
          roomList: {
            'room-list': props.selectedRooms.map((room: any) => ({
              nr: room.roomNumber,
            })),
          },
        };
        await $api.housekeeping.changeRoomStatus(body);
        state.isUpdating = false;
        resetSelectedRooms();
      }
    };

    const isCanChange = computed(
      () => filterStatus.value && filterStatus.value.value !== 'all'
    );

    const roomSelectedLabel = computed(() => {
      switch (props.selectedRooms.length) {
        case 0:
          return 'None';
        case 1:
          return `${props.selectedRooms.length} room selected`;
        default:
          return `${props.selectedRooms.length} rooms selected`;
      }
    });

    const onDialog = (val) => {
      state.dialog = val;
    };

    watch<WatchTypes[]>(
      [filterStatus, filterNumber],
      ([roomStatus, roomNumber], [prevStatus]) => {
        if (!roomStatus || roomStatus?.value !== prevStatus?.value) {
          resetSelectedRooms();
        }

        emit('onChangeFilter', {
          status: roomStatus?.value,
          number: roomNumber,
        });
      }
    );

    // Fetch queue room list
    (async () => {
      const [, res] = await $api.housekeeping.getOverview();

      if (res) {
        state.queueData = res.queueRoomList['queue-room-list'];
      }

      state.isFetching = false;
    })();

    return {
      ...toRefs(state),
      filterNumber,
      filterStatus,
      isCanChange,
      onChangeRoom,
      displayStatuses,
      queueHeaders,
      roomStatuses,
      roomSelectedLabel,
      resetSelectedRooms,
      onDialog,
    };
  },
  components: {
    DialogRoomStatusAdmin: () => import('./DialogRoomStatusAdmin.vue'),
  },
});
</script>

<style lang="scss" scoped>
.room-selected {
  overflow-x: scroll;
  color: #2887d2;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
