<template>
  <section class="mt-7">
    <template>
      <div class="q-pa-md">
        <q-form @submit="onSearch">
          <SDateInput v-model="date" label-text="Date"></SDateInput>
          <q-btn
            class="q-mt-md full-width"
            color="primary"
            style="height: 25px;"
            icon="mdi-magnify"
            size="sm"
            label="Search"
          />
        </q-form>
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
  setup(_, { emit, root: { $api } }) {
    const searches = reactive({
      date: new Date(),
      shape: false,
      reference: '',
    });


    const onSearch = () => {
      emit('onSearch', { date: searches.date, reference: searches.reference });
    };

    return {
      ...toRefs(searches),
      onSearch,
    };
  },
});
</script>
