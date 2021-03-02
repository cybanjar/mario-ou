<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SSelect
        v-for="i in use_input.filter((x) => !['Display'].includes(x.name))"
        :key="i.name"
        :options="i.options"
        :label-text="i.name"
        @input="username(i)"
        v-model="i.value"
      />

      <DateRangeInput
        label-text="Date"
        :position-fixed="true"
        v-model="date"
      />

      <SSelect
        v-for="i in use_input.filter((x) => ['Display'].includes(x.name))"
        :label-text="i.name"
        v-model="i.value"
        :options="i.options"
        :key="i.name"
      />
      <q-checkbox
        style="marginleft: -8px"
        size="xs"
        v-model="checbox"
        label="Cheque/Giro Not Clear"
      />
      <q-btn
        color="primary"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        size="sm"
        @click="onSearch"
        unelevated
      />
    </div>
    <q-separator style="border-width: 1px" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed } from '@vue/composition-api';
import DateRangeInput from '~/app/modules/FR/components/common/DateRangeInput.vue';
import { Search } from '../Input/cash_advance';
import { date } from "quasar";

export default defineComponent({
  components: {
    DateRangeInput,
  },

  setup(_, { emit }) {
    const state = reactive({
      from_name: '',
      use_input: Search,
      date: {start: new Date(), end: new Date()},
      checbox: false,
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    const username = (e) => {
      Search[1].value = e.value.label;
    };

    return {
      onSearch,
      username,
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
#input {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#radio {
  margin-left: -9px;
}
</style>
