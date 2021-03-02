<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchFBFlash :searches="searches" @onSearch="onSearch" />
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
import { mapWithadjustmain } from '~/app/helpers/mapSelectItems.helpers';
import { tableHeaders } from './tables/fbFlash.table';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      data: [],
      food: '',
      bev: '',
      date2: '',
      date1: '',
      searches: {
        departments: [],
      },
    });

    onMounted(async () => {
      const [resPrepare, resMain] = await Promise.all([
        $api.inventory.FetchAPIINV('fbFlashPrepare'),
        $api.inventory.FetchAPIINV('getInvMainGroup'),
      ]);

      state.food = resPrepare.food;
      state.bev = resPrepare.bev;
      state.date2 = resPrepare.date2;
      state.date1 = resPrepare.date1;
      state.searches.departments = mapWithadjustmain(
        resMain.tLHauptgrp['t-l-hauptgrp'],
        'endkum'
      );

      state.isFetching = false;
    });

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('fbFlashList', {
            pvILanguage: '1',
            fromGrp: state2.departments.value,
            food: state.food,
            bev: state.bev,
            date1: state2.date.startDate,
            date2: state2.date.endDate,
            'incl-initoh': state2.beginning,
          }),
          charts = response || [];

        const pbookList = charts.fbflashList['fbflash-list'];

        state.data = pbookList;
      }
      asyncCall();
    };

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'FB Flash');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
    };
  },
  components: {
    SearchFBFlash: () => import('./components/SearchFBFlash.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
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
