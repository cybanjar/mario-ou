<template>
  <div class="row q-gutter-md">
    <SInput label-text="No" v-model="day" :disable="!searches.active" />
    <SSelect
      label-text="Market Group"
      :options="searches.option"
      v-model="type"
      style="width: 150px"
      :disable="!searches.active"
    />
    <SInput
      label-text="Market Code"
      v-model="day"
      :disable="!searches.active"
    />
    <SInput
      label-text="Description"
      v-model="day"
      :disable="!searches.active"
    />
    <div class="q-gutter-md" style="width: 375px; marginBottom: 10px">
      <q-btn
        block
        color="white"
        text-color="primary"
        max-height="10"
        label="Cancel"
        type="submit"
        style="height: 25px; width: 100px"
        size="sm"
        unelevated
        :disable="!searches.active"
      />
      <q-btn
        block
        color="primary"
        max-height="10"
        label="Save"
        type="submit"
        style="height: 25px; width: 100px"
        size="sm"
        unelevated
        :disable="!searches.active"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { use_input } from '../utils/DailyReportSetup';
export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      use_input: use_input,
      duit: 1000,
      type: '',
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
