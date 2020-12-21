<template>
  <div class="q-pa-md">
    <div v-if="!isPrefetch && isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="search" style="position: unset;">
        <SelectFilter
          label-text="From Article"
          :options="articleOptions"
          option-value="value"
          option-label="label"
          v-model="fromArt"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select from article']"
        />
        <SelectFilter
          label-text="To Article"
          :options="articleOptions"
          option-value="value"
          option-label="label"
          v-model="toArt"
          hide-bottom-space
          lazy-rules
          :rules="[]"
        />
        <SInput
          v-if="displayMain"
          label-text="Billing Name"
          v-model="billName"
        />
        <SDateInput label-text="Date" v-model="billDate" />
        <q-option-group
          :options="locationTypeOptions"
          type="radio"
          dense
          inline
          class="q-mb-md"
          v-model="locationType"
        />
        <template v-if="displayMain">
          <q-separator spaced />
          <q-checkbox v-model="showDetail" label="Show Detail" />
          <q-checkbox v-model="withBalance" label="With Balance" />
        </template>
        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
        <q-btn
          v-if="!displayMain"
          block
          @click="$emit('back-main')"
          color="primary"
          max-height="28"
          icon="mdi-arrow-left"
          label="Back To Main"
          class="q-mt-md full-width"
        />
      </q-form>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api';
import { loadArticleList } from '../shared/article-list.comp';
import { date } from 'quasar';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

enum FilterMode {
  Local = 0,
  Foreign = 1,
}

export default defineComponent({
  props: {
    balance: { type: Boolean, required: false, default: false },
    detail: { type: Boolean, required: false, default: false },
    displayMain: { type: Boolean, required: false, default: true },
  },
  setup(props, { root: { $api }, emit }) {
    const { articleOptions, isPrefetch } = loadArticleList(
      $api,
      '4',
      false,
      true
    );

    const now = new Date();
    const filter = reactive({
      fromArt: 22,
      toArt: 22,
      billName: '',
      billDate: now,
      locationType: FilterMode.Local,
      showDetail: props.detail,
      withBalance: props.balance,
      day1: 0,
      day2: 0,
      day3: 0,
    });

    const {
      data: { isLoading },
    } = usePrepare(
      true,
      () =>
        $api.accountReceivable.getPrepareARAging({
          fromArt: 1,
          toArt: 27,
        }),
      (tempData) => {
        filter.fromArt = tempData.fromArt;
        filter.toArt = tempData.toArt;
        filter.day1 = tempData.day1;
        filter.day2 = tempData.day2;
        filter.day3 = tempData.day3;

        search();
      }
    );

    watch(
      () => [filter.showDetail, filter.withBalance],
      ([showDetail, withBalance]) => {
        emit('filter', { showDetail, withBalance });
      }
    );

    function search() {
      const params = {
        pvILanguage: 1,
        caseType: 1,
        day1: filter.day1,
        day2: filter.day2,
        day3: filter.day3,
        disptype: filter.locationType,
        fdate: '',
        fromArt: filter.fromArt,
        fromName: 'a',
        miBill: true,
        mtdFlag: true,
        tdate: '',
        toArt: filter.toArt,
        toDate: date.formatDate(filter.billDate, 'MM/DD/YY'),
        toName: 'z',
      };
      emit('search', params);
    }
    const locationTypeOptions = [
      { value: FilterMode.Local, label: 'Local' },
      { value: FilterMode.Foreign, label: 'Foreign' },
    ];

    return {
      ...toRefs(filter),
      articleOptions,
      locationTypeOptions,
      isPrefetch,
      isLoading,
      search,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
