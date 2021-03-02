<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="235" persistent>
      <SearchRoomRevenueBreakdown :search="search" @onSearch="onSearch" />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
      >
        <template #header="props">
          <q-tr style="height: 35px" :props="props">
            <q-th
              :props="props"
              v-for="col in props.cols"
              :key="col.name"
              :style="col.style"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr
            :props="props"
            :class="{
              selected: props.row.selected,
            }"
            @click="onRowClick(props.row)"
          >
            <q-td :key="col.name" :props="props" v-for="col in props.cols">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
    <DialogCheckPermission :dialogConfirm="dialogConfirm" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import { tableHeaders } from './Tables/RoomRevenueBreakdown.tables';
import { store } from '~/store';
import { date } from 'quasar';
import { data_Table } from './utils/RoomRevenueBreakdown';

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      hide_bottom: false,
      data: [],
      dialogConfirm: {
        confirm: false,
        message: '',
      },
      search: {
        currDate: new Date(),
      },
    });

    const FetchApi = async (api, body = {}) => {
      const [GET_DATA, GET_DATA2] = await Promise.all([
        $api.incomeaudit.FetchCommon(api, body),
        $api.incomeaudit.FetchAPINA(api, body),
      ]);
      switch (api) {
        case 'checkPermission':
          if (GET_DATA['zugriff'] !== 'true') {
            state.dialogConfirm.confirm = true;
            state.dialogConfirm.message = GET_DATA['messStr'];
          }
          break;
        case 'roomRevenueBreakdownPrepare':
          state.search.currDate = GET_DATA2;
          break;
        case 'roomRevenueBreakdownList1':
          setTimeout(() => {
            state.isFetching = false;
            state.data = data_Table(GET_DATA2);
            if (state.data.length !== 0) {
              state.hide_bottom = true;
            }
          }, 1000);
          break;
        case 'roomRevenueBreakdownList2':
          setTimeout(() => {
            state.isFetching = false;
            state.data = data_Table(GET_DATA2);
            if (state.data.length !== 0) {
              state.hide_bottom = true;
            }
          }, 1000);
          break;
        default:
          break;
      }
    };

    onMounted(() => {
      const { userInit } = store.state.auth.user;
      FetchApi('checkPermission', {
        userInit: userInit,
        arrayNr: '1',
        expectedNr: '1',
      });
      FetchApi('roomRevenueBreakdownPrepare');
    });

    const onSearch = (data) => {
      state.isFetching = true;
      if (data['billDate'] >= data['currDate']) {
        FetchApi('roomRevenueBreakdownList1', {
          excTaxserv: 'false',
          pvILanguage: 1,
          newContrate: data['newContrate'],
          foreignRate: data['foreignRate'],
          priceDecimal: data['priceDecimal'],
          currDate: date.formatDate(data['currDate'], 'YYYY-MM-DD'),
        });
      } else {
        FetchApi('roomRevenueBreakdownList2', {
          excTaxserv: 'false',
          pvILanguage: 1,
          newContrate: data['newContrate'],
          foreignRate: data['foreignRate'],
          priceDecimal: data['priceDecimal'],
          currDate: date.formatDate(data['currDate'], 'YYYY-MM-DD'),
        });
      }
    };

    const onRowClick = (datarow) => {
      for (const i of state.data) {
        i.selected = false;
      }
      datarow['selected'] = true;
    };

    return {
      pagination: {
        rowsPerPage: 0,
      },
      tableHeaders,
      ...toRefs(state),
      onSearch,
      onRowClick,
    };
  },
  components: {
    SearchRoomRevenueBreakdown: () =>
      import('./components/SearchRoomRevenueBreakdown.vue'),
    DialogCheckPermission: () =>
      import('./components/DialogCheckPermission.vue'),
  },
});
</script>

<style lang="scss" scoped>
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
