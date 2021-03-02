<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="Main Group"
        :options="searches.departments"
        v-model="departments"
      />

      <SDateInput placeholder="Select Date" v-model="date" label-text="Date" />

      <div id="radio">
        <q-radio size="xs" v-model="shape" val="0" label="Quantity" />
        <q-radio size="xs" v-model="shape" val="1" label="Average Price" />
        <q-radio size="xs" v-model="shape" val="2" label="Amount" />
      </div>
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

export default defineComponent({
  props: {
    searches: {} as any,
  },

  setup(_, { emit }) {
    const state = reactive({
      date: '',
      departments: ref(null),
      shape: ref(null),
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    return {
      ...toRefs(state),
      onSearch,
    };
  },
  
});
</script>

<style lang="scss" scoped></style>
