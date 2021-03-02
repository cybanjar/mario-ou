<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        :label-text="getLabel('from_store', 'titleCase')"
        :options="searches.store"
        v-model="fromStore"
        dense
      />
      <SSelect 
        :label-text="getLabel('to_store', 'titleCase')"
        :options="searches.store" 
        v-model="toStore" 
        dense 
      />

      <SSelect
        :label-text="getLabel('main_group', 'titleCase')"
        :options="searches.maingrp"
        v-model="mainGrp"
        dense
      />

      <div id="checkbox">
        <q-checkbox dense v-model="zero" :label="getLabel('incl_zero_oh', 'titleCase')" />
        <q-checkbox dense v-model="global" :label="getLabel('global_oh', 'titleCase')" />
      </div>

      <div id="radio">
        <q-radio size="xs" v-model="sortBy" val="1" :label="getLabel('by_article_number', 'sentenceCase')" />
        <q-radio size="xs" v-model="sortBy" val="2" :label="getLabel('by_description', 'sentenceCase')" />
      </div>
      <q-btn
        dense
        color="primary"
        icon="mdi-magnify"
        :label="getLabel('search', 'titleCase')"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { setupCalendar, DatePicker } from 'v-calendar';
import { getLabels } from '~/app/helpers/getLabels.helpers';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  props: {
    searches: { type: Object, required: true },
  },

  setup(_, { emit }) {
    const state = reactive({
      fromStore: null,
      toStore: null,
      mainGrp: null,
      zero: false,
      global: false,
      sortBy: '1',
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    const getLabel = (key: string, opts: string) => {
      return getLabels(key, opts)
    };

    return {
      ...toRefs(state),
      onSearch,
      getLabel,
    };
  },
});
</script>

<style lang="scss" scoped></style>
