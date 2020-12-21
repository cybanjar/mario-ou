<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOccupiedTable :searches="searches" @onSearch="onSearch" />
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
import { Notify } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts = [];

    const state = reactive({
      isFetching: true,
      build: [],
      searches: {
        total: 0,
      },
    });

    const tableHeaders = [
      {
        label: 'Dept',
        field: 'dept',
        sortable: false,
        align: 'center',
        width: 120,
        divider: true,
      },
      {
        label: 'TableNo',
        field: 'tischnr',
        sortable: false,
        align: 'right',
        width: 200,
        divider: true,
      },
      {
        label: 'Pax',
        field: 'belegung',
        sortable: false,
        align: 'right',
        width: 150,
        divider: true,
      },
      {
        label: 'Seats',
        field: 'normalbeleg',
        sortable: false,
        align: 'right',
        width: 150,
        divider: true,
      },
      {
        label: 'OCC',
        field: 'occupied',
        sortable: false,
        align: 'left',
        width: 150,
        divider: true,
      },
      {
        label: 'Served By',
        field: 'name',
        sortable: false,
        align: 'right',
        width: 150,
        divider: true,
      },
      {
        label: 'Balance',
        field: 'balance',
        sortable: false,
        align: 'right',
        width: 150,
        divider: true,
      },
      {
        label: 'RmNo',
        field: 'zinr',
        sortable: false,
        align: 'right',
        width: 150,
        divider: true,
      },
      {
        label: 'Guest Name',
        field: 'gname',
        sortable: false,
        align: 'left',
      },
      {
        label: 'Description',
        field: 'bezeich',
        sortable: false,
        align: 'center',
      },
    ];

    onMounted(async () => {      
      const [data] = await Promise.all([
        $api.outlet.getOUTableList('occupiedTableList', {
          dept: '1',
        }),
      ]);

      if (data) {
        charts = data || [];
        const okFlag = charts['outputOkFlag'];
        if (!okFlag ) {
          Notify.create({
            message: 'Failed when retrive data, please try again',
            color: 'red',
          });
          state.isFetching = false;
          return false;
        }
        state.build = [];
        state.build = charts['tList']['t-list'];
        state.searches.total = charts['totSaldo'];
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
      charts = [];

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUTableList('occupiedTableList', {
            dept: '1',
          }),
        ]);

        if (data) {
          charts = data || [];
          const okFlag = charts['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }
          state.build = charts['tList']['t-list'];
          state.searches.total = charts['totSaldo'];
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
    searchOccupiedTable: () => import('./components/SearchOccupiedTable.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
