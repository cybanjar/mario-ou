<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SDateInput label-text="From Date" v-model="searches.fromDate" disable />
      <SDateInput label-text="To Date" v-model="searches.toDate" :disable="searches.disableData" />
      <SInput 
        label-text="Reference Number" 
        :options="searches.store" 
        v-model="searches.referenceNumber" 
        :disable="searches.disableData"/>
      <SInput 
        label-text="Description" 
        :options="searches.store" 
        v-model="searches.discription"
        :disable="searches.disableData" />
      <SSelect v-if="searches.dataKey == 'outgoing'" 
        label-text="Main Group" 
        :disable="searches.disableData"
        :options="searches.mainGroup" 
        v-model="searches.dataGroup" />
      <q-btn
        block
        color="primary"
        max-height="10"
        style="height: 25px"
        icon="mdi-magnify"
        size="sm"
        :label="searches.lebelSearch"
        class="q-mt-md full-width"
        :disable="searches.disableButton"
        @click="onSearch"
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
import { date } from 'quasar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(props, { emit }) {
    const onSearch = () => {
      emit('onSearch', { ...props });
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
