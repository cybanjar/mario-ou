<template>
  <section class="mt-7">
    <div class="q-pa-md">
      
      <SSelect
        label-text="Article Number"
        :options="searches.allArt"
        v-model="article"
      />
      <SSelect label-text="From Storage"  v-model="From" disabled/>
      <SSelect label-text="To Storage"  v-model="To" disabled/>
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
      article: ref(null),
      store: ref(null),
      From: ref('01'),
      To: ref('99'),
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
