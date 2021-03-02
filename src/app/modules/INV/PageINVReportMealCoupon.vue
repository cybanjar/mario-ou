<template>
  <div id="app">
    <div v-if="zugriff === 'false'">{{ messStr }}</div>
    <div v-else>
      <q-drawer :value="true" side="left" bordered :width="250" persistent>
        <searchMealCoupon :searches="searches" @onSearch="onSearch" />
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
import { tableHeaders } from './tables/mealCoupon.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import moment from 'moment';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      billdate: '',
      exchgRate: '',
      foreignNr: '',
      zugriff: '',
      messStr: '',
      doubleCurrency: '',
      searches: {
        departments: [],
      },
    });

    onMounted(async () => {
      const [resZugriff, resDepart] = await Promise.all([
        $api.inventory.FetchCommon('checkPermission', {
          userInit: '01',
          arrayNr: '41',
          expectedNr: '1',
        }),
        $api.inventory.FetchAPIINV('mealCouponPrepare'),
      ]);

      state.zugriff = resZugriff.zugriff;
      state.messStr = resZugriff.messStr;
      state.billdate = resDepart.billdate;
      state.exchgRate = resDepart.exchgRate;
      state.foreignNr = resDepart.foreignNr;
      state.doubleCurrency = resDepart.doubleCurrency;
      state.searches.departments = mapWithMeal(
        resDepart.tHoteldpt['t-hoteldpt'],
        'num'
      );
      state.isFetching = false;
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Meal Coupon');
      }
    }

    const onSearch = (state2) => {
      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV('mealCouponList', {
            doubleCurrency: state.doubleCurrency,
            foreignNr: state.foreignNr,
            exchgRate: state.exchgRate,
            billdate: state.billdate,
            fromDept: state2.fromdepartment.value,
            toDept: state2.todepartment.value,
            fromDate: my_date(state2.date.startDate),
            toDate: my_date(state2.date.endDate),
          }),
          charts = response['cList']['c-list'] || [];
        state.data = maps(charts);
      }
      asyncCall();
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

    const maps = (items) =>
      items
        ? items.map((item) => ({
            datum: date.formatDate(item.datum, 'DD/MM/YYYY'),
            deptname: item.deptname,
            rechnr: item.rechnr,
            pax: item['pax'],
            bezeich: item['bezeich'],
            'f-betrag': formatterMoney(item['f-betrag']),
            'f-cost': formatterMoney(item['f-cost']),
            'b-betrag': formatterMoney(item['b-betrag']),
            'b-cost': formatterMoney(item['b-cost']),
            betrag: formatterMoney(item['betrag']),
            't-cost': formatterMoney(item['t-cost']),
            'usr-id': item['usr-id'],
          }))
        : [];

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
    searchMealCoupon: () => import('./components/SearchMealCoupon.vue'),
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
