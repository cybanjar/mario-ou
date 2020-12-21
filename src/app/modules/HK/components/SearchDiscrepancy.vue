<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SInput v-model="search" label-text="Search" />

      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';

export default defineComponent({
  setup(props, { emit }) {
    const search = ref<string>('');

    watch(search, (searchVal) => {
      emit('onSearchChange', searchVal);
    });

    return {
      search,
    };
  },
});
</script>
