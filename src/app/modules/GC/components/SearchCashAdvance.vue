<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SSelect 
        v-for="i in use_input.filter(x => ![
        'Display'].includes(x.name))"
        :key="i.name"
        :options="i.options"
        :label-text="i.name" 
        @input="username(i)"
        v-model="i.value"/>
        <v-date-picker 
          :columns="2" 
          mode="range" 
          v-model="date"  
          :popover="{ visibility: 'click' }">
           <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            readonly
            v-bind="inputProps"
            clearable
            placeholder="From - Until"

        />
        </v-date-picker>
        <SSelect
        v-for="i in use_input.filter(x => [
        'Display'].includes(x.name))"
        :label-text="i.name"
        v-model="i.value"
        :options="i.options" 
        />
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox"
          label="Cheque/Giro Not Clear"/>
        <q-btn
          color="primary"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
          size="sm"
          @click="onSearch"
          unelevated
        />
    </div>
    <q-separator style="border-width: 1px;" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { DatePicker } from 'v-calendar';
import { Search } from '../Input/cash_advance'
export default defineComponent({
  setup(_, { emit }) {
    const state = reactive({
      from_name: '',
      use_input : Search,
      date: {
        start: new Date(2014, 0, 14),
        end: new Date()
      },
      checbox: false
    });


    const onSearch = () => {
      emit('onSearch', {...state});
    };

    const username = (e) => {
      Search[1].value = e.value.label
    }
    return {
      onSearch,
      username,
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
