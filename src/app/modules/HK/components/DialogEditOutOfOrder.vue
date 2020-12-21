<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 510px; overflow: visible;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          {{ roomDetails.headerTitle }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section v-if="selectedRoom">
        <div class="row q-col-gutter-lg items-center">
          <div class="col-4 text-right">Room</div>

          <div class="col-8">
            <SInput disable :value="selectedRoom.zinr" input-classes="" />
          </div>
          <template v-if="isOutOfMarket">
            <div class="col-4 text-right">Reservation</div>

            <div class="col-8">
              <SInput
                disable
                :value="selectedRoom.betriebsnr"
                input-classes=""
              />
            </div>
          </template>

          <div class="col-4 text-right">
            <p>{{ roomDetails.dateLabel }} From</p>
          </div>

          <div class="col-8">
            <v-date-picker
              mode="range"
              v-model="date"
              :columns="2"
              :popover="{ visibility: 'click' }"
              :min-date="new Date()"
              :masks="{
                input: ['DD MMM YYYY'],
              }"
            >
              <SInput
                slot-scope="{ inputProps, inputEvents }"
                placeholder="From - Until"
                readonly
                v-bind="inputProps"
                v-on="inputEvents"
                input-classes=""
                error-message="Out of Service must be completed on the same day"
                :error="invalidOutOfService"
              >
                <template v-slot:append>
                  <q-icon v-if="!invalidOutOfService" name="mdi-event" />
                  <q-icon
                    name="mdi-cancel"
                    class="cursor-pointer"
                    @click="date = null"
                  />
                </template>
              </SInput>
            </v-date-picker>
          </div>

          <template v-if="!isOutOfMarket">
            <div class="col-4 text-right">Department</div>

            <div class="col-8">
              <SSelect
                v-model="dept"
                :options="departments"
                input-classes=""
                :clearable="false"
              />
            </div>

            <div class="col-4 text-right">Out Of Service</div>

            <div class="col-8">
              <q-checkbox dense v-model="serviceFlag" />
            </div>
          </template>

          <div class="col-4 text-right self-start">Reason</div>

          <div class="col-8">
            <SInput v-model="reason" type="textarea" rows="4" input-classes />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-lg">
        <q-btn
          dense
          outline
          color="primary"
          label="Cancel"
          @click="onCancel"
          class="q-mr-sm"
        />

        <q-btn
          dense
          color="primary"
          label="Save"
          @click="onUpdateRoom"
          :loading="isUpdating"
          :disable="isUpdating || invalidOutOfService"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  // ref,
  watch,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';

setupCalendar({
  firstDayOfWeek: 2,
});

interface State {
  isUpdating: boolean;
  date: {
    start: Date;
    end: Date;
  };
  dept: any;
  reason: string;
  serviceFlag: boolean;
}

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    selectedRoom: { type: Object, default: null },
  },
  setup(props, { emit, root }) {
    const departments = [
      { value: 0, label: 'Housekeeping' },
      { value: 1, label: 'Engineering' },
    ];

    const state = reactive<State>({
      isUpdating: false,
      date: {
        start: new Date(),
        end: new Date(),
      },
      dept: departments[0],
      reason: '',
      serviceFlag: false,
    });

    // watch selected room changes
    watch(
      () => props.selectedRoom,
      (selectedRoom) => {
        if (selectedRoom) {
          state.date.start = new Date(selectedRoom.gespstart);
          state.date.end = new Date(selectedRoom.gespende);
          state.dept = departments[selectedRoom.ind - 1];
          state.serviceFlag = selectedRoom.ind === 5;
          state.reason = selectedRoom.gespgrund;
        }
      }
    );

    const isOutOfMarket = computed(() => props.selectedRoom?.ind === 3);

    const roomDetails = computed(() => {
      let headerTitle = 'Out-Of-Order';
      let dateLabel = 'O-O-O';

      if (isOutOfMarket.value) {
        headerTitle = 'Off-Market';
        dateLabel = 'O-M';
      }

      return {
        headerTitle: `Update ${headerTitle} Room`,
        dateLabel,
      };
    });

    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('update:dialog', val);
      },
    });

    const onCancel = () => {
      state.isUpdating = false;
      dialogModel.value = false;
    };

    const onUpdateRoom = async () => {
      let notifyPayload = {
        type: 'positive',
        message: 'Updated successfully',
      };

      state.isUpdating = true;
      const [err] = await root.$api.housekeeping.updateOOOandOM({
        ...props.selectedRoom,
        fromDate: state.date.start,
        toDate: state.date.end,
        serviceFlag: state.serviceFlag,
        dept: state.dept,
        reason: state.reason,
      });

      state.isUpdating = false;

      if (err) {
        notifyPayload = {
          type: 'negative',
          message: 'Failed to update',
        };
      } else {
        dialogModel.value = false;
        emit('onUpdate');
      }

      root.$q.notify(notifyPayload);
    };

    const invalidOutOfService = computed(
      () =>
        !state.date ||
        (state.serviceFlag &&
          state.date.start.valueOf() !== state.date.end.valueOf())
    );

    return {
      ...toRefs(state),
      dialogModel,
      onCancel,
      onUpdateRoom,
      isOutOfMarket,
      roomDetails,
      departments,
      invalidOutOfService,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
