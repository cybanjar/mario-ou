<template>
  <section class="mt-7">
    <div class="q-pa-md">
   <SDateInput
        placeholder="Select Date"
        v-model="date"
        label-text="Date"
      />

      <SSelect
        label-text="From Store Number"
        :options="searches.store"
        v-model="fromstore"
      />

      <SSelect
        label-text="To Store Number"
        :options="searches.store"
        v-model="tostore"
      />

      <SSelect
        label-text="Main Group"
        :options="searches.departments"
        v-model="departments"
      />

      <q-btn
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
import { DatePicker } from 'v-calendar';

export default defineComponent({
  props: {
    searches: {} as any,
  },

  setup(_, { emit }) {
    const state = reactive({
      date: '',
      fromstore: ref(null),
      tostore: ref(null),
      departments: ref(null),
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
