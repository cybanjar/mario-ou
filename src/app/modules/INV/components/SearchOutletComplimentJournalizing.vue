<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SDateInput disable label-text="From Date" v-model="searches.fromDate"/>
      <SDateInput :disable="searches.disableButton" label-text="To Date" v-model="searches.toDate"/>
      <SInput 
      label-text="Refrence Number" 
      v-model="searches.refNum" 
      unmasked-value 
      :disable="searches.disableButton" />
      <SInput 
      label-text="Description" 
      v-model="searches.des"
      unmasked-value 
      :disable="searches.disableButton" />

      <q-btn
        block
        color="primary"
        max-height="10"
        style="height: 25px"
        icon="mdi-magnify"
        size="sm"
        :label="searches.search"
        class="q-mt-md full-width"
        @click="onSearch"
        unelevated
      />

      <q-separator style="border-width: 1px;" class="q-my-md" />

      <SRemarkLeftDrawer label="Total Debit" :value="searches.hasilDebit" />
      <SRemarkLeftDrawer label="Total Credit" :value="searches.hasilCredit" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(props, { emit }) {

    const onSearch = () => {
      emit('onSearch', props);
    };

    return {
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
