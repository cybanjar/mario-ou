<template>
  <section class="mt-7">
    <div class="q-pa-md">
        <SSelect
            label-text="Department"
            :options="searches.dept"
            v-model="dept">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No data
                  </q-item-section>
                </q-item>
              </template>
        </SSelect>

        <DateRangeInput
          label-text="Date"
          :position-fixed="true"
          v-model="date"
        />


        <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from '@vue/composition-api';
import { watch } from 'fs';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';

export default defineComponent({
  components: {
    DateRangeInput,
  },

  props: {
    searches: { type: Object, required: true },
  },
  setup(_, { emit }) {
    const state = reactive({
      dept: ref(null),
      date: {start: ref(new Date()), end: ref(new Date())}
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
