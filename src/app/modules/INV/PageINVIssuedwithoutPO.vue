<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchStoredwithPO 
      @onSearch="onSearch" />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
        <q-btn  @click="incomingStock"  flat round>
          <img :src="require('~/app/icons/INV/Icon-IncomingStock.svg')" height="30" />
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
        <template v-slot:body="props">
          <q-tr :props="props" @click="onRowClick(props.row)" >
           <q-td 
           :key="col.name" 
           :props="props" 
           v-for="col in props.cols">
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
  ref,
  watch
} from '@vue/composition-api';
import { tableHeaders } from './tables/IssuedwithoutPO.table';
import {data_table} from './utils/params.issuedwithoutpo'
import {users} from './utils/store'
import {Notify} from 'quasar'
export default defineComponent({
  setup(_, { root: { $api }, root }) {
    let charts;
    const state = reactive({
      data: [] as any,
      hide_bottom: false,
      isFetching: false
    });

    const NotifyCreate = (message) => Notify.create({
      message: message,
      type: 'negative',
      position: 'top',
      textColor: 'white',
      timeout: 2000,
    });

    const FETCH_API = async (api, body?) => {
      const [GET_DATACOMMON, GET_DATAINV] = await Promise.all([
        $api.inventory.FetchCommon(api, body),
        $api.inventory.FetchAPIINV(api, body)
        ])
      switch (api) {
        case 'checkPermission':
          if (GET_DATACOMMON.zugriff !== 'true') {
              NotifyCreate('Sorry, no access right')
          } else {
              display_data()
          }
          break;
        default:
            charts = data_table(GET_DATAINV)
            state.data = charts 
            if (state.data.length !== 0) {
                state.hide_bottom = true
            }
          break;
      }
    }
    onMounted(() => {
      FETCH_API('checkPermission', {
          userInit: users.users['userInit'],
          arrayNr: '39',
          expectedNr: '2'
      })
    });

    const display_data = () => {
        FETCH_API('directIssueWithPOPrepare')
    }

    const incomingStock = () => {
      root.$router.push('/inv/incoming-stockissuedwithoutpo');
    };

    const onSearch = (val) => {
      const x = charts.filter(x => {
          return x['docu-nr'].includes(val.inputan)
      })
      if (x.length !== 0) {
          state.data = x
      } else {
          NotifyCreate('Data not found')
      }
    };

    return {
      ...toRefs(state),
      onSearch,
      incomingStock,
      tableHeaders,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchStoredwithPO: () => import('./components/SearchIssuedwithoutPO.vue'),
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
