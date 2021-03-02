<template>
  <div id="app">
    <!-- <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchCloseMasterplan :searches="searches" @onSearch="onSearch" />
    </q-drawer> -->

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
import { mapWithMeal } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { tableHeaders } from './tables/ForecastByEventType.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import moment from 'moment';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      searches: {
        departments: [],
      },
    });

    onMounted(() => {
      console.log('halo');
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Meal Coupon');
      }
    }

    const onSearch = (state2) => {
      console.log('halo');
    };

    function my_date(mydate) {
      const dDate = String(moment(mydate, 'DD/MM/YYYY').date()).padStart(
        2,
        '0'
      );
      const dMonth = String(moment(mydate, 'DD/MM/YYYY').month() + 1).padStart(
        2,
        '0'
      );
      const dYear = String(moment(mydate, 'DD/MM/YYYY').year());
      return moment(`${dYear}-${dMonth}-${dDate}`, 'YYYY-MM-DD');
    }

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
//   components: {
//     SearchCloseMasterplan: () => import('./components/SearchCloseMasterplan.vue'),
//   },
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
