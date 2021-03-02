<template>
  <q-dialog v-model="dialogChildRecipe.openModalChild" persistent>
    <q-card style="width: 650px; max-width: 90vw;">
       <q-toolbar>
           <q-toolbar-title 
           class="text-white text-weight-medium">
              Recipe
           </q-toolbar-title>
       </q-toolbar>
       <q-card-section>
         <div class="row">
           <div class="col-3">
             <q-card class="my-card" flat bordered style="width: 130px">
               <q-card-section horizontal>
                 <q-option-group 
                  inline
                  size="xs" 
                  v-model="group" 
                  :options="options" color="primary"
                 />
                </q-card-section>
              </q-card>
             <SInput 
              label-text="Description" 
              style="width: 130px; marginTop: 15px" 
              v-model="filterDes" 
              :disable="sort_value == '1'? true: false"
              unmasked-value />
              <div style="marginTop: -10px; marginLeft: -9px" >
                <q-option-group 
                 inline
                 size="xs" 
                 v-model="sort_value" 
                 :options="sort_data" color="primary"
                />
              </div>
             <q-btn
              color="primary"
              size="sm"
              label="search"
              style="width: 130px; marginTop: 5px"
              @click="onClickSort"
             />
           </div>
           <div class="col-9">
              <STable
                v-if="group == '1'"
                :loading="isFetching1"
                :columns="columns1"
                :data="data1"
                :rows-per-page-options="[0]"
                :pagination.sync="pagination"
                :hide-bottom="hide_bottom"
                class="table-accounting-date"
              >
               <template v-slot:body="props">
                 <q-tr :props="props" @click="selection(props.row)" 
                  :class="{
                    selected : props.row.selected
                  }">
                  <q-td :props="props" key="artnr">
                      {{props.row.artnr}}
                  </q-td>
                  <q-td :props="props" key="bezeich">
                      <span v-if="props.row.bezeich.length < 10">
                        {{props.row.bezeich}}
                      </span>
                      <span v-else>
                        {{props.row.bezeich.substring(0, 10) + '...'}}
                        <q-tooltip 
                        content-class="bg-indigo" 
                        :offset="[10, 10]">
                          {{props.row.bezeich}}
                        </q-tooltip>
                      </span>
                  </q-td>
                   <q-td 
                   :props="props" 
                    v-for="col in props.cols.filter(col =>![
                       'artnr', 'bezeich'].includes(col.name))" :key="col.name">
                     {{col.value}}
                   </q-td>
                 </q-tr>
               </template>
              </STable>
              <STable
              v-else
              :loading="isFetching"
              :columns="columns2"
              :data="data2"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination"
              :hide-bottom="hide_bottom"
              class="table-accounting-date"
              >
              <template v-slot:body="props">
                <q-tr :props="props" @click="selection(props.row)" 
                :class="{
                  selected : props.row.selected
                }">
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
       </q-card-section>
        <q-separator />
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn size="sm" v-close-popup color="primary" outline label="Cancel" />
        <q-btn size="sm" color="primary" @click="onClickDataAN" label="OK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  onMounted,
} from '@vue/composition-api';
import {stockArticle, Recipe} from '../tables/recipe.table'
import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
import { dataRepetitionRecipe, dataRepetitionArticelNumber } from '../utils/params.recipe'
import {Notify} from 'quasar'
export default defineComponent({
    props: {
        dialogChildRecipe: { type: Object, required: true },
    },
    setup(props,{emit, root: { $api }}){
    let dataRecipe, dataChild 

      const state = reactive({
        dialog: true,
        group: '1',
        sort_value: '1',
        isFetching1: false,
        isFetching: false,
        columns1: [],
        data1: [],
        columns2: [],
        data2: [],
        hide_bottom: false,
        filterDes: '',
        sort_data: [
          {
            label: 'Recipe Number',
            value: '1',
          },
          {
            label: 'Description',
            value: '2',
          },
        ],
        options: [
          {
            label: 'Stock Article',
            value: '1',
          },
          {
            label: 'Recipe',
            value: '2',
          },
        ],
      })

    const NotifyCreate = (mess, col?) => Notify
      .create({
          message: mess,
          color: col,
          group: false
    });

    //   FETCH_API

    const FETCH_API = async (api, body?) => {
        const GET_DATA = await $api.inventory.FetchAPIINV(api, body)
        dataRecipe = GET_DATA
        state.isFetching1 = false
        setTimeout(() => {
          state.data1 = dataRepetitionArticelNumber(dataRecipe.tLArtikel['t-l-artikel'])
        }, 1000)
    }

    onMounted(() => {
      state.columns1 = stockArticle
    })

    watch(() => props.dialogChildRecipe.openModalChild, 
    (openModalChild) => {
      if(openModalChild){
      state.isFetching1 = false
      state.group = '1'
      state.data1 = []
      state.data2 = []
      FETCH_API('addRecipePrepare')
      }
    })

    const onClickSort = () => {
      const data = dataRepetitionArticelNumber(dataRecipe.tLArtikel['t-l-artikel'])
      const data1 = dataRepetitionRecipe(dataRecipe.tHRezept['t-h-rezept'])     
      const y1 = state.group == '1' ? data : data1      
      const y2 = state.group == '1' ? 'bezeich' :'bezeich1' 
      const y3 = state.group == '1' ? 'artnr' :'artnrrezept' 
        if (state.filterDes !== '') {
            const x = y1.filter(items => {
              return items[y2].toLowerCase().includes(state.filterDes.toLowerCase())
            })
            if (x.length !== 0) {
              if(state.group == '1'){
                state.data1 = x
              } else {
                state.data2 = x
              }
            } else {
              NotifyCreate('data not found', 'red')
            }
        } else {
          if (state.sort_value == '1') {
            const x = y1.sort((a, b) => {
              return a.y3 - b.y3
            })
            if(state.group == '1'){
              state.data1 = x
            } else {
              state.data2 = x
            }
          } else {
            const x = y1.sort((a, b) => {
              const ab = a[y2].toLowerCase()
              const bc = b[y2].toLowerCase()
              if(ab < bc){
                return -1
              }
            })
            if(state.group == '1'){
              state.data1 = x
            } else {
              state.data2 = x
            }
          }
        }
    }


      watch(() => state.group,
      (group) => {
          if (group == '1') {
            state.columns2 = []
            state.data2 = []
            state.columns1 = stockArticle
            state.isFetching1 = false
            setTimeout(() => {
              state.data1 = dataRepetitionArticelNumber(dataRecipe.tLArtikel['t-l-artikel'])
              state.isFetching1 = false
            },2000)
          } else {
            state.columns1 = []
            state.data1 = []
            state.columns2 = Recipe
            state.isFetching = false
            setTimeout(()=> {
              state.isFetching = false
              state.data2 = dataRepetitionRecipe(dataRecipe.tHRezept['t-h-rezept'])
            },2000)
          }
      })

    const selection = (dataRow) => {  
      for(const i in state.data1){
        state.data1[i]['selected'] = false
      }
      for(const i in state.data2){
        state.data2[i]['selected'] = false
      }
      dataRow['selected'] = true;
      dataChild = dataRow
    }

    const onClickDataAN = () => {
        emit('onClickDataAN', dataChild, state.group)
    }

    return {
     selection,
     onClickDataAN,
     onClickSort,
     pagination: {
         rowsPerPage: 0,
      },
     ...toRefs(state),
    }
    }
})
</script>


<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 40vh;

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
  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }

</style>