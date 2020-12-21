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
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        :loading="isFetching"
        dense
        :data="build"
        :columns="tableHeaders"
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
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
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
        align: 'right',
        sortable: false,
      },
      {
        label: 'TbNo',
        field: 'tableno',
        name: 'tableno',
        align: 'center',
        sortable: false,
      },
      {
        label: 'Bill-No',
        field: 'billno',
        name: 'billno',
        align: 'right',
        sortable: false,
      },

      {
        label: 'ArtNo',
        field: 'artno',
        name: 'artno',
        sortable: false,
      },
      {
        label: 'Description',
        field: 'bezeich',
        name: 'bezeich',
        sortable: false,
      },
      {
        label: 'Qty',
        field: 'qty',
        name: 'qty',
        sortable: false,
      },
      {
        label: 'Amount',
        field: 'amount',
        name: 'amount',
        sortable: false,
      },
      {
        label: 'Department',
        field: 'departement',
        name: 'departement',
        sortable: false,
      },
      {
        label: 'Time',
        field: 'zeit',
        name: 'zeit',
        sortable: false,
      },
      {
        label: 'ID',
        field: 'id',
        name: 'id',
        sortable: false,
      },
      {
        label: 'TB',
        field: 'tb',
        name: 'tb',
        sortable: false,
      },
    ];

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
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
