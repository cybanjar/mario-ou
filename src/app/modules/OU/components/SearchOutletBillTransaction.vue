<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <v-date-picker mode="range" v-model="searches.date" :columns="2" :popover="{ visibility: 'click' }">
        <SInput
          label-text="Date"
          slot-scope="{ inputProps }"
          placeholder="Select Date"
          readonly
          v-bind="inputProps"
          @clear="searches.date = null" />
      </v-date-picker>

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

      <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { watch } from 'fs';
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
  components: {
    'v-date-picker': DatePicker,
  }
});
</script>

<style lang="scss" scoped></style>
