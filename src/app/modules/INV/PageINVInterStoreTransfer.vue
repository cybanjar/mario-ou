<template>
    <div>
        <div class="column justify-between">
            <div class="col-7" style="height: 570px">
                <q-drawer 
                :value="true"
                side="left" 
                bordered :width="360" 
                persistent>
                    <SearchInterStore :searches="searches" @ADD="ADD"/>
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
                              autofocus
                              dense 
                              borderless 
                              v-model="qty" />
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
import {use_input, tableHeaders} from './tables/InterStoreTf'
import {dataTable} from './utils/Params.InterStoreTf'
import {Notify} from 'quasar'
export default defineComponent({
    setup(_, { root: { $api } }) {
         const state = reactive({
            searches : {
                use_input,
                totalPrice: '0'
            },
            data: [],
            hide_bottom: false,
            qtyModify: null,
            qty: '',
         })
          const NotifyCreate = (mess, col?, position?,) => Notify.create({
              message: mess,
              color: col,
              position
            });

        const ADD = (value) => {
            const x = value.searches.use_input
            if(x[3].value !== '' && x[4].value !== ''){
                if (Number(x[4].value) <= x[3].value.qty && 
                    Number(x[4].value) !== 0) {                    
                    state.data.push(dataTable(
                        Object.assign(x[3].value, x[4]))
                    )
                    let xi = 0
                    for(const i of state.data){
                        xi += Number(i.price)
                    }
                    state.searches.totalPrice = xi.toString()+'.000'
                    x[3].value = ''
                    x[4].value = ''
                    if(state.data.length !== 0){
                        state.hide_bottom = true
                    }
                } else {
                     NotifyCreate('Wrong quantity', 'red', 'top')
                }
            } else {
                NotifyCreate('please fill in Articel Number / Quantiy', 'red', 'top')
            }
        }

        const blurQTY = (val) => {
          state.qtyModify = null
          val.qty = state.qty
        }
        const onClickEdit = (dataRow) => {
          state.qtyModify = dataRow.pageIndex
          state.qty = dataRow.row.qty
        }
        const deleteDataRow = (dataRow) => {
          state.data = state.data.filter((x, i) => {
             return x.artNumber !== dataRow.artNumber
          })
          if(state.data.length == 0){
              state.hide_bottom = false
          }
        }

        const saveReturn = () => {
            if(use_input[1].value !== '' &&
            use_input[2].value !== ''){
                NotifyCreate('Sorry, no access righ', 'red', 'top')
            } else {
                NotifyCreate('please fill in From Store /To Store', 'red', 'top')
            }
         
        }
        return {
            ...toRefs(state),
            tableHeaders,
            ADD,
            onClickEdit,
            blurQTY,
            deleteDataRow,
            saveReturn,
            pagination: {
              rowsPerPage: 0,
            },
        }
    },
    components: {
        SearchInterStore: () => import('./components/SearchInterStoreTf.vue')
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