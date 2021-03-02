<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect :label-text="getLabel('main_group', 'titleCase')" :options="searches.departments" v-model="departments" />

      <SSelect :label-text="getLabel('store_number', 'titleCase')" :options="searches.store" v-model="store" />
     
      <SInput :label-text="getLabel('days', 'titleCase')" v-model="day" />
      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        :label="getLabel('search', 'titleCase')"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { getLabels } from '~/app/helpers/getLabels.helpers';

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      store: ref(null),
      departments: ref(null),
      day: ref(null),
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    const getLabel = (key: string, opts: string) => {
      return getLabels(key, opts)
    };

    return {
      ...toRefs(state),
      onSearch,
      getLabel,
    };
  },
});
</script>

<style lang="scss" scoped></style>
