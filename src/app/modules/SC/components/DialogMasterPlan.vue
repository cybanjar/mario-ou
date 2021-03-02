<template>
  <q-dialog v-model="dialog.show" persistent>
    <DialogDeposit :modal="modal" />
    <DialogGrid :grid="grid" />

    <q-card style="min-width: 1100px; height: 480px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Master Plan BQ0000015
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="q-pt-none">
        <q-tabs
          v-model="tab"
          dense
          align="center"
          narrow-indicator
          class="q-mb-sm"
        >
          <q-tab name="Master" label="Master" />
          <q-tab name="Rooms" label="Rooms" />
          <q-tab name="Catering" label="Catering" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Master">
            <div class="row q-gutter-md">
              <div class="col-5">
                <SSelect label-text="Name" :options="options" />
              </div>
              <div class="col">
                <SSelect label-text="Status" :options="dialog.status" />
              </div>
              <div class="col">
                 <SInputMoney
                  label-text="Nights"
                  v-model.number="duit"
                  hide-bottom-space
                ></SInputMoney>
                <!-- <SSelect label-text="Sales ID" :options="options" /> -->
              </div>
              <div class="col">
                <SDateRange label-text="Date" :range.sync="range" />
              </div>
            </div>
            <div class="row q-gutter-md">
              <div style="width:20.0667%">
                <SSelect label-text="Source" :options="dialog.sources" />
                <!-- <SInputMoney
                  label-text="Nights"
                  v-model.number="duit"
                  hide-bottom-space
                ></SInputMoney> -->
              </div>
              <div style="width:20.0667%">
                <SSelect label-text="Market" :options="dialog.market" />
              </div>
              <div style="width:17.4667%">
                <SSelect label-text="Type" :options="dialog.type" />
              </div>
              <div style="width:17.4667%">
                <SSelect label-text="Sales ID" :options="dialog.sales" />
              </div>
            </div>
            <!-- <div class="row q-gutter-md">
              <div class="col">
                <SDateRange label-text="Date" :range.sync="range" />
              </div>
              <div class="col">
                <SSelect label-text="Source" :options="options" />
              </div>
            </div> -->
            <div class="row q-gutter-md">
              <div style="width:20%">
                <q-checkbox v-model="right" label="Events Only" />
              </div>
              <div class="col">
                <q-btn
                  @click="showDeposit"
                  unelevated
                  size="sm"
                  color="primary"
                  label="Deposit"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="Rooms">
            <div class="row q-gutter-md">
              <div class="col">
                <div class="row q-gutter-md">
                  <div class="col">
                    <SInput label-text="Block Code" v-model="input" />
                  </div>
                  <div class="col">
                    <SSelect label-text="Reservation Type" :options="dialog.rtype" />
                  </div>
                  <div class="col">
                    <SInputMoney
                      label-text="Total Room"
                      v-model.number="duit"
                      hide-bottom-space
                    ></SInputMoney>
                  </div>
                </div>
                <div class="row q-gutter-md">
                  <div class="col">
                    <SSelect label-text="Rate Code" :options="dialog.rcode" />
                  </div>
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Arrival Date"
                    />
                  </div>
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Departure Date"
                    />
                  </div>
                </div>
                <div class="row q-gutter-md">
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Cutt Off Date"
                    />
                  </div>
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Follow Up Date"
                    />
                  </div>
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Deposit Due"
                    />
                  </div>
                </div>
                <div class="row q-gutter-md">
                  <div class="col">
                    <SInput label-text="Trace Code" v-model="input" />
                  </div>
                  <div class="col">
                    <SInput label-text="Cutt of Days" v-model="input" />
                  </div>
                  <div class="col">
                    <SSelect label-text="Sales ID" :options="dialog.sales" />
                  </div>
                </div>
                <q-btn
                  @click="ModalGrid"
                  unelevated
                  size="md"
                  color="primary"
                  label="Reservation Detail"
                />
              </div>
              <div class="col">
                Rooms Revenue
                <STable
                  dense
                  :columns="roomsHeaders"
                  :data="data"
                  :rows-per-page-options="[0]"
                  :hide-bottom="false"
                  class="table-accounting-date"
                  flat
                  bordered
                ></STable>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="Catering">
            <div class="row q-gutter-md">
              <div class="col">
                <div class="row q-gutter-md">
                  <div class="col">
                    <SSelect label-text="Status" :options="dialog.cateringStatus" />
                  </div>
                  <div class="col">
                    <SInputMoney
                      label-text="Pax"
                      v-model.number="duit"
                      hide-bottom-space
                    ></SInputMoney>
                  </div>
                  <div class="col">
                    <span>Guaranted</span>
                    <br />
                    <q-checkbox v-model="right" />
                  </div>
                </div>
                <div class="row q-gutter-md">
                  <div class="col">
                    <SInput label-text="Info" v-model="input" />
                  </div>
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Cutt Off Date"
                    />
                  </div>
                  <div class="col">
                    <SDateInput
                      placeholder="Select Date"
                      v-model="date"
                      label-text="Deposit Date"
                    />
                  </div>
                </div>
                <div class="row q-gutter-md">
                  <div class="col">
                    <SInput label-text="Contact Number" v-model="input" />
                  </div>
                  <div class="col">
                    <SSelect label-text="Sales ID" :options="dialog.sales" />
                  </div>
                  <div class="col">
                    <SInputMoney
                      label-text="Amount / Pax"
                      v-model.number="duit"
                      hide-bottom-space
                    ></SInputMoney>
                  </div>
                </div>
                <SInputMoney
                  label-text="Total Amount"
                  v-model.number="duit"
                  hide-bottom-space
                ></SInputMoney>
              </div>
              <div class="col">
                Catering Revenue
                <STable
                  dense
                  :columns="cateringHeaders"
                  :data="data"
                  :rows-per-page-options="[0]"
                  :hide-bottom="false"
                  class="table-accounting-date"
                  flat
                  bordered
                ></STable>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions
        align="right"
        class="bg-white text-teal"
        style="position: absolute; right: 0; bottom: 0"
      >
        <q-btn
          unelevated
          size="sm"
          v-close-popup
          color="primary"
          outline
          label="Cancel"
        />
        <q-btn
          unelevated
          size="sm"
          color="primary"
          label="OK"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  onMounted,
  computed,
} from '@vue/composition-api';
import { date } from 'quasar';
import {
  roomsHeaders,
  cateringHeaders,
} from '../tables/Masterplandialog.table';

export default defineComponent({
  props: {
    dialog: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
      tab: 'Master',
      right: false,
      searchby: '',
      duit: 0,
      input: ref(null),
      modal: {
        active: false,
      },
      grid: {
        active: false,
      },
    });

    const onSave = () => {
      emit('onSave', { ...state });
    };

    const showDeposit = () => {
      state.modal.active = true;
    };

    const ModalGrid = () => {
      state.grid.active = true;
    };

    const range = computed({
      get: () => {
        const { startDate, endDate } = state.date;
        return {
          startDate,
          endDate,
          dateInput: `${startDate} - ${endDate}`,
        };
      },
      set: ({ startDate, endDate }) => {
        state.date.startDate = startDate;
        state.date.endDate = endDate;
      },
    });

    return {
      ...toRefs(state),
      onSave,
      roomsHeaders,
      cateringHeaders,
      showDeposit,
      ModalGrid,
      range,
    };
  },
  components: {
    DialogDeposit: () => import('./DialogDeposit.vue'),
    DialogGrid: () => import('./DialogGrid.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
