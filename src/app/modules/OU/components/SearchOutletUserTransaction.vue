<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="User ID"
        :options="searches.userList"
        v-model="userID">
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

      <q-checkbox v-model="showAllUser" label="Show as Summary by Article" />

      <q-btn dense color="primary" icon="mdi-magnify" label="Search" class="q-mt-md full-width" @click="onSearch"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';
import { watch } from 'fs';

export default defineComponent({
  components: {
    DateRangeInput,
  },

  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    
    const state = reactive({
      userID: ref(null),
      date: {start: ref(new Date()), end: ref(new Date())},
      showAllUser: ref(false)
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
