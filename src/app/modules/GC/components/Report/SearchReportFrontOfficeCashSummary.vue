<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
        <SSelect 
          :options="search.username" 
          v-model="cretedid" 
          multiple
          use-chips
          stack-label
          label-text="User Name"/>
        <v-date-picker 
          v-model="search.date"  
          :popover="{ visibility: 'click' }">
          <SInput
          label-text="Billing Date"
          slot-scope="{ inputProps }"
          readonly
          v-bind="inputProps"
          clearable
          placeholder="Select Date"
        />
        </v-date-picker>
        <SSelect :options="oprtions" v-model="Shift" label-text="Shift"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox1"
          label="All User"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox2"
          @input="Summary(checbox2)"
          label="Summary Cash Only"/>
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

export default defineComponent({
  props: {
    search: {} as any
  },
  setup(_, {emit}){
      const state = reactive({
          cretedid: [],
          Shift: '',
          checbox1: false,
          checbox2: false,
          oprtions : [
              {
                label: 'ALL',
                value: 0
              },
              {
                label: 'Morning',
                value: 1
              },
              {
                label: 'Noon',
                value: 2
              },
              {
                label: 'Dinner',
                value: 3
              },
              {
                label: 'Supper',
                value: 4
              },
          ]
      })

      const onSearch = () => {
        emit('onSearch', {...state})
      }

      const Summary = (e) => {
        emit('Summary', e)
      }

      return {
          ...toRefs(state),
          onSearch,
          Summary
      }
  },
  components: {
    'v-date-picker': DatePicker,
  },
})
</script>