<template>
  <section class="mt-7">
    <div class="q-pa-md">
      
      <DateRangeInput
        label-text="Date"
        :position-fixed="true"
        v-model="searches.date"
      />

      <SSelect @input="onChange($options, true)" label-text="From Outlet" :options="searches.fromDept" v-model="searches.fromDeptVal" />
      <SSelect  @input="onChange($options, false)" label-text="To Outlet" :options="searches.toDept" v-model="searches.toDeptVal" />
      
      <SSelect
        label-text="Sorting By"
        v-model="searches.sortByVal"
        :options="[
          { label: 'By Description', value: 1 },
          { label: 'By Sold Quantity', value: 2 },
          { label: 'By Sold Amount', value: 3 },
        ]"
      />
      <q-btn-toggle
        unelevated
        rounded
        no-caps
        v-model="searches.sortType"
        spread
        toggle-color="primary"
        :options="[
          { label: 'Food', value: 1 },
          { label: 'Beverange', value: 2},
        ]"
      ></q-btn-toggle>

      <q-checkbox v-model="searches.byFactor" label="By Factor 1000" />
      
      <q-checkbox v-model="searches.detailed" label="Including Not Sold Items" />
      
      <q-checkbox v-model="searches.allSub" @input='onChangeAllSub()' :disable="searches.fromDeptVal.value != searches.toDeptVal.value" label="All Sub Group" />
      
      <q-list style="height: 200px" dense bordered class="scroll rounded-borders" >
        <q-item v-for="item in searches.filteredCategoryData" :key="item.position" :class="(item.selected)?'bg-cyan text-white':'bg-white text-black'"  :disabled="searches.flagListDisable">
          <span @click="!searches.flagListDisable ? onClickCategory(item) : null" >{{ item.bezeich }}</span> 
        </q-item>
      </q-list>
      <q-btn
        unelevated
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
import { defineComponent, ref, reactive, toRefs, computed } from '@vue/composition-api';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';

export default defineComponent({
  components: {
    DateRangeInput,
  },

  props: {
    searches: { type: Object, required: true },
  },
  setup(props, { emit }) {
    
    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    // const range = computed({
    //   get: () => {
    //     const { startDate, endDate } = props.searches.date;
    //     return {
    //       startDate,
    //       endDate,
    //       dateInput: `${startDate} - ${endDate}`,
    //     };
    //   },
    //   set: ({ startDate, endDate }) => {
    //     props.searches.date.startDate = startDate;
    //     props.searches.date.endDate = endDate;
    //   },
    // });

    const onChange = (data, isFromDept) => {
      const searchesValue = data.propsData.searches;
      const dept = JSON.parse(JSON.stringify(searchesValue.deptList));
      const fromDeptVal = searchesValue.fromDeptVal.value;
      const toDeptVal = searchesValue.toDeptVal.value;

      if (isFromDept) {
        data.propsData.searches.toDept = [] as any;

        for(let i = 0; i<dept.length; i++) {
          const num = dept[i]['value'];
          const datarow = dept[i];

          if (num >= fromDeptVal) {
            data.propsData.searches.toDept.push(datarow);
          }
        }
      } else {
        data.propsData.searches.fromDept = [] as any;

        for (let i = 0; i<dept.length; i++) {
          const num = dept[i]['value'];
          const datarow = dept[i];

          if (num <= toDeptVal) {
            data.propsData.searches.fromDept.push(datarow);
          }
        }
      }

      const allCat = props.searches.categoryData.slice();
      const newDataCat = [];
      props.searches.filteredCategoryData = [];
      for (let i = 0; i<allCat.length; i++) {
        const datarow = allCat[i];

        if (datarow['departement'] >= fromDeptVal && datarow['departement'] <= toDeptVal) {
          newDataCat.push(datarow);
        }
      }
      props.searches.filteredCategoryData = newDataCat;      
    }

    const onClickCategory = (item) => {
      console.log(item);
      const data = props.searches.filteredCategoryData.slice();
      props.searches.filteredCategoryData = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        
        if(item['position'] === element['position']) {
          element['selected'] = !element['selected'];
          break;
        }
      }  

      props.searches.filteredCategoryData = data;
    }

    const onChangeAllSub = () => {
      for (let index = 0; index < props.searches.filteredCategoryData.length; index++) {
        const element = props.searches.filteredCategoryData[index];
        element['selected'] = true;
      }

      if (props.searches.allSub) {
        props.searches.flagListDisable = true;
      } else {
        props.searches.flagListDisable = false;
      }
      
    }

    return {
      ...toRefs,
      onSearch,
      // range,
      onChange,
      onClickCategory,
      onChangeAllSub
    };
  },
});
</script>

<style lang="scss" scoped>
.padding-full{
  padding: 10px;
}
</style>