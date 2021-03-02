<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput v-if="group == '1'" label-text="Supplier" v-model="inputan" unmasked-value />
        <SDateInput v-else label-text="Order Date" v-model="datadate" unmasked-value />
        <SInput label-text="Po-Number" v-model="poNumber" unmasked-value />
        <div id="radio">
          <q-option-group
            size="xs"
            v-model="group"
            :options="options"
            color="primary"
            @input="onGroup"
          />
        </div>
        <q-btn
          size="sm"
          color="primary"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </q-form>
    </div>

    <q-separator style="border-width: 1px;" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  watch,
} from '@vue/composition-api';
import {date} from 'quasar'
export default defineComponent({
  props: {
    orderDate: {type:String, required: true} as any
    },
  setup(props, { emit }) {
    let datadatee = props.orderDate.orderDate
    const state = reactive({
      inputan: ref(''),
      poNumber: ref(''),
      datadate: '',
      label: '',
      group: '1',
      options: [
        {
          label: 'Supplier',
          value: '1',
        },
        {
          label: 'Order Date',
          value: '2',
        },
      ],
    });

    const onGroup = () => {
      if(state.group == '2'){
        state.datadate = datadatee
      } 
    }
    const onSearch = () => {
      emit('onSearch', {...state});
    };
    return {
      onSearch,
      onGroup,
      ...toRefs(state),
    };
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
