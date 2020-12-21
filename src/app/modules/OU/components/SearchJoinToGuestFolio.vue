<template>
  <section class="mt-7">
    <div class="q-pa-md">
        <SSelect
            label-text="Department"
            :options="searches.dept"
            v-model="dept">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No data
                  </q-item-section>
                </q-item>
              </template>
        </SSelect>

        <v-date-picker mode="range" v-model="date" :columns="2" :popover="{ visibility: 'click' }">
            <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="Select Date"
            readonly
            v-bind="inputProps"
            @clear="date = null" />
        </v-date-picker>

        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { watch } from 'fs';
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
      dept: ref(null),
      date: {start: ref(new Date()), end: ref(new Date())}
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
  }
});
</script>

<style lang="scss" scoped></style>
