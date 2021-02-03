<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <!-- <SSelect label-text="User ID" :options="searches.userList" v-model="userID" /> -->

      <v-date-picker v-model="date" :columns="1" :popover="{ visibility: 'click' }">
        <SInput
          label-text="Billing Date"
          slot-scope="{ inputProps }"
          placeholder="From date"
          readonly
          v-bind="inputProps"
          @clear="date = null"
        />
      </v-date-picker>

      <q-btn
        unelevated
        dense
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { watch } from 'fs';
setupCalendar({
  firstDayOfWeek: 2,
});
export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },
  setup(_, { emit }) {
    const state = reactive({
      // userID: ref(null),
      date: ref(null),
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

<style lang="scss" scoped></style>