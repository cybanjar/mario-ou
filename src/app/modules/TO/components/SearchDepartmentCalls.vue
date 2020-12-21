<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <v-date-picker
        mode="range"
        v-model="date"
        :columns="2"
        :popover="{ visibility: 'click' }"
      >
        <SInput
          label-text="Date"
          slot-scope="{ inputProps }"
          placeholder="From - Until"
          readonly
          v-bind="inputProps"
          clearable
          @clear="date = null"
        />
      </v-date-picker>
      <SSelect
        label-text="Cost Center"
        :options="searches.departments"
        v-model="fromCostCenter"
      />
      <SSelect
        label-text="To"
        :options="searches.departments"
        v-model="toCostCenter"
      />

      <div id="radio">
        <q-radio size="xs" v-model="shape" val="0" label="Dept By Ext" />
        <q-radio size="xs" v-model="shape" val="1" label="Dept By User" />
      </div>

      <q-checkbox v-model="print" label="Print Summary" />

      <q-btn
        block
        size="sm"
        color="primary"
        max-height="10"
        style="height: 25px"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      date: {
        start: new Date(2019, 0, 1),
        end: new Date(2019, 0, 14)
      },
      fromCostCenter: ref(0),
      toCostCenter: ref(0),
      shape: ref(0),
      print: ref(false),
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    watch(() => state.fromCostCenter,
    (x) => {
      state.toCostCenter = x
    })

    return {
      ...toRefs(state),
      onSearch,
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>

<style lang="scss" scoped>
#input {
  width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#radio {
  margin-left: -9px;
}
</style>
