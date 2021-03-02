<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect label-text="Store Number" :options="searches.store" v-model="store" />

      <SSelect label-text="Main Group" :options="searches.departments" v-model="departments" />

      <div id="radio">
        <q-radio size="xs" v-model="shape" val="1" label="Article Number" />
        <q-radio size="xs" v-model="shape" val="2" label="Description" />
        <q-radio size="xs" v-model="shape" val="3" label="Sub Group" />
      </div>
      <q-btn
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
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      store: ref(null),
      departments: ref(null),
      shape: ref(null),
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>

<style lang="scss" scoped></style>
