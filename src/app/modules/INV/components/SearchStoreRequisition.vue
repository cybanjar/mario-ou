<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <v-date-picker mode="range" v-model="date" :columns="2" :popover="{ visibility: 'click' }">
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
      label-text="From Department" 
      :options="searches.departments" 
      v-model="fromDept" />
      <SSelect 
      label-text="To Department" 
      :options="searches.departments" 
      v-model="toDept" />
      <SInput 
      label-text="Request Number" 
      v-model="ReqNumber" />
      <q-btn
        size="sm"
        color="primary"
        max-height="10"
        style="height: 25px"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        @click="onSearch"
        unelevated
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { date } from 'quasar';
import { log } from 'util';

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
        start: new Date(2019, 0, 14),
        end: new Date(2019, 0, 14)
      },
      fromDept: ref(null),
      toDept: ref(null),
      ReqNumber: ref(''),
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

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
