<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 520px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          {{ roomDetails.headerTitle }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row q-col-gutter-lg items-center">
          <div class="col-4">Room Number</div>

          <div class="col-8">
            <span class="text-orange text-weight-medium">
              {{ roomDetails.roomNumbers }}
            </span>
          </div>

          <template v-if="isOutOfMarket">
            <div class="col-4">Reservation Number</div>

            <div class="col-8">
              <span class="text-orange text-weight-medium">0</span>
            </div>
          </template>

          <div class="col-4">{{ roomDetails.dateLabel }} From</div>

          <div class="col-8">
            <SInput
              v-model="fromDate"
              mask="##/##/####"
              input-classes=""
              hide-bottom-space
              @click="$refs.fromDatePicker.show()"
            >
              <template v-slot:append>
                <q-icon name="mdi-event" class="cursor-pointer">
                  <q-popup-proxy ref="fromDatePicker">
                    <q-date
                      v-model="fromDate"
                      @input="() => $refs.fromDatePicker.hide()"
                      mask="DD/MM/YYYYYY"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </SInput>
          </div>

          <div class="col-4">{{ roomDetails.dateLabel }} To</div>

          <div class="col-8">
            <SInput
              v-model="toDate"
              mask="##/##/####"
              input-classes=""
              hide-bottom-space
              @click="$refs.toDatePicker.show()"
            >
              <template v-slot:append>
                <q-icon name="mdi-event" class="cursor-pointer">
                  <q-popup-proxy ref="toDatePicker">
                    <q-date
                      v-model="toDate"
                      @input="() => $refs.toDatePicker.hide()"
                      mask="DD/MM/YYYYYY"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </SInput>
          </div>

          <div class="offset-4 col-8">
            <q-checkbox
              dense
              v-model="serviceFlag"
              :label="roomDetails.serviceLabel"
            />
          </div>

          <template v-if="!isOutOfMarket">
            <div class="col-4">Department</div>

            <div class="col-8">
              <SSelect v-model="dept" :options="departments" input-classes="">
                <template v-if="!dept" #selected>
                  <span class="text-grey-6">Please Select</span>
                </template>
              </SSelect>
            </div>
          </template>

          <div class="col-4">Reason</div>

          <div class="col-8">
            <SInput v-model="reason" input-classes="" />
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
          @click="onCloseDialog"
          class="q-mr-sm"
        />

        <q-btn
          dense
          color="primary"
          label="OK"
          @click="onChangeStatus"
          :loading="isUpdating"
          :disable="isUpdating"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { date } from 'quasar';

interface State {
  isUpdating: boolean;
  fromDate: any;
  toDate: any;
  dept: any;
  reason: string;
  serviceFlag: boolean;
}

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    roomStatus: { type: Object, default: null },
    selectedRooms: { type: Array, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const today = date.formatDate(new Date(), 'DD/MM/YYYYYY');

    const departments = [
      { value: 1, label: 'Housekeeping' },
      { value: 2, label: 'Engineering' },
    ];

    const state = reactive<State>({
      isUpdating: false,
      fromDate: today,
      toDate: today,
      dept: { value: 1, label: 'Housekeeping' },
      reason: '',
      serviceFlag: false,
    });

    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialog', val);
      },
    });

    const isOutOfMarket = computed(() => props.roomStatus?.value === 5);

    const roomDetails = computed(() => {
      const { selectedRooms } = props;
      let headerTitle = 'Order';
      let dateLabel = 'O-O-O';
      let serviceLabel = 'Out Of Service';

      if (isOutOfMarket.value) {
        headerTitle = 'Market';
        dateLabel = 'Oo-M';
        serviceLabel = 'Without Reservation';
      }

      const roomNumbers = selectedRooms
        .map((room: any) => room.roomNumber)
        .join(', ');

      return {
        roomNumbers,
        headerTitle: `Out Of ${headerTitle}`,
        dateLabel,
        serviceLabel,
      };
    });

    const onCloseDialog = () => {
      state.isUpdating = false;
      state.fromDate = today;
      state.toDate = today;
      state.dept = null;
      state.reason = '';
      state.serviceFlag = false;
      emit('onDialog', false);
    };

    const onChangeStatus = async () => {
      state.isUpdating = true;
      let url = 'addOutOfOrderRooms';

      const body = {
        fromDate: state.fromDate,
        toDate: state.toDate,
        // TODO investigate hardcoded and why this is a number
        pvILanguage: 1,
        // TODO investigate hardcoded
        userInit: 0,
        reason: state.reason,
        serviceFlag: state.serviceFlag,
        roomList: {
          'room-list': props.selectedRooms.map((room: any) => ({
            nr: room.roomNumber,
          })),
        },
        dept: state.dept.value,
      };

      if (isOutOfMarket.value) {
        delete body.dept;
        url = 'addOffMarketRooms';
      }

      await $api.housekeeping[url](body);
      state.isUpdating = false;
      emit('resetSelectedRooms');
      onCloseDialog();
    };

    return {
      ...toRefs(state),
      onCloseDialog,
      dialogModel,
      onChangeStatus,
      isOutOfMarket,
      roomDetails,
      departments,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
