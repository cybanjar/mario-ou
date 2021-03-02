<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput v-if="group == '1'" label-text="Supplier" v-model="inputan" unmasked-value />
        <SDateInput v-else label-text="Order Date" v-model="datadate" unmasked-value />
        <SInput label-text="Po-Number" v-model="inputan" unmasked-value />
        <div id="radio">
          <q-option-group
            size="xs"
            v-model="group"
            :options="options"
            color="primary"
          />
        </div>
        <q-btn
          block
          color="primary"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
          size="sm"
        />
      </q-form>
    </div>

    <q-separator style="border-width: 1px;" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
export default defineComponent({
  props: {},
  setup(_, { emit }) {
    const state = reactive({
      inputan: ref(null),
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
    const onSearch = () => {
      emit('onSearch');
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
