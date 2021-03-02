<template>
  <section class="mt-7">
    <div class="q-pa-md">
     
      <DateRangeInput
        label-text="Date"
        :position-fixed="true"
        v-model="date"
      />
      
      <q-btn-toggle
        v-model="sortType"
        spread
        no-caps
        toggle-color="primary"
        color="white"
        text-color="black"
        :options="[
        {label: 'Food', value: 1},
        {label: 'beverage', value: 2}
        ]"
      />

      <q-checkbox v-model="sortByDescription" label="Sort By Description" />
      <q-checkbox v-model="incBeverageFood" :label="sortType == 1 ? 'Include Beverage to Food' : 'Include Food to Beverage' " />

      <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';

export default defineComponent({
  components: {
    DateRangeInput,
  },

  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      date: {start: ref(new Date()), end: ref(new Date()) },
      sortType: ref(1),
      sortByDescription: ref(false),
      incBeverageFood : ref(false)
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
