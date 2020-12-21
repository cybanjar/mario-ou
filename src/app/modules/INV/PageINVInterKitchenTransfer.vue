<template>
  <div>
    <div class="column justify-between">
      <div class="col-7" style="height: 570px">
        <q-drawer :value="true" side="left" bordered :width="220" persistent>
          <SearchInterKitchenTf :searches="searches" @add="add"/>
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
            :hide-bottom="hide_bottom"
            class="table-accounting-date"
            flat bordered
          />
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
              unelevated
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
import {tableHeaders, use_input} from './tables/InterKitchenTransfer'
import {dataToDepartement} from './utils/params.interkitchen'
import {users} from './utils/store'
import {Notify} from 'quasar'
export default defineComponent({
    setup(_, { root: { $api } }) {
        const state = reactive({
          data1: dataToDepartement,
          hide_bottom: false,
          data: [],
          searches: {
            use_input,
            art: '0'
          }
        });

        const NotifyCreate = (message) => Notify.create({
          message: message,
          type: 'negative',
          position: 'top',
          textColor: 'white',
          timeout: 2000,
        });

        const add = (value) => {
          const x = use_input
          const xi = value.searches.use_input
          const y = ['art', 'des', 'price', 'amount']
          if (false){
            NotifyCreate('Sorry, no access right')
          } else if (
          x[1].value == '' ||
          x[2].value == '' ||
          x[3].value == '' ||
          x[4].value == '') {
            NotifyCreate('input undeined')
          } else {
            let am = 0
            state.data.push(Object.assign(
            xi[3].value, xi[4] ))
            for(const i of state.data){
              am += Number(i.amount)
            }
            state.searches.art = am.toString()+'.000'
            if (state.data.length !== 0) {
              state.hide_bottom = true
            }
            x[3].value = ''
            x[4].value = ''
          }
        }
        
        
        return {
            ...toRefs(state),
            add,
            tableHeaders,
            pagination: {
              rowsPerPage: 0,
            },
        }
    },
    components: {
      SearchInterKitchenTf: () => import('./components/SearchInterKitchenTf.vue'),
    },
})
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
