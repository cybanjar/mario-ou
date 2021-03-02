<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOrderTaker :searches="searches" @onSearch="onSearch" />
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
        :loading="isFetching"
        dense
        :data="build"
        :columns="tableHeaders"
        id="printMe"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { date, Notify } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts = [];

    const state = reactive({
      isFetching: true,
      build: [],
      searches: {
        userList: [],
      },
    });

    onMounted(async () => {
      state.isFetching = true;

      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('getOrderTaker', {}),
      ]);

      if (data) {
        responsePrepare = data || [];
        const okFlag = responsePrepare['outputOkFlag'];
        if (!okFlag) {
          Notify.create({
            message: 'Failed when retrive data, please try again',
            color: 'red',
          });
          state.isFetching = false;
          return false;
        }

        state.searches.userList = mapOU(responsePrepare.queasyList['queasy-list'], 'number1', 'char2');
        state.isFetching = false;
      } else {
        Notify.create({
            message: 'Please check your internet connection',
            color: 'red',
        });
        state.isFetching = false;
        return false;
      }
    });

    const onSearch = (state2) => {
      state.isFetching = true;

      async function asyncCall() {
        const [dataOrderTakerList] = await Promise.all([
          $api.outlet.getOUTableList('getOrderTakerList', {
            usrNr: state2.userID.value,
            fromDate: date.formatDate(state2.inputDate.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.inputDate.end, 'MM/DD/YYYY'),
          }),
        ]);

        if (dataOrderTakerList) {
          const data = dataOrderTakerList || [];
          const okFlag = data['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }      
          charts = data.odtakerList['odtaker-list'] || [];
          state.build = charts;
          state.isFetching = false;
        } else {
          Notify.create({
            message: 'Please check your internet connection',
            color: 'red',
          });
          state.isFetching = false;
          return false;
        }
      }
      asyncCall();
    };

    const tableHeaders = [
      {
        label: 'Date',
        field: 'datum',
        name: 'datum',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Table Number',
        field: 'tableno',
        name: 'tableno',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Bill Number',
        field: 'billno',
        name: 'billno',
        align: 'left',
        sortable: false,
      },

      {
        label: 'Article Number',
        field: 'artno',
        name: 'artno',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Description',
        field: 'bezeich',
        name: 'bezeich',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Quantity',
        field: 'qty',
        name: 'qty',
        sortable: false,
        align: 'right',
        format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Amount',
        field: 'amount',
        name: 'amount',
        sortable: false,
        align: 'right',
        format: (val) => (val == 0) ? '' : formatThousands(val),
      },
      {
        label: 'Department',
        field: 'departement',
        name: 'departement',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Time',
        field: 'zeit',
        name: 'zeit',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Posting ID',
        field: 'id',
        name: 'id',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Payment ID',
        field: 'tb',
        name: 'tb',
        align: 'left',
        sortable: false,
      },
    ];

    function doPrint() {
      if (state.build.length !== 0) {  
        PrintJs(state.build, tableHeaders, 'Order Taker');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint
    };
  },
  components: {
    searchOrderTaker: () => import('./components/SearchOrderTakerReport.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
