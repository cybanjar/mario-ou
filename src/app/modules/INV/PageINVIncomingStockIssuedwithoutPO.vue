<template>
  <div>
    <div class="column justify-between">
      <div class="col-7" style="height: 570px">
        <q-drawer 
          :value="true"
          side="left" 
          bordered :width="360" 
          persistent>
          <SearchIncomingIssuidwithPO @filterFn="filterFn" :searches="searches"/>
        </q-drawer>
        <div class="q-pa-lg">
          <div class="q-mb-md">
            <q-btn flat round class="q-mr-lg">
              <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
            </q-btn>
            <q-btn flat round>
              <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
            </q-btn>
              <STable
                :columns="tableHeaders"
                :data="data"
                :rows-per-page-options="[0]"
                :pagination.sync="pagination"
                :hide-bottom="hide_bottom"
                class="table-accounting-date"
                flat bordered
              />
          </div>
        </div>
      </div>
      <div class="col-1">
        <q-card-actions align="right">
          <q-btn
            size="sm"
            color="primary"
            label="save"
            style="width: 100px; height: 25px; marginRight: 20px; marginTop: -4px"
            @click="saveReturn"
          />
        </q-card-actions>
      </div>
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
} from '@vue/composition-api';
import {tableHeaders} from './tables/IncomingIssuedwithoutPO'
import {InputSearch} from './Input/IncominStockIssuidwithPO'
import {users} from './utils/store'
import {Notify} from 'quasar'
import {map_articelnumber, suppliernumber} from './utils/params.incomingstockissuedwithpo'
export default defineComponent({
    setup(_, { root: { $api } }) {
        let zugriff, stringOptions
        const state = reactive({
          data: [],
          isFetching: false,
          hide_bottom: false,
          searches: {
            InputSearch: InputSearch,
          },
        });

        const NotifyCreate = (message) => Notify.create({
          message: message,
          type: 'negative',
          position: 'top',
          textColor: 'white',
          timeout: 2000,
        });
        const NotifyCreate1 = (message) => Notify.create({
          message: message,
          position: 'top',
          textColor: 'white',
          color: 'red',
          timeout: 2000,
        });

        const FETCH_API = async (api, body?) => {
            const GET_COMMON = await $api.inventory.FetchCommon(api, body) 
            switch (api) {
              case 'checkPermission':              
                zugriff = GET_COMMON.zugriff
                if (zugriff !== 'true') {
                    NotifyCreate('Sorry, no access right')
                } else {
                  _firstdata()
                }
                break;
              case 'getAllArtikel':   
                stringOptions = map_articelnumber(GET_COMMON)       
                break;
              default:
                suppliernumber(GET_COMMON)
                break;
            }
        }

        const _firstdata = () => {
          FETCH_API('getAllArtikel', {
             "sorttype" : 3,
             "lastArt" : 1111061,
             "lastArt1" :  1111061
          })
          FETCH_API('getSupplierList')
        }

        const filterFn = (val, update) => {
          if (val === '') {
            update(() => {
              InputSearch[3].options = stringOptions
            })
          }
          if(isNaN(val)){
            NotifyCreate1('input is not a number')
          } else {
            update(() => {
              const needle = val
              InputSearch[3].options = stringOptions.filter(v => v.value.toString().indexOf(needle) > -1)
            })
          }
        }
        
        onMounted(() => {
            FETCH_API('checkPermission', {
                userInit: users.users['userInit'],
                arrayNr: 39,
                expectedNr: 2
            })
        })

        const filterfile = (e) => {
          return e.filter(x => !['Descripion'].includes(x.label))
        }
        
        return {
            ...toRefs(state),
            tableHeaders,
            filterfile,
            filterFn
        }
    },
    components: { 
        SearchIncomingIssuidwithPO: () => import('./components/SearchIncomingIssuidwithPO.vue')
    } 
})
</script>
<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 70vh;

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
