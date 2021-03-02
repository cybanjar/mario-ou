<template>
  <section class="mt-7">
    <div class="q-pa-md">

      <DateRangeInput
        label-text="Date"
        :position-fixed="true"
        v-model="searches.date"
      />

      <SSelect
        label-text="From Department"
        :options="searches.fromDept"
        v-model="searches.fromDeptVal"
        @input="onChange($options, true)">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                No data
              </q-item-section>
            </q-item>
          </template>
      </SSelect>

      <SSelect
        label-text="To Department"
        :options="searches.toDept"
        v-model="searches.toDeptVal"
        @input="onChange($options, false)">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                No data
              </q-item-section>
            </q-item>
          </template>
      </SSelect>

      <SSelect
        label-text="Category"
        :options="searches.categoryList"
        v-model="searches.categoryValue">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                No data
              </q-item-section>
            </q-item>
          </template>
      </SSelect>

      <q-checkbox v-model="searches.checkDetailOutletSalesOnly" label="Outlet Sales Only" />
      <q-checkbox v-model="searches.checkMiCompli" label="Quantity Include All Inclusive" :disable="!searches.checkDetailOutletSalesOnly"/>

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

  setup(props, { emit }) {

    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    const onChange = (input, isFromArt)=> {
      const searchesValue = input.propsData.searches;
      const dept = JSON.parse(JSON.stringify(searchesValue.deptList));
      const fromDeptVal = searchesValue.fromDeptVal.value;
      const toDeptVal = searchesValue.toDeptVal.value;

      if (isFromArt) {
        input.propsData.searches.toDept = [] as any;

        for(let i = 0; i<dept.length; i++) {
          const num = dept[i]['value'];
          const datarow = dept[i];

          if (num >= fromDeptVal) {
            input.propsData.searches.toDept.push(datarow);
          }
        }
      } else {
        input.propsData.searches.fromDept = [] as any;

        for (let i = 0; i<dept.length; i++) {
          const num = dept[i]['value'];
          const datarow = dept[i];

          if (num <= toDeptVal) {
            input.propsData.searches.fromDept.push(datarow);
          }
        }
      }
    }

    return {
      ...toRefs,
      onSearch,
      onChange,
    };
  },
});
</script>

<style lang="scss" scoped></style>
