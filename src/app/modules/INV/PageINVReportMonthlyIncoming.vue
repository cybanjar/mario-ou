<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchMonthlyIncoming :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        dense
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :hide-bottom="false"
        class="table-accounting-date"
        flat
        bordered
      ></STable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { mapWithPrefix } from '~/app/helpers/mapSelectItems.helpers';
import { tableHeaders } from './tables/monthlyIncoming.table';
import { date } from 'quasar';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let dataLists;

    const state = reactive({
      isFetching: true,
      data: [],
      //fromDate: '',
      //toDate: '',
      date: null,
      fromStore: null,
      toStore: null,
      fromArt: null,
      toArt: null,
      sortBy: 1,
      searches: {
        articles: [],
        store: [],
      },
    });

    onMounted(async () => {
      const [resStore, resArt] = await Promise.all([
        $api.inventory.FetchAPIINV('getStorage'),
        $api.inventory.FetchAPIINV('getHelpInvArticle', {
          currLager: '0',
          recipe: 'false',
          sorttype: '0',
          sArtnr: '0',
          sBezeich: ' ',
        }),
      ]);
      state.searches.store = mapWithPrefix(resStore.tLLager?.['t-l-lager'], [
        'lager-nr',
      ]);
      state.searches.articles = mapWithPrefix(
        resArt.sartnrList?.['sartnr-list'],
        ['artnr']
      );
      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Monthly Incoming');
      }
    }

    const onSearch = async (state2) => {
      const response = await $api.inventory.FetchAPIINV('stinReportList', {
        sorttype: state2.sortBy,
        fromLager: state2.fromStore.value,
        toLager: state2.toStore.value,
        fromDate: state2.date.startDate,
        toDate: state2.date.endDate,
        fromArt: state2.fromArt.value,
        toArt: state2.toArt.value,
        fromGrp: '0',
        toGrp: '999',
      });
      dataLists = response['tList']['t-list'] || [];
      state.data = dataLists;
    };

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchMonthlyIncoming: () =>
      import('./components/SearchMonthlyIncoming.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
tr.selected td {
  background-color: #2d00e2 !important;
  color: #fff;
}
</style>
