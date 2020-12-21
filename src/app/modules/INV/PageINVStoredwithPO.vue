<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchStoredwithPO 
      @onSearch="onSearch" 
      :orderDate="orderDate" />
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
          <img :src="require('~/app/icons/INV/Icon-IncomingStock.svg')" height="35" />
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
import { tableHeaders } from './tables/StoredwithPO.tables';
import {data_table} from './utils/params.storedwithpo'
export default defineComponent({
  setup(_, { root: { $api }, root }) {
    let charts;
    const state = reactive({
      data: [] as any,
      orderDate:"" as any,
      hide_bottom: false,
      isFetching: false
    });

    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.inventory.FetchAPIINV(api, body)
      switch (api) {
        case 'pchaseStockInPrepare':
          state.orderDate = GET_DATA
          break;
        default:
          setTimeout(() => {
            state.data = data_table(GET_DATA.q2List['q2-list'])
            state.isFetching = false
            if (state.data.length !== 0) {
              state.hide_bottom = true
            }
          },1000)
          break;
      }
    }
    onMounted(() => {
      FETCH_API('pchaseStockInPrepare')
    });

    watch(() => state.orderDate, 
    (orderDate) => {
      FETCH_API('pchaseStockInList1', {
          sorttype: '',
          ponum: ' ',
          supplier: ' ',
          orderDate: orderDate.orderDate,
          fDate: orderDate.billdate,
          tDate: orderDate.billdate,
      })
    })

    const incomingStock = () => {
      root.$router.push('/inv/incomingstock');
    };

    const onSearch = (val) => {
      state.isFetching = true
      FETCH_API('pchaseStockInList1', {
          sorttype: val.group,
          ponum: val.poNumber,
          supplier: val.inputan,
          orderDate: val.inputan,
          fDate: '2019-01-14',
          tDate: '2019-01-14',
        })
    };

    const onRowClick = (p, val) => {
      localStorage.setItem('labelStoredwithPO', JSON.stringify(val))
    };

    const tes = (value) => {
      console.log('sukses', value)
    }
    return {
      ...toRefs(state),
      onSearch,
      tes,
      onRowClick,
      tableHeaders,
      incomingStock,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchStoredwithPO: () => import('./components/SearchStoredwithPO.vue'),
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
