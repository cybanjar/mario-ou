<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput label-text="Suppier" v-model="inputan" unmasked-value />
        <SInput label-text="Po-Number" v-model="poNumber" unmasked-value />
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
    const state = reactive({
      inputan: ref(''),
      poNumber: ref(''),
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

    watch(
      () => state.group,
      (val) => {
        if (val == '1') {
          state.label = 'Supplier';
          state.inputan = '';
        }
        if (val == '2') {
          state.label = 'Order Date';
          state.inputan = date.formatDate(props.orderDate.orderDate,'DD/MM/YYYY')
        }
      }
    );
    const onSearch = () => {
      emit('onSearch', {...state});
    };
    return {
      onSearch,
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
