<template>
  <q-dialog v-model="dialogRecipe.openDialog" persistent>
    <q-card style="width: 730px; max-width: 90vw;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Recipe</q-toolbar-title>
      </q-toolbar>
      <q-card-section style="height: auto; marginTop: -10px">
        <div class="row">
          <div class="col">
            <div class="row">
              <div v-if="displacement">
              <SSelect
              :key="col.label" 
              :label-text="col.label"
              @input="onValueChange(true)"
              v-for="col in useInputModal.filter(cols => [
              'Category Number'].includes(cols.label))"
              :options="dialogRecipe.selectCatNo" 
              v-model="col.value"
              :style="{
                width: col.width, 
                marginRight: col.marginRight}"
              :disable="col.disable"
              />
              </div>
              <div v-else>
              <SInput
              :key="col.label"
              v-for="col in useInputModal.filter(cols => [
              'Category Number'].includes(cols.label))"
              :style="{width: col.width, marginRight: col.marginRight}"
              :label-text='col.label'
              v-model="col.value"
              :disable="col.disable"
              @blur="onValueChange(false)"
              />
              </div>
              <SInput
              :key="col.label"
              v-for="col in useInputModal.filter(cols => ![ 
              'Category Number',
              'content', 'Quantity', 'Loss Factor', 
              'Recipe Cost', 'Articel Number'].includes(cols.label))"
              :style="{width: col.width, marginRight: col.marginRight}"
              :label-text="col.label"
              v-model="col.value"
              :disable="col.disable"
              >
              <template v-if="col.label == 'Category Name' " v-slot:append>
                <q-btn v-if="displacement" @click="displacement_input" round dense flat icon="mdi-plus" />
                <q-btn v-else @click="back_input" round dense flat icon="mdi-minus" />
                <q-tooltip 
                  :offset="[10, 10]">
                  <span v-if="displacement">Add New Category</span>
                  <span v-else>Back New Category</span>
                </q-tooltip>
              </template>
              </SInput>
              <SInput
              :key="col.label"
              v-for="col in useInputModal.filter(cols => [
              'Articel Number'].includes(cols.label))"
              :style="{width: col.width, marginRight: col.marginRight}"
              :label-text='col.label'
              @click="onClickAN"
              v-model="col.value"
              :disable="col.disable"
              />
              <SInput
              :key="col.label"
              v-for="col in useInputModal.filter(cols => [
              'content', 'Quantity', 'Loss Factor', 'Recipe Cost'].includes(cols.label))"
              :style="{width: col.width, marginRight: col.marginRight}"
              :label-text="col.label"
              v-model="col.value"
              :disable="col.disable"   
              />
            </div>
            <q-btn
              :style="{marginTop: '-7px', height: '25px', width: '330px'}"
              dense
              icon="mdi-plus"
              color="primary"
              max-height="10"
              label="ADD"
              @click="addDataRecipe"
              size="sm"
            />
          </div>
          <div class="col">
             <STable
             :loading="isLoading"
             :columns="tableDialogRecipe"
             :data="data"
             :rows-per-page-options="[0]"
             :pagination.sync="pagination"
             :hide-bottom="hide_bottom"
             class="table-accounting-date"
             >
              <template #header-cell-fibukonto="props">
                <q-th :props="props" class="fixed-col left">{{ props.col.label }}</q-th>
              </template>
  
              <template #body-cell-fibukonto="props">
                <q-td :props="props" class="fixed-col left">{{ props.row.fibukonto }}</q-td>
              </template>
      
              <template #header-cell-actions="props">
                <q-th style="z-index : 4" :props="props" class="fixed-col right">{{ props.col.label }}</q-th>
              </template>
      
              <template #body-cell-actions="props">
                <q-td :props="props" class="fixed-col right">
                  <q-icon name="mdi-dots-vertical" size="16px">
                    <q-menu auto-close anchor="bottom right" self="top right">
                      <q-list>
                        <q-item clickable v-ripple @click="deleteDataTable(props.row)">
                          <q-item-section>delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </q-td>
              </template>
             </STable>
          </div>
        </div>
        <div class="column items-end">
          <div style="marginTop: -20px; width: 100px; marginLeft: -30px" class="col row">
            <div class="col">
              <span>Total:</span>
            </div>
            <div class="col">
              <span>{{resulTable}}</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn size="sm" @click="onCancel" v-close-popup color="primary" outline label="Cancel" />
        <q-btn
        size="sm" 
        :loading="loading2"
        :disable="disableButtonSave" 
        color="primary" 
        @click="onSaveData" 
        label="OK">
        </q-btn>
      </q-card-actions>
    </q-card>
    <DialogChildRecip 
    :dialogChildRecipe="dialogChildRecipe" 
    @onClickDataAN="onClickDataAN"
    />
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  watch,
  toRefs, 
  onMounted
} from '@vue/composition-api';
import {
  tableDialogRecipe,
  stockArticle,
  Recipe,
  useInputModal
} from '../tables/recipe.table';
import {Notify} from 'quasar'
import { Console } from 'console';
export default defineComponent({
  props: {
    dialogRecipe: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    let articelNumber, resultRecipt, groupRecipe, xi, useFetchDataEdit
    const state = reactive({
      isLoading: false,
      loading2: false,
      hide_bottom: false,
      disableButtonSave: true,
      data: [],
      resulTable: '0',
      displacement: true, 
      dialogChildRecipe: {
        openModalChild: false,
        dataChildRecipe: [] as any
      },
    });

    const NotifyCreate = (mess, col?, type?) => Notify
      .create({
          message: mess,
          color: col,
          group: false,
          type: type
    });

    const SAVE_MODIFY = () => {
      const params = {
        recId: useFetchDataEdit.tHRezept['t-h-rezept'][0]['rec-id'],
        katnr: Number(useInputModal[0].value) ,
        portion: useInputModal[4].value,
        hBezeich: useInputModal[3].value,
        katbezeich: useInputModal[1].value
      }
      FETCH_API('chgRecipeSave', params)
    }

    // FETCH API

    const FETCH_API = async (api, body) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.inventory.FetchAPIINV(api, body),
        $api.inventory.FetchCommon(api, body)
      ])
      switch (api) {
        case 'addRecipeCreateRezlin':
          state.data.push(GET_DATA.sRezlin['s-rezlin'][0])
          state.hide_bottom = true
          if (state.hide_bottom) {
            state.disableButtonSave = false
          }
          break;
          case 'chgRecipeSave':
            if (GET_DATA.outputOkFlag) {
              state.loading2 = true
              setTimeout(()=> {       
              state.data = []
              state.loading2 = false
              NotifyCreate('sukses', 'positive', 'positive')
              },2400)
              emit('addRecipeSave')
            }
          break;
        default:
          if (GET_COMMON.flagOk) {
            SAVE_MODIFY()
          } else {
            NotifyCreate('our Time was expired. :U” (enter) “Another user has modified this record', 'red')
          }
          break;
      }
    }

    const filterDataUseInput = (value) => {
      for(const i in useInputModal.filter(items => [
        'Category Number', 'Category Name',
        'Recipe Number', 'Description', 'Portion']
        .includes(items.label)
      )){
        if (value == 'disable') {
          return useInputModal[i].disable
        } else {
          return useInputModal[i].label
        }
      }
    }

    watch(() => props.dialogRecipe.dataEdit,
      (dataEdit) => {
      useFetchDataEdit = dataEdit
      state.displacement = true
      state.disableButtonSave = false
      useInputModal[0].value = useFetchDataEdit.katnr
      useInputModal[1].value = useFetchDataEdit.katbezeich
      useInputModal[2].value = useFetchDataEdit.tHRezept['t-h-rezept'][0].artnrrezept
      useInputModal[3].value = useFetchDataEdit.hBezeich 
      state.data = useFetchDataEdit.sRezlin['s-rezlin']
      if(useFetchDataEdit.sRezlin['s-rezlin'].length !== 0){
        state.hide_bottom = true
      }
    })

    watch(() => state.data,
    (data) => {
      let y = 0
      for(const i in data){
        const x = data[i].cost
        .toString()
        .substring(0, data[i].cost
        .toString()
        .indexOf('.')+3)
        .replace('.', '')
        y += Number(x)
      }
        const xi = y.toString()
        const z = xi.substring(0, xi.length -2)
        state.resulTable = `${z}.${xi.substring(xi.length -2)}`
    })

    watch(() => props.dialogRecipe.openDialog,
    (open) => {
      state.displacement = true
    })

    const onValueChange = (e) => {
      if (e) {        
        const value = useInputModal[0].value as any
        useInputModal[1].value = value.label
        .substring(value.label.indexOf('-')+2)
        useInputModal[0].value = value.value
        useInputModal[2].value = props.dialogRecipe.max_result + 1
      } else {
        if (props.dialogRecipe.KEY_MODAL == 1) {
          if (useInputModal[0].value !== '') {
            useInputModal[2].value = props.dialogRecipe.max_result + 1
          } else {
            useInputModal[2].value = ''
          }
        }
      }
    } 

    const onClickAN = () => {
      state.dialogChildRecipe.openModalChild = true
    }

    const onClickDataAN = (dataRow, group) => {
      state.dialogChildRecipe.openModalChild = false 
      articelNumber = dataRow
      groupRecipe = group
      if (dataRow.artnr) {
        useInputModal[9].value = dataRow.artnr
        useInputModal[5].value = dataRow.herkunft
      } else {
        xi = dataRow.artnrrezept
        let result = '0'
        for (let i = 0; i < 6-xi.
        toString().length; i++) {
          result += '0'
        }
        resultRecipt = `${result}${xi}`
        useInputModal[9].value = `${result}${xi}`
      }
    }

    const addDataRecipe = () => {
      if (filterDataUseInput('label') && filterDataUseInput('disable')) {
        let dataKey, dataKey1
          for(const i in state.data){
            if (articelNumber.artnr) {
              if (state.data[i].artnr == articelNumber.artnr) {
                NotifyCreate('Article already selected!', 'red')
                dataKey = state.data[i].artnr
              }
            } else {
              if (state.data[i].artnr == xi) {
                NotifyCreate('Article already selected!', 'red')
                dataKey1 = state.data[i].artnr
              }
            }
          }
          if (articelNumber.artnr) {            
            if(dataKey !== articelNumber.artnr){
              const data = {
                "sArtnr" : articelNumber.artnr,
                "qty" : useInputModal[6].value,
                "recipetype" : parseInt(groupRecipe),
                "price-type" : 0,
                "DESCRIPT" : articelNumber.bezeich,
                "inhalt" :  articelNumber.inhalt,
                "lostfact" : useInputModal[7].value,
                "vk-preis" : articelNumber['vk-preis']
              }
              FETCH_API('addRecipeCreateRezlin', data)
              for(const i in useInputModal)
              {
                if (!useInputModal[i].disable) {
                  useInputModal[i].value = ''
                }
              }
                useInputModal[5].value = ''
            }
          } else {
            if(dataKey1 !== useInputModal[9].value){
              const data = {
                "sArtnr" : xi,
                  "DESCRIPT" : articelNumber.bezeich1,
                  "qty" : useInputModal[6].value,
                  "recipetype" : parseInt(groupRecipe),
                  "price-type" : 0,
                  "inhalt" :  '',
                  "lostfact" : useInputModal[7].value,
                  "vk-preis" : ''
                }
              FETCH_API('addRecipeCreateRezlin', data)
                for(const i in useInputModal)
                {
                  if (!useInputModal[i].disable) {
                  useInputModal[i].value = ''
                  }
                }
                  useInputModal[5].value = ''
              }
          }
      } else {
          if (
            useInputModal[1].value == '' || 
            useInputModal[0].value == null){
            NotifyCreate('Recipe category / name not yet defined', 'red')
          } else if (useInputModal[2].value == '' || useInputModal[3].value == '') {
            NotifyCreate('Recipe number / name not yet defined', 'red')
          } else {
              for(const i in useInputModal){
                if (['Category Number', 'Category Name', 
                    'Recipe Number', 'Description', 'Portion', 'content']
                    .includes(useInputModal[i].label)) {
                  useInputModal[i].disable = true
                } else {
                  useInputModal[i].disable = false
                }
              }
          }
      }
    }

    const deleteDataTable = (dataRow) => {
      state.data = state.data.filter(items => {
        return items.artnr !== dataRow.artnr
      })
      if (state.data.length == 0) {
          state.hide_bottom = false
      }
    }

    const onSaveData = () => {
      if (props.dialogRecipe.KEY_MODAL == 1) {      
        const data = {
          "hArtnr" : useInputModal[2].value,
          "hBezeich": useInputModal[3].value,
          "katbezeich": useInputModal[1].value,
          "katnr" :Number(useInputModal[0].value),
          "portion" : useInputModal[4].value,
          "sRezlin": {
            's-Rezlin': state.data
          }
        }
        FETCH_API('addRecipeSave', data)
        state.loading2 = true
        setTimeout(()=> {       
        state.data = []
        state.loading2 = false
        NotifyCreate('sukses', 'positive', 'positive')
        },2400)
        emit('addRecipeSave')
      } else {
        const params = {
          caseType: 3,
          idTable: useInputModal[2].value,
          idTable1: '?',
          nameTable: 'h-rezept',
          initTime2: useFetchDataEdit.initTime,
          initDate2: useFetchDataEdit.initDate
        }
        FETCH_API('checkTime', params)
      }
    }

    const onCancel = () => {
      state.data = []
    }

    const displacement_input = () => {
      state.displacement = false
      if (props.dialogRecipe.KEY_MODAL == 1) {        
        useInputModal[0].value = ''
        useInputModal[1].value = ''
        useInputModal[2].value = ''
      }
    }
    const back_input = () => {
      state.displacement = true
      if (props.dialogRecipe.KEY_MODAL == 1) {        
        useInputModal[0].value =''
        useInputModal[1].value =''
        useInputModal[2].value =''
      }
    }

    return {
      onClickAN,
      onSaveData,
      onCancel,
      onValueChange,
      displacement_input,
      back_input,
      onClickDataAN,
      deleteDataTable,
      useInputModal,
      addDataRecipe,
      tableDialogRecipe,
      ...toRefs(state),
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },

  components: {
    DialogChildRecip: () => import('./DialogChildRecip.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

::v-deep .table-accounting-date {
  max-height: 45vh;

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
