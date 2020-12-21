<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput label-text="Description" v-model="inputan" unmasked-value />
        <div id="radio">
          <q-option-group size="xs" v-model="group" :options="options" color="primary" />
        </div>
        <q-btn
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
      group: '2',
      options: [
        {
          label: 'Recipe Number',
          value: '1',
        },
        {
          label: 'Description',
          value: '2',
        },
        {
          label: 'Category',
          value: '3',
        },
      ],
    });
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
