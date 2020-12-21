<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchChartOfAccounts @onSearch="onSearch"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn @click="onDialog" flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      
      <STable
        class="table-rooming-list"
        :columns="roomTableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        :loading="loading"
        row-key="index"
        virtual-scroll
        :virtual-scroll-item-size="29"
        :virtual-scroll-sticky-size-start="29"
        @virtual-scroll="onScroll"
        flat bordered
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th
              :props="props"
              key="articelNumber"
              rowspan="2"
            >{{ props.colsMap.articelNumber.label }}</q-th>

            <q-th
              :props="props"
              key="descriPtion"
              rowspan="2"
            >{{ props.colsMap.descriPtion.label }}</q-th>
            <q-th colspan="2">Mess</q-th>
            <q-th colspan="2">Delivery</q-th>
            <q-th
              :props="props"
              key="masseinheit"
              rowspan="2"
            >{{ props.colsMap.guestNote.label }}</q-th>
            <q-th colspan="3">Price</q-th>
            <q-th
              :props="props"
              key="purchase"
              rowspan="2"        
            >{{ props.colsMap.purchase.label}}</q-th>
            <q-th
              :props="props"
              key="articelNumber"
              rowspan="2"        
            >{{ props.colsMap.accountNumber.label }}
            </q-th>
            <q-th
              :props="props"
              key="actions"
              rowspan="2"
              class="fixed-col right"
              style="z-index: 4"        
            >{{ props.colsMap.actions.label }}
            </q-th>
          </q-tr>
          <q-tr :props="props">
            <q-th
              v-for="col in getDefaultColumns(props.cols)"
              :key="col.name"
              :props="props"
            >{{ col.label }}</q-th>
          </q-tr>
        </template>
        
        <template #body="props">
          <q-tr :props="props">
            <q-td
            :props="props"
            v-for="col in props.cols.filter(cols => ![
            'actions'].includes(cols.name))"
            :key="col.name"
            >
                  {{col.value}}
            </q-td>
            <q-td :props="props.row.actions" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                  <q-list :props="props">
                    <q-item @click="onEdit(props.row)" :props="props" clickable v-ripple>
                      <q-item-section>edit</q-item-section>
                    </q-item>
                    <q-item @click="onDelete(props.row)" clickable v-ripple>
                      <q-item-section>delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </STable>
    </div>
    <DialogChartOfAccounts
      :dataDialog="dataDialog"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
} from '@vue/composition-api';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { roomTableHeaders, inputCategory } from './tables/stockItem.table';
import { data_table, functional_modify } from './utils/params.stockItem'
import {scroll, Notify} from 'quasar'

export default defineComponent({
  setup(_, { root: { $api } }) {
    const { getScrollTarget, setScrollPosition } = scroll
    let charts, value, lastArt1;
    const state = reactive({
      data: [],
      loading: false,
      nextPage: 2,
      hide_bottom: false,
      confirm: false,
      trueandfalse: false,
      getAccountnumber: '',
      dataDialog : {
        prepare: '',
        accountId: '',
        dialog: false,
        valueData: 0,  
      }
    });

    // helpers
    const MAP_DATA = (data) => {
      return data.map(items => ({
        label : `${items.endkum} - ${items.bezeich}`,
        value: items.endkum
      }))
    }

    const NotifyCreate = (mess) => Notify.create({
      message: `Are you sure delete the stock article ${mess.toString()} - Avocado`,
      color: 'primary',
      position: 'center',
      textColor: 'white',
      timeout: 0,
      multiLine: true,
      actions:  [
      { label: 'No', color: 'white', handler: () => { /* ... */ } },
      { label: 'Yes', color: 'white', handler: () => {
        FETCH_API('delInvArticle', {
          pvILanguage: '1',
          artnr: mess
        })
      }},
      ]
      });
    const NotifyCreate1 = () => Notify.create({
      message: `Stock Onhand exists, deleting not possible.`,
      type: 'negative',
      position: 'top',
      textColor: 'white',
      timeout: 2000,
      });

    // FETCH API
    const FETCH_API = async (api, body?) => {
      const GET_DATA = await $api.inventory.FetchAPIINV(api, body)
      switch (api) {
        case 'getInvArticleList':          
          lastArt1 = GET_DATA.firstArtnr
          const data = GET_DATA.tLArtikel['t-l-artikel']
          setTimeout(() => {
            state.loading = false
            const dataTable =  data_table(data)
            for(const i in dataTable){
              state.data.push(dataTable[i])
            }
            if(state.data.length !== 0){
              state.hide_bottom = true
            }
          }, 2000)
          break;
        case 'getInvMainGroup':
          const x = GET_DATA.tLHauptgrp['t-l-hauptgrp']
          inputCategory[0].options = MAP_DATA(x)
          break;
        case 'chgInvArticlePrepare':
          state.dataDialog.dialog = true
          functional_modify(GET_DATA)
          break;
        default:
          if (GET_DATA.strMsg !== '') {
            NotifyCreate1()
          }
          break;
      }
    }


    onMounted(() => {
      FETCH_API('getInvMainGroup')
    })

    const onScroll = ({to, ref}) => {
      const lastIndex = state.data.length - 1
        if (!state.loading && to === lastIndex && lastIndex > 27 ) {
          if (lastIndex > 56) {
            state.loading = true
          }
            const data = {
              "sorttype ": value.shape,
              "lastArt" : value.description == ''? " ": value.description,
              "lastArt1" : lastArt1
            }
            FETCH_API('getInvArticleList', data)
        }

    }

    const onSearch = (value1) => {
      value = value1
      state.loading = true
      if (value.shape == '2') {
        const data = {
          "sorttype ": value.shape,
          "lastArt" : value.description == ''? " ": value.description,
          "lastArt1" : 1101001
        }
        FETCH_API('getInvArticleList', data)
      }
    };

    const onDelete = (value) => {
      NotifyCreate(value.artnr)
    }

    const onEdit = (value) => {
      FETCH_API('chgInvArticlePrepare', {
        changed: 'false',
        artnr: value.artnr
      })
    }

    const onDialog = (val) => {
      state.dataDialog.dialog = true;
      functional_modify({})
    };

    function getDefaultColumns(cols) {
      return cols.filter(
        (col) =>
          ![
            'descriPtion',
            'articelNumber',
            'guestNote',
            'purchase',
            'accountNumber',
            'actions'
          ].includes(col.name)
      );
    }

    function getDefaultData (cols){
      return cols.filter(
        col => 
        ![
          'articelNumber',
          'descriPtion',
          'accountNumber'
        ].includes(col.name)
      )
    }
    return {
      ...toRefs(state),
      roomTableHeaders,
      getDefaultColumns,
      getDefaultData,
      onScroll,
      onDelete,
      onEdit,
      onSearch,
      onDialog,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchChartOfAccounts: () =>
      import('./components/SearchChartStockItem.vue'),
    DialogChartOfAccounts: () => import('./components/ModalNewStockItem.vue'),
    StockItemRoomTable: () => import('./components/INVStockItemRoomTable.vue'),
  },
});
</script>

<style lang="scss" scoped>
.table-rooming-list {
  max-height: 75vh;
  thead tr th {
    position: sticky;
    z-index: 3;
  }

  thead tr:first-child th {
    top: 0;
  }

  thead tr:last-child th {
    top: 28px;
  }

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
