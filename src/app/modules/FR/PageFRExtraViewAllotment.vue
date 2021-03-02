<template>
  <q-page>
    <SearchViewAllotment @search="onSearch" />

    <template v-if="allotments.length > 0">
      <div class="header q-pa-lg">
        <SharedModuleActions />
        <q-space />
        <div>
          <div class="text-right">
            <span>Dates</span>
            <span class="q-ml-lg text-weight-bold">
              {{ startDate }} - {{ endDate }}
            </span>
          </div>
          <div class="q-mt-md q-gutter-x-md text-right">
            <q-btn
              label="Previous"
              icon="mdi-chevron-left"
              dense
              size="14px"
              color="primary"
              :disable="page === 1"
              @click="page = 1"
            />
            <q-btn
              label="Next"
              icon-right="mdi-chevron-right"
              dense
              size="14px"
              color="primary"
              :disable="disableNext || page === 2"
              @click="page = 2"
            />
          </div>
        </div>
      </div>
      <div class="q-pa-lg q-gutter-y-xl">
        <AllotmentContent
          v-for="(allotment, idx) in allotments"
          :key="idx"
          :data="allotment"
          :search-data="searchData"
          :page="page"
        />
      </div>
    </template>

    <q-inner-loading :showing="isFetching" color="primary" style="z-index: 3" />
  </q-page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { date } from 'quasar';
import type { SearchViewAllotment } from './components/extra/view-allotment/SearchViewAllotment.vue';

function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
    SearchViewAllotment: () =>
      import('./components/extra/view-allotment/SearchViewAllotment.vue'),
    AllotmentContent: () =>
      import('./components/extra/view-allotment/AllotmentContent.vue'),
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      allotments: [] as Record<string, string>[],
      searchData: null as SearchViewAllotment,
      page: 1,
    });

    async function onSearch(searches: SearchViewAllotment) {
      state.page = 1;
      state.isFetching = true;

      const data = await $api.frontOfficeReception.viewAllotment({
        pvILanguage: 1,
        fromName: searches.name,
        toName: searches.name + 'z',
        fromDate: date.formatDate(searches.date.start, 'MM/DD/YY'),
        toDate: date.formatDate(searches.date.end, 'MM/DD/YY'),
        resFlag: searches.showReservation,
        gFlag: searches.showInHouse,
        cFlag: searches.showCancelled,
        detailFlag: searches.showDetail,
        currRmType: searches.roomType,
      });

      state.isFetching = false;
      state.searchData = searches;

      const allotments: Record<string, string>[] = [{}];
      let counter = 0;

      data.forEach((item) => {
        const text = item.STR;
        if (!text || text.length < 1) return;
        else if (/^\s+/g.test(text)) return;
        else if (/^-+/g.test(text)) return;
        else if (/^=+/g.test(text)) {
          allotments.push({});
          counter++;
          return;
        }

        let key: string;
        let value: string;
        if (text.includes(':')) {
          const splitText = text.split(':');
          key = toCamelCase(splitText[0].trim());
          value = splitText[1].trim();
        } else {
          // Use 3 spaces to split a string that does not contain a colon (:)
          const splitText = text.split('   ').filter((v) => v.length > 0);
          key = toCamelCase(splitText[0].trim());
          value = splitText[1].trim();
        }

        // Add an extra counter on the key if the same key exists
        if (allotments[counter][key]) {
          let extra = 2;
          let newKey = key + extra;
          while (allotments[counter][newKey]) {
            extra++;
            newKey = key + extra;
          }
          key = newKey;
        }

        allotments[counter][key] = value;
      });

      state.allotments = allotments;
    }

    /* Header setup */
    const startDate = computed(
      () =>
        state.searchData &&
        date.formatDate(state.searchData.date.start, 'DD/MM/YY')
    );
    const endDate = computed(
      () =>
        state.searchData &&
        date.formatDate(state.searchData.date.end, 'DD/MM/YY')
    );
    const disableNext = computed(() => {
      if (!state.searchData) return true;

      const diff = date.getDateDiff(
        state.searchData.date.end,
        state.searchData.date.start,
        'days'
      );
      return diff < 20;
    });

    return {
      ...toRefs(state),
      onSearch,
      startDate,
      endDate,
      disableNext,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  display: flex;
  position: sticky;
  top: 50px;
  z-index: 3;
}
</style>
