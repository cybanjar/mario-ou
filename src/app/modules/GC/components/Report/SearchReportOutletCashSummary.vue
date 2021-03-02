<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
        <DateInput
          label-text="Select Date"
          v-model="search.date"
        />
        <!-- <SSelect           
          multiple
          use-chips
          stack-label 
          :options="search.createdId" 
          v-model="cretedid" 
          label-text="Created ID"
          @click="createList"
        /> -->
        <SSelect           
          multiple
          use-chips
          stack-label 
          :options="search.createdId" 
          v-model="cretedid" 
          label-text="Created ID"
        />
        <SSelect :options="search.departement" v-model="deptnum" label-text="Department Number"/>
        <SSelect :options="search.oprtions" v-model="shift" label-text="Shift"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox3"
          label="All Department"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox1"
          label="All Cashier"/>
        <q-checkbox 
          style="marginLeft: -8px" 
          size="xs" 
          v-model="checbox2"
          label="Display Summary Only"/>
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
    <q-separator style="border-width: 1px" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import DateInput from '~/app/modules/FR/components/common/DateInput.vue';

export default defineComponent({
  components: {
    DateInput,
  },

  props: {
    search: {} as any,
  },

  setup(_, {emit}){
      const state = reactive({
          cretedid: [],
          shift: null,
          deptnum: '',
          checbox1: false,
          checbox2: false,
          checbox3: false,
          date: new Date,
      })

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

      // const createList = () => {
      //   console.log('BLAH', state.cretedid);
      // }

      return {
          ...toRefs(state),
          onSearch,
          // createList,
      }
  },
})
</script>