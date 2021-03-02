<template>
  <section class="q-pa-md">
    <q-form @submit="onSearch">
      <div>
        <div class="inline-block q-mb-xs">Display</div>
        <q-btn-toggle
          v-model="display"
          spread
          class="toggle"
          no-caps
          unelevated
          toggle-color="primary"
          color="white"
          size="sm"
          text-color="primary"
          :options="[
            { label: 'Lost', value: 0 },
            { label: 'Found', value: 1 },
          ]"
        />
      </div>
      <q-separator class="q-my-md" />
      <div>
        <SInput label-text="Search" v-model="search" hide-bottom-space />
        <SDateRange :range.sync="dateRange" label-text="Date" />
        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </div>
    </q-form>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRaw,
  toRef,
  toRefs,
} from '@vue/composition-api';
import { date } from 'quasar';
import { useDateRange } from '~/app/shared/compositions/use-date-range.composition';

export default defineComponent({
  setup(props, { emit }) {
    const filter = reactive({
      display: 1,
      search: '',
      fromDate: date.formatDate(new Date(), 'DD/MM/YYYY'),
      toDate: date.formatDate(new Date(), 'DD/MM/YYYY'),
    });

    function onSearch() {
      emit('search', {
        ...toRaw(filter),
      });
    }

    return {
      ...toRefs(filter),
      ...useDateRange(toRef(filter, 'fromDate'), toRef(filter, 'toDate')),
      onSearch,
    };
  },
});
</script>
<style lang="scss" scoped>
.toggle {
  border: 1px solid #027be3;
}
</style>
