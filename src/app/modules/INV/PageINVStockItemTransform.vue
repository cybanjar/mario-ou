<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="344" persistent>
      <SearchStockItemTransform 
      :searches="searches" 
      @ADD="ADD"
      @transformIN="transformIN" 
      @inputarticelNumber="inputarticelNumber"
      />
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
          <q-tr :props="props">
            <q-td :props="props" 
              v-for="col in props.cols.filter((x, i) => [
              0,1,2,3].includes(i))" 
              :key="col.name">
              {{col.value}}
            </q-td>
            <q-td  
              :props="props"
              key="qty">
              <div v-if="props.rowIndex !== qtyModify">
                {{props.row.qty}}
              </div>
              <q-input
                v-else 
                style="width: 70px" 
                @blur="blurQTY(props.row)"
                @keyup.enter="blurQTY(props.row)"
                @input="blurQTYY(props.row)"
                autofocus
                dense 
                borderless 
                v-model="props.row.qty" />
            </q-td>
            <q-td :props="props" 
              v-for="col in props.cols.filter((x, i) => [
              5,6,7,8].includes(i))" 
              :key="col.name">
              {{col.value}}
            </q-td>
            <q-td :props="props" 
              key="actions">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                  <q-list :props="props">
                    <q-item :props="props" @click="onClickEdit(props)" clickable v-ripple>
                      <q-item-section>edit</q-item-section>
                    </q-item>
                    <q-item @click="deleteDataRow(props.row)" clickable v-ripple>
                      <q-item-section>delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
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
  watch
} from '@vue/composition-api';
import { Notify } from 'quasar';
import { tableHeaders, dataTable } from './tables/TransferOutStockItem';
import {
paramsIncomingJournalizing, 
dataIncomingJournalizing, 
paramscheckPermission,
paramsglLinkstock2,
linkstock_check_refnobl
} from './utils/params.inv'
import {fromStore, articelNumber} from './utils/params.stockItemTransform'
import { store } from '~/store';
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'

export default defineComponent({
  setup(_, { root: { $api } }) {
    let value, selections
    const { user } = store.state.auth;
    const state = reactive({
      isFetching: false,
      hide_bottom: false,
      data: [] as any,
      qtyModify: null,
      searches: {
        disableTransform: true,
        date: new Date(),
        fromStore: fromStore,
        store: '',
        articelNumber: articelNumber,
        art1: '',
        art2: '',
        qty: '',
        amount: '0',
        price: '0'
      }
    });
    // FETCH DATA
    const FETCH_DATA = async (api, body?) => {
      const [GET_DATA, GET_COMMON]= await Promise.all([
        $api.inventory.FetchAPIINV(api, body),
        $api.inventory.FetchCommon(api, body)
      ])
      if(GET_COMMON.zugriff !== 'true'){
          NotifyCreate('Sorry, no access righ', 'red', 'top')
      }
    }
        // HELPER 
    const NotifyCreate = (mess, col?, position?, key?) => Notify.create({
        message: mess,
        color: col,
        position,
      });

    onMounted(() => {
      FETCH_DATA('checkPermission', 
      paramscheckPermission(user))
    })

    const ADD = (val) => {
      if (val.searches.art1 !== '' && val.searches.qty !== '') {
        if (!isNaN(val.searches.qty)){
          if(Number(val.searches.qty) == 0){
            NotifyCreate('Wrong quantity', 'red', 'top')
          } else {
            let art = []
            for(const i of state.data){
              art.push(i.artNumber)
            }
            if (art.includes(val.articel)) {
              NotifyCreate('Article already, Change the quantity instead', 'red', 'top')
            } else {
              state.data.push(dataTable(Object.assign(
                val.searches.art1,
                val.searches,
              )))
              if (state.data.length !== 0) {
                state.searches.disableTransform = false
              } else {
                state.searches.disableTransform = true
              }
            }
          let x = 0
          for(const i of state.data){
              x += Number(i.price)
          }
          state.searches.art1 = ''
          state.searches.qty = ''
          state.searches.price = '0'
          state.searches.amount = '0'
          if(state.data.length !== 0){
            state.hide_bottom = true
          }
          }
        } else {
          NotifyCreate('Quantity Not Number', 'red', 'top')
        }
      } else {
        NotifyCreate('Please fill in Articel Number / Quantiy', 'red', 'top')
      }
    };

    const transformIN = () => {
      alert('gagal')
    }

    const blurQTY = (val) => {
      if (
      !isNaN(val.qty) 
      && val.qty !== '' 
      && Number(val.qty) !== 0) 
      {
        if (Number(val.qty) <= Number(val.stock)) {
          state.qtyModify = null
        } else {
          NotifyCreate('Wrong quantity', 'red', 'top')
        }
      } else {
        val.qty = ''
        NotifyCreate('Wrong quantity', 'red', 'top')
      }
    }

    const blurQTYY = (val) => {
      if (!isNaN(val.qty)) {
        if (Number(val.qty) <= Number(val.stock)) {
          val.amount = formatterMoney(Number(val.qty) * val.price.replace(/,/g, ''))
        } else {
          NotifyCreate('Wrong quantity', 'red', 'top')
        }
      } else {
        val.qty = ''
        NotifyCreate('Wrong quantity', 'red', 'top')
      }
    }
    const onClickEdit = (dataRow) => {
      state.qtyModify = dataRow.pageIndex
    }
    const deleteDataRow = (dataRow) => {
      state.data = state.data.filter((x, i) => {
         return x.artNumber !== dataRow.artNumber
      })
      if(state.data.length == 0){
        state.hide_bottom = false
      }
    }

    const inputarticelNumber = (value, val) => {
      const y = value.searches
      if(val == 1){
        let x = ''
        for(const i of state.data){
          x += i.artNumber +' '
        }
        if(x.includes(y.art1.artNumber)){
          NotifyCreate('Articel already, chane the quantity insted', 'red', 'top')
          state.searches.art1 = ''
        }
      } else {
        if(Number(y.qty) > y.art1.qty){
          NotifyCreate('Wrong quantity', 'red', 'top')
          y.qty = 0
        }
      }
      
    }

    return {
      ...toRefs(state),
      tableHeaders,
      inputarticelNumber,
      ADD,
      transformIN,
      onClickEdit,
      deleteDataRow,
      blurQTY,
      blurQTYY,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchStockItemTransform: () => import('./components/SearchStockItemTransform.vue'),
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