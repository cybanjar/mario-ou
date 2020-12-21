<template>
  <section class="mt-7">
    <div class="q-pa-md">
        <v-date-picker mode="range" v-model="searches.date" :columns="2" :popover="{ visibility: 'click' }">
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="Select Date"
            readonly
            v-bind="inputProps"
            @clear="searches.date = null" />
        </v-date-picker>

        <SSelect
            label-text="Department"
            :options="searches.dept"
            v-model="searches.deptVal">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No data
                </q-item-section>
              </q-item>
            </template>
        </SSelect>

        <q-checkbox v-model="searches.checkSuppressComp" label="Suppress compliments VAT and service" />
        <q-checkbox v-model="searches.checkDiscToFood" label="Separate Discount to food Beverage and Other" />
        <q-checkbox v-model="searches.checkExcludeComp" label="Exclude Compliment" />

        <q-checkbox v-model="searches.showMultiCash" label="Show Multi Cash" />

        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="showDialog(searches, dataPrepare)"/>
    </div>

    <dialogDailySalesByUserSelectUser :show="show" :searches="searches" :dataPrepare="dataPrepare" @onDialog="onDialog" @assignDataTable="assignDataTable"/>

  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
    dataPrepare: {type: Object, required: true}
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive({
      show: false,
    });

    const assignDataTable = (state2) => {
      emit('assignDataTable', state2)
    }

    const onDialog = (val) => {
      state.show = val;
    };

    const showDialog = (searches, dataPrepare) => {
      onDialog(true);
    };

    return {
      ...toRefs(state),
      onDialog, 
      showDialog,
      assignDataTable,
    };
  },
  components: {
    'v-date-picker': DatePicker,
    dialogDailySalesByUserSelectUser: () => import('./DialogDailySalesByUserSelectUser.vue'),

  }
});
</script>

<style lang="scss" scoped></style>
