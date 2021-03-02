<template>
  <div class="row q-gutter-md">
    <div class="col">
      <SDateRange label-text="Date" :range.sync="range" />
      <SSelect
        label-text="Arrangement"
        :options="searches.arrangement"
        :disable="!searches['active']"
      />
    </div>
    <div class="col">
      <SSelect
        label-text="Room Type"
        :options="searches.roomtype"
        :disable="!searches['active']"
      />
      <SInput label-text="Value" v-model="day" :disable="!searches['active']" />
    </div>
    <div class="col">
      <SInputMoney
        label-text="Quantity"
        v-model.number="duit"
        hide-bottom-space
        :disable="!searches['active']"
      ></SInputMoney>
      <span>Compliment</span>
      <br />
      <q-toggle
        v-model="value"
        color="primary"
        :disable="!searches['active']"
      />
      <q-btn
        style="marginLeft: 9rem"
        @click="onClickCancel"
        unelevated
        size="sm"
        color="primary"
        outline
        label="Cancel"
        :disable="!searches['active']"
      />
      <q-btn
        unelevated
        size="sm"
        color="primary"
        label="Save"
        :disable="!searches['active']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  computed,
} from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(props, { root: { $api } }) {
    const state = reactive({
      duit: 1000,
      date: {
        startDate: date.formatDate(new Date(), 'DD/MM/YY'),
        endDate: date.formatDate(new Date(), 'DD/MM/YY'),
      },
      value: false,
    });

    const onClickCancel = () => {
      props.searches.active = false;
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
      onClickCancel,
      range,
      ...toRefs(state),
    };
  },
});
</script>
