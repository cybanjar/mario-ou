<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <v-date-picker v-model="date" 
      :popover="{ visibility: group == '1'? null: 'click' }">
        <SInput
          label-text="From Date"
          slot-scope="{ inputProps }"
          readonly
          v-bind="inputProps"
          clearable
        />
      </v-date-picker>
      <SInput label-text="Delivery Note"/>
      <div id="radio">
        <q-option-group
          size="xs"
          v-model="group"
          :options="options"
          color="primary"
        />
      </div>
      <q-btn
        size="sm"
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
      />
      <q-separator style="border-width: 1px;" class="q-my-md" />

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
export default defineComponent({
  props: {},
  setup(_, { emit }) {
    const state = reactive({
      date: new Date(),
      inputan: '',
      group: '1',
      options: [
        {
          label: 'Today recieved',
          value: '1',
        },
        {
          label: 'Closed',
          value: '2',
        },
      ],
    });
    const onSearch = () => {
      emit('onSearch');
    };
    return {
      onSearch,
      ...toRefs(state),
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
