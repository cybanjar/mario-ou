<template>
  <q-dialog v-model="modal.active" persistent>
    <q-card style="min-width: 350px; height: auto">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Edit Event
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="q-pt-none scroll" style="max-height: 50vh">
        <div class="row q-gutter-md">
          <div class="col">
            <SInput label-text="Event Name" v-model="name" />
          </div>
          <div class="col">
            <SInput label-text="pax" v-model="pax" />
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <SDateInput
              placeholder="Select Date"
              v-model="fdate"
              label-text="From Date"
            />
          </div>
          <div class="col">
            <SInput
              v-for="items in sinput.filter((x) =>
                ['Start Time'].includes(x.label)
              )"
              v-model="items.value"
              :label-text="items.label"
              :style="{ width: '150px', marginRight: items.right }"
              type="time"
            />
          </div>
          <div class="col">
            <SInput label-text="Min. Guaranteed" v-model="min" />
          </div>
        </div>

        <div class="row q-gutter-md">
          <div class="col">
            <SDateInput
              placeholder="Select Date"
              v-model="tdate"
              label-text="To Date"
            />
          </div>
          <div class="col">
            <span>End Time</span>
            <q-input filled dense v-model="time" mask="time" :rules="['time']">
              <template #append>
                <q-icon name="mdi-access-time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="time">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col">
            <SInput label-text="Actual" v-model="actual" />
          </div>
        </div>
        <SInputMoney
          label-text="Amount"
          v-model.number="amount"
          hide-bottom-space
        ></SInputMoney>

        <div class="row q-gutter-md">
          <div class="col">
            <SSelect label-text="Venue" :options="opvenue" />
          </div>

          <div class="col">
            <SInput label-text="Max Pax" v-model="max" />
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <SSelect label-text="Set up" :options="opvenue" />
          </div>

          <div class="col">
            <SInput label-text="Preparation" v-model="preparation" />
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <SInput label-text="Size" v-model="size" />
          </div>

          <div class="col">
            <SInput label-text="Extention" v-model="extention" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
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
import { tableHeaders } from '../tables/Event.table';
import { date } from 'quasar';
import { sinput } from '../utils/SalesActivity';

export default defineComponent({
  props: {
    modal: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      sinput: sinput,
      opvenue: [
        { value: 'ABC 1 ROOM', label: 'ABC 1 ROOM' },
        { value: 'ABC 2 ROOM', label: 'ABC 2 ROOM' },
      ],
      data: [],
      insert: {
        active: false,
      },
      time: '10:56',
      fdate: '',
      tdate: '',
      pax: 100,
      actual: 100,
      min: 0,
      max: 0,
      size: 0,
      preparation: 0,
      extention: 0,
      name: '',
      duit: 0,
      amount: 100000,
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
    });

    const insert = () => {
      state.insert.active = true;
    };
    onMounted(() => {
      state.data = [
        {
          fdatum: '27/05/2018',
          tdatum: '29/05/2018',
          description: 'Meeting',
          amount: '350000',
          venue: 'GIYANTI',
          setup: '',
          pax: '0',
          fttime: '',
          ttime: '',
          sortable: 'SU',
        },
      ];
    });

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
      range,
      insert,
      tableHeaders,
      ...toRefs(state),
    };
  },
  components: {
    // SearchEvent: () => import('./SearchEvent.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
