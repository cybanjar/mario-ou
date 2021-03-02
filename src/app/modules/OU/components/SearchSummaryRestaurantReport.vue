<template>
  <section class="mt-7">
    <div class="q-pa-md">

      <DateInput
        label-text="Date"
        v-model="date"
      />

      <q-btn
        unelevated
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
import DateInput from '~/app/modules/FR/components/common/DateInput.vue';

export default defineComponent({
  components: {
    DateInput,
  },

  props: {
    searches: { type: Object, required: true },
  },
  setup(_, { emit }) {
    const state = reactive({
      // userID: ref(null),
      date: ref(null),
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