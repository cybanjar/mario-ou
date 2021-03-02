<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput :label-text="name" v-model="inputan" unmasked-value />
        <div id="radio">
          <q-option-group @input="optiongroup(group)" size="xs" v-model="group" :options="options" color="primary" />
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
import { getLabels } from '~/app/helpers/getLabels.helpers';
export default defineComponent({
  props: {},
  setup(_, { emit }) {
    const state = reactive({
      inputan: ref(null),
      group: '2',
      name: getLabel('recipe_name', 'titleCase'), 
      options: [
        {
          label: getLabel('recipe_number', 'titleCase'),
          value: '1',
        },
        {
          label: getLabel('recipe_name', 'titleCase'),
          value: '2',
        },
        {
          label: getLabel('category', 'titleCase'),
          value: '3',
        },
      ],
    });
    const onSearch = () => {
      emit('onSearch', {...state});
    };

    const optiongroup = (group) => {
      if (group == '1') {
        state.name = getLabel('recipe_number', 'titleCase')
      }
      if (group == '2') {
        state.name = getLabel('recipe_name', 'titleCase')
      }
      if (group == '3') {
        state.name = getLabel('category', 'titleCase')
      }
    }

    function getLabel(key: string, opts: string){
      return getLabels(key, opts)
    };

    return {
      onSearch,
      optiongroup,
      ...toRefs(state),
      getLabel,
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
