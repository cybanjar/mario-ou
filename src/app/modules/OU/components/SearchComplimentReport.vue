<template>
  <section class="mt-7">
    <div class="q-pa-md">
        <SSelect
            label-text="Display"
            :options="searches.displayList"
            v-model="searches.display"
            @input="onChangeDisplay($options)" />

        <SSelect
            label-text="Guest Name"
            :options="searches.gnameList"
            v-model="searches.gname"
            v-show="searches.display.value == 0 ? false : true" >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No data
                </q-item-section>
              </q-item>
            </template>
        </SSelect>

        <DateRangeInput
          label-text="Date"
          :position-fixed="true"
          v-model="searches.date"
        />

        <SSelect
            label-text="From Department"
            :options="searches.fromDept"
            v-model="searches.fromDeptVal"
            @input="onChangeDepartment($options, true)">
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
            @input="onChangeDepartment($options, false)">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No data
                </q-item-section>
              </q-item>
            </template>
        </SSelect>

        <q-checkbox v-model="searches.dispCheck" :disable="searches.optionSortType != 3 ? true : false" label="Show Ordered Item In Detail" />

        <q-radio v-model="searches.optionSortType" val='1' label="Outlets" />
        <q-radio v-model="searches.optionSortType" val='2' label="Cost Allocation" />
        <q-radio v-model="searches.optionSortType" val='3' label="Guest Name" />

        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch} from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';

export default defineComponent({
  components: {
    DateRangeInput,
  },

  props: {
    searches: { type: Object, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const onChangeDepartment = (input, isFromArt)=> {
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

    const onChangeDisplay = (input) => {
        const searchesValue = input.propsData.searches;

        if (searchesValue.display['value'] == 1) {
            async function asyncCall() {
                const [responseUser] = await Promise.all([
                    $api.outlet.getCommonOutletUserList('loadQueasy', {
                    caseType: 1,
                    qNo: 105, 
                }),
            ]);

            if (responseUser) {
              if (responseUser.outputOkFlag) {
                const userList = responseUser.tQueasy['t-queasy'];
                input.propsData.searches.gnameList = mapOU(userList, 'char1', 'char3');
                input.propsData.searches.gname = input.propsData.searches.gnameList[0];
              } else {
                // console.log("Failed");
              }
            }
          }
          asyncCall();
        }
    }

    const onSearch = () => {
      emit('onSearch', { ...props.searches });
    };

    return {
      ...toRefs,
      onSearch,
      onChangeDepartment,
      onChangeDisplay,
    };
  },
});
</script>

<style lang="scss" scoped></style>
