<template>
  <section class="mt-7">
    <template>
      <div class="q-pa-md">
          <SDateInput v-model="search.currDate['currDate']" label-text="Date"></SDateInput>
          <q-btn
            class="q-mt-md full-width"
            color="primary"
            style="height: 25px;"
            icon="mdi-magnify"
            size="sm"
            label="Search"
            unelevated
            @click="onSearch"
          />
      </div>

      <q-separator class="q-my-md" />

    </template>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
} from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
 props: {
     search: {} as any
 },
  setup(props, { emit, root: { $api } }) {
    const onSearch = () => {
      emit('onSearch', props['search']['currDate']);
    };

    return {
      onSearch,
    };
  },
});
</script>
