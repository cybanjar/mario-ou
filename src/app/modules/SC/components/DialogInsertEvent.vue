<template>
  <q-dialog v-model="insert.active" persistent>
    <q-card style="min-width: 350px; height: auto">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Insert Event
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="q-pt-none">
        <SInput label-text="Event Name" v-model="input" />
        <SDateRange label-text="Date" :range.sync="range" />
        <SInputMoney
          label-text="Amount"
          v-model.number="duit"
          hide-bottom-space
        ></SInputMoney>
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

export default defineComponent({
  props: {
    insert: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      data: [],
      insert: {
        active: false,
      },
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
      duit: 0,
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
