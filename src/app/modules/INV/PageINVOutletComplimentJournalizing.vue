<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <searchAdjustmentResult :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
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
        :hide-bottom="hide_bottom"
      >
      <template v-slot:body="props">
        <q-tr :props="props" @click="selection(props.row)" 
        :class="(props.row.selected)?'bg-blue-grey-2 text-black':'bg-white text-black'">
          <q-td :props="props" v-for="col in props.cols" :key="col.name">
            {{col.value}}
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
} from '@vue/composition-api';
import { Notify, date } from 'quasar';
import { tableHeaders, dataTable } from './tables/outletCompilementJournalizing';
import {dataState, ButtonExecute, paramsglLinkstock2} from './utils/paramsOutletComplimentJour'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let params, selections;

    const state = reactive({
      isFetching: false,
      data: [],
      searches: {} as any,
      hide_bottom: false
    });

            // HELPER 
    const NotifyCreate = (mess, col?, position?, key?) => Notify.create({
              message: mess,
              color: col,
              position,
              textColor: key? 'white': 'white',
              timeout: key? 0 : 2000,
              multiLine: key ? true : false,
              actions: key ? [
              { label: 'No', color: 'white', handler: () => { /* ... */ } },
              { label: 'Yes', color: 'white', handler: () => {
                if (selections !== undefined) {
                  FETCH_API('glLinkstock2', paramsglLinkstock2(selections))
                } else {
                  Notify.create({
                    message: 'error',
                    color: 'red'
                  })
                }
              }},
              ] : null
            });

    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.inventory.FetchAPIINV(api, body)
      if (api == 'glLinkcompliPrepare') {
        state.searches = dataState(GET_DATA, 'prepare')
      } else if (api == 'glLinkcompli1') {
        if (state.data.length == 0) {  
          state.isFetching = true        
          setTimeout(() => {
          state.data = dataTable(GET_DATA)
          state.searches = dataState(Object.assign(GET_DATA, params), 'search')
          state.isFetching = false
          if (state.data.length !== 0) {
            state.hide_bottom = true
          }
          }, 1500)
        } else {
          if (GET_DATA.msgStr !== '') {
            NotifyCreate('err', 'red', 'top')
          } else if (GET_DATA.currAnz == 0) {
            NotifyCreate('No GL journals have been created', 'red', 'top')
          } else {
            NotifyCreate('Do you really want to transfer NOW to G/L?',
            'primary',
            'center',
            true
            )
          }
        }
      } else {
        if (GET_DATA.outputOkFlag == 'true') {          
          Notify.create({
            type: 'positive',
            message: `Sukses`
          })
        }
      }
    }

    onMounted(async () => {
      FETCH_API('glLinkcompliPrepare')
    });

    const onSearch = (val) => {
      params = val
      if (val.searches.refNum == '' || val.searches.toDate == null) {
        NotifyCreate('Unfilled field(s) detected', 'red', 'top')
        } else {
        FETCH_API('glLinkcompli1', ButtonExecute(val))
      }
    };

    const selection = (dataRow) => {
      for(const i in state.data){
        state.data[i]['selected'] = false
      }
      dataRow['selected'] = true;
      selections = dataRow
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      selection,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    searchAdjustmentResult: () =>
      import('./components/SearchOutletComplimentJournalizing.vue'),
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
}
</style>

