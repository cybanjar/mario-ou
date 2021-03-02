<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <searchIncoming :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        class="table-accounting-date"
        flat
        bordered
        :hide-bottom="hide_bottom"
      >
        <template #body="props">
          <q-tr
            :props="props"
            @click="onRowClick(props.row)"
            :class="{
              selected: props.row.selected,
            }"
          >
            <q-td :key="col.name" :props="props" v-for="col in props.cols">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  watch,
} from '@vue/composition-api';
import { Notify } from 'quasar';
import { tableHeaders, dataTable } from './tables/IncomingJournalizing';
import {
  paramsIncomingJournalizing,
  dataIncomingJournalizing,
  paramscheckPermission,
  paramsglLinkstock2,
  linkstock_check_refnobl,
} from './utils/params.inv';
import { store } from '~/store';
import { PrintJs } from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let value, selections;
    const { user } = store.state.auth;
    const state = reactive({
      isFetching: false,
      searches: {} as any,
      data: [] as any,
      hide_bottom: false,
    });
    // FETCH DATA
    const FETCH_DATA = async (api, body?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.inventory.FetchAPIINV(api, body),
        $api.inventory.FetchCommon(
          'checkPermission',
          paramscheckPermission(user)
        ),
      ]);
      if (api == 'glLinkstockPrepare') {
        const dataKey = { datakey: 'incoming' };
        state.searches = dataIncomingJournalizing(
          Object.assign(GET_DATA, dataKey),
          'prepare'
        );
      } else if (api == 'glLinkstockBtnGo' || api == 'glLinkstockCheckRefno') {
        if (GET_DATA.tGList) {
          if (GET_COMMON.zugriff == 'true') {
            if (state.data.length == 0) {
              state.isFetching = true;
              if (
                GET_DATA.msgStr !== '' ||
                GET_DATA.msgStr2 !== '' ||
                GET_DATA.msgStr3 !== ''
              ) {
                NotifyCreate('error', 'red', 'top');
                setTimeout(() => {
                  state.isFetching = false;
                }, 2000);
              } else if (GET_DATA.currAnz == 0) {
                NotifyCreate('No GL journals have been created', 'red', 'top');
                setTimeout(() => {
                  state.isFetching = false;
                }, 2000);
              } else {
                const stateData = dataIncomingJournalizing(
                  Object.assign(GET_DATA, value),
                  'search'
                ) as any;
                setTimeout(() => {
                  state.data = dataTable(GET_DATA);
                  state.searches = stateData;
                  if (state.data.length !== 0) {
                    state.isFetching = false;
                    state.hide_bottom = true;
                  }
                }, 2000);
              }
            } else {
              if (GET_DATA.credits !== GET_DATA.debits) {
                NotifyCreate('Transaction not balanced', 'red', 'top');
              } else {
                NotifyCreate(
                  'Do you really want to transfer NOW to G/L?',
                  'white',
                  'center',
                  true
                );
              }
            }
          }
        }
        if (GET_DATA.availGlJouhdr) {
          if (state.data.length == 0) {
            if (GET_DATA.availGlJouhdr == 'true') {
              NotifyCreate('Reference number already exists', 'red', 'top');
            }
          }
        }
      } else if (api == 'glLinkstock2') {
        console.log('sukses', GET_DATA);
      } else {
        alert('err');
      }
    };
    // HELPER
    const NotifyCreate = (mess, col?, position?, key?) =>
      Notify.create({
        message: mess,
        color: col,
        position,
        textColor: key ? 'black' : 'white',
        timeout: key ? 0 : 2000,
        multiLine: key ? true : false,
        actions: key
          ? [
              {
                label: 'No',
                color: 'primary',
                handler: () => {
                  /* ... */
                },
              },
              {
                label: 'Yes',
                color: 'primary',
                handler: () => {
                  console.log('sukses', selections);
                  if (selections !== undefined) {
                    FETCH_DATA('glLinkstock2', paramsglLinkstock2(selections));
                  } else {
                    NotifyCreate(
                      'Please Select row data in table',
                      'red',
                      'top'
                    );
                  }
                },
              },
            ]
          : null,
      });

    onMounted(() => {
      FETCH_DATA('glLinkstockPrepare');
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Store Requisition');
      }
    }

    const onSearch = (val) => {
      value = val;
      if (val.searches.toDate == null || val.searches.referenceNumber == '') {
        NotifyCreate('Unfilled field(s) detected', 'red', 'top');
      } else {
        FETCH_DATA(
          'glLinkstockBtnGo',
          paramsIncomingJournalizing(val.searches)
        );
        FETCH_DATA('glLinkstockCheckRefno', linkstock_check_refnobl());
      }
    };

    const onRowClick = (datarow) => {
      for (const i of state.data) {
        i.selected = false;
      }
      datarow['selected'] = true;
      selections = datarow;
    };

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      onRowClick,
      doPrint,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    searchIncoming: () => import('./components/SearchIncomingJournalizing.vue'),
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
