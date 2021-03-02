<template>
  <section class="mt-7">
    <div class="q-pa-md">
    
      <SSelect label-text="From Store" :options="searches.toStore" v-model="fromStore" />

      <SSelect label-text="To Store" :options="searches.fromStore" v-model="toStore" />

      <SSelect label-text="Main Group" :options="searches.departments" v-model="departments" />
     
      <div id="radio">
        <q-radio size="xs" v-model="shape" val="1" label="By Article Number" />
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

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      fromStore: ref(null),      
      toStore: ref(null),
      departments: ref(null),
      day: ref(null),
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
});
</script>

<style lang="scss" scoped></style>
