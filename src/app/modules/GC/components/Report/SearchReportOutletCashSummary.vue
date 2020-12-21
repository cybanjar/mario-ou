<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
        <v-date-picker 
          v-model="search.date"  
          :popover="{ visibility: 'click' }">
          <SInput
          label-text="Date"
          slot-scope="{ inputProps }"
          readonly
          v-bind="inputProps"
          clearable
          placeholder="Select Date"
        />
        </v-date-picker>
        <SSelect           
          multiple
          use-chips
          stack-label 
          :options="search.createdId" 
          v-model="cretedid" 
          label-text="Created ID"/>
        <SSelect :options="search.departement" v-model="deptnum" label-text="Department Number"/>
        <SSelect :options="search.oprtions" v-model="Shift" label-text="Shift"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox1"
          label="All User"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox2"
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
          deptnum: '',
          checbox1: false,
          checbox2: false
      })

      const onSearch = () => {
        emit('onSearch', {...state})
      }

      return {
          ...toRefs(state),
          onSearch
      }
  },
  components: {
    'v-date-picker': DatePicker,
  },
})
</script>