<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SDateInput placeholder="Select Date" v-model="date" label-text="Date" />

      <SSelect
        label-text="Store Number"
        :options="searches.store"
        v-model="store"
      />

      <SSelect
        label-text="From Main Group"
        :options="searches.departments"
        v-model="fromdepartments"
      />
      <SSelect
        label-text="To Main Group"
        :options="searches.departments"
        v-model="todepartments"
      />
      <div id="radio">
        <q-radio
          size="xs"
          v-model="shape"
          val="1"
          label="By Inventory Account"
        />
        <q-radio size="xs" v-model="shape" val="2" label="By Description" />
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
import { DatePicker } from 'v-calendar';

export default defineComponent({
  props: {
    searches: {} as any,
  },

  setup(_, { emit }) {
    const state = reactive({
      date: '2019/01/14',
      store: ref(null),
      fromdepartments: ref(null),
      todepartments: ref(null),
      shape: ref('1'),
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
