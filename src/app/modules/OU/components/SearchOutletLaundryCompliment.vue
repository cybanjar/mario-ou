<template>
  <section class="mt-7">
    <div class="q-pa-md">
        <DateRangeInput
          label-text="Date"
          :position-fixed="true"
          v-model="searches.inputDate"
        />
        <q-radio v-model="searches.optionSortType" val='2' label="Cost Allocation" />
        <q-radio v-model="searches.optionSortType" val='3' label="Guest Name" />
        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, } from '@vue/composition-api';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';

export default defineComponent({
  components: {
    DateRangeInput,
  },

  props: {
    searches: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const state = reactive({
        inputDate: {start: new Date(), end: new Date()},
    });
    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    return {
      ...toRefs(props.searches),
      onSearch,
    };
  },
});
</script>

<style lang="scss" scoped></style>
