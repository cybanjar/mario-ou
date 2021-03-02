<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchIncomingReturn @onSearch="onSearch" />
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
  toRefs,
  reactive,
  onMounted,
} from '@vue/composition-api';
import { date } from 'quasar';
import { tableHeaders } from './tables/incomingReturn.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import moment from 'moment';
import { formatterMoney } from '../../helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: true,
      data: [],
      doubleCurrency: '',
      showPrice: false,
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Incoming Return');
      }
    }

    onMounted(async () => {
      const resPrepare = await Promise.all([
        $api.inventory.FetchCommon('getHTParam0', {
          casetype: '1',
          inpParam: '43',
        }),
      ]);
      state.showPrice = resPrepare[0].flogical;

      state.isFetching = false;
    });

    const onSearch = (state2) => {

      async function asyncCall() {
        const response = await $api.inventory.FetchAPIINV(
            'stockRetourlistList',
            {
              fromDate: my_date(state2.date.startDate),
              toDate: my_date(state2.date.endDate),
              fromSupp: state2.from === '' ? ' ' : state2.from,
              toSupp: state2.to === '' ? ' ' : state2.to,
              showPrice: state.showPrice,
            }
          ),
          charts = response['stockRetourList']['stock-retour-list'] || [];
        state.data = Mapping(charts);
      }
      asyncCall();
    };

    const Mapping = (data) => {
      return data.map((items) => ({
        datum: date.formatDate(items.datum, 'DD/MM/YYYY'),
        lief: items.lief,
        bezeich: items.bezeich,
        qty: items.qty,
        epreis: formatterMoney(items.epreis),
        amount: formatterMoney(items.amount),
        reason: items.reason,
        id: items.id,
        dlvnote: items.dlvnote,
        lager: items.lager,
      }));
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
      const dYear = String(moment(mydate, 'DD/MM/YYYY').year()).substr(-2);
      return moment(`${dMonth}/${dDate}/${dYear}`, 'MM/DD/YY');
    }

    // const maps = (items) =>
    //   items
    //     ? items.map((item) => ({
    //         datum: date.formatDate(item.datum, 'DD/MM/YYYY'),
    //         deptname: item.deptname,
    //         rechnr: item.rechnr,
    //         pax: item['pax'],
    //         bezeich: item['bezeich'],
    //         'f-betrag': formatterMoney(item['f-betrag']),
    //         'f-cost': formatterMoney(item['f-cost']),
    //         'b-betrag': formatterMoney(item['b-betrag']),
    //         'b-cost': formatterMoney(item['b-cost']),
    //         betrag: formatterMoney(item['betrag']),
    //         't-cost': formatterMoney(item['t-cost']),
    //         'usr-id': item['usr-id'],
    //       }))
    //     : [];

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
    };
  },
  components: {
    searchIncomingReturn: () => import('./components/SearchIncomingReturn.vue'),
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
