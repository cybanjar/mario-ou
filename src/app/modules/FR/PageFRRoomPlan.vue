<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between q-mb-sm items-center">
      <SharedModuleActions />
      <div :class="isFetching && 'no-pointer-events disabled'">
        <label>Date</label>
        <div class="row items-center">
          <q-btn
            icon="mdi-chevron-left"
            flat
            round
            size="md"
            color="primary"
            @click="toPrevDate"
          >
            <q-tooltip anchor="top middle" self="center middle">
              <div class="text-center">
                Previous 28 Days<br />
                {{ date.formatDate(prevDate, 'DD/MM/YYYY') }}
              </div>
            </q-tooltip>
          </q-btn>
          <DateInput
            input-classes="q-mb-none"
            placement="auto"
            is-required
            v-model="currentDate"
          />
          <q-btn
            icon="mdi-chevron-right"
            flat
            round
            size="md"
            color="primary"
            @click="toNextDate"
          >
            <q-tooltip anchor="top middle" self="center middle">
              <div class="text-center">
                Next 28 Days<br />{{ date.formatDate(nextDate, 'DD/MM/YYYY') }}
              </div>
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <TableRoomPlan
      :is-fetching="isFetching"
      :data="data"
      :current-date="currentDate"
    />

    <DialogRoomChange
      :show.sync="dialogRoomChange.state.show"
      :key="dialogRoomChange.state.key"
      :reservation="dialogRoomChange.state.data"
      :ci-date="ciDate"
      @save="getData"
    />
  </q-page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  reactive,
  toRefs,
  watch,
} from '@vue/composition-api';
import { date } from 'quasar';
import DateInput from './components/common/DateInput.vue';
import { useDisposableDialog } from './composables/disposableDialog';
import {
  RoomPlan,
  roomPlanKey,
  RoomReservation,
} from './models/room-plan/roomPlan.model';

export default defineComponent({
  components: {
    DateInput,
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    TableRoomPlan: () => import('./components/room-plan/TableRoomPlan.vue'),
    DialogRoomChange: () =>
      import('./components/room-plan/DialogRoomChange.vue'),
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      currentDate: null as Date,
      ciDate: null as Date,
      data: null as RoomPlan,
    });

    const nextDate = computed(() =>
      date.addToDate(state.currentDate, { days: 28 })
    );
    function toNextDate() {
      state.currentDate = nextDate.value;
    }

    const prevDate = computed(() =>
      date.subtractFromDate(state.currentDate, { days: 28 })
    );
    function toPrevDate() {
      state.currentDate = prevDate.value;
    }

    $api.frontOfficeReception.prepareRoomPlan().then((data) => {
      state.isFetching = false;
      state.currentDate = new Date(data.currDate);
      state.ciDate = new Date(data.ciDate);
      state.data = {
        roomList: data.roomList,
        reservations: data.reservations,
        outOfOrders: data.outOfOrders,
      };
    });

    watch(
      () => state.currentDate,
      (_, oldValue) => {
        // To prevent double fetch because prepare data also trigger changes on currentDate
        if (!oldValue) return;

        getData();
      }
    );

    function getData() {
      state.isFetching = true;
      const currentDate = date.formatDate(state.currentDate, 'MM/DD/YY');
      const ciDate = date.formatDate(state.ciDate, 'MM/DD/YY');
      $api.frontOfficeReception.roomPlan(currentDate, ciDate).then((data) => {
        state.isFetching = false;
        state.data = data;
      });
    }

    /* Dialog setup */
    const dialogRoomChange = useDisposableDialog<
      RoomReservation['reservation']
    >(null);
    /* End Dialog setup */

    provide(roomPlanKey, {
      SHOW_DIALOG_ROOM_CHANGE: dialogRoomChange.open,
    });

    return {
      ...toRefs(state),
      date,
      nextDate,
      toNextDate,
      prevDate,
      toPrevDate,
      getData,
      dialogRoomChange,
    };
  },
});
</script>
