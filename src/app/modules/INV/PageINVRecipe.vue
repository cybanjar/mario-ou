<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <SearchChartOfAccounts @onSearch="onSearch" />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn @click="onClickDialog" flat round class="q-mr-lg">
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
        :loading="isFetching"
        :columns="tableHeaders"
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
              <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                <q-list :props="props">
                  <q-item :props="props" @click="onClickEdit(props.row)" clickable v-ripple>
                    <q-item-section>edit</q-item-section>
                  </q-item>
                  <q-item @click="deleteDataRow(props.row)" clickable v-ripple>
                    <q-item-section>delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
      </STable>
    </div>
    <DialogChartOfAccounts
    :dialogRecipe="dialogRecipe"
    @addRecipeSave="addRecipeSave"
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
import { tableHeaders, useInputModal } from './tables/recipe.table';
import {Notify} from 'quasar'
import {DATA_RECIPE} from './utils/params.recipe'
export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts, dataRowDelete
    const state = reactive({
      isFetching: false,
      hide_bottom: false,
      data: [] as any,
      dialogRecipe: {
        openDialog: false,
        selectCatNo: [],
        dataChildRecipe: [],
        dataEdit : [],
        max_result: 0,
        KEY_MODAL : 0
      },
    });

    // Helpers 

    const NotifyCreate = (mess, col?, type?) => Notify
      .create({
          message: mess,
          color: col,
          type: type,
    });
    const NotifyCreate1 = (mess, col?, type?) => Notify
      .create({
          message: mess,
          position: 'center',
          type: type,
          timeout: 0,
          actions: [
            { label: 'Cencel', color: 'white', handler: () => { 
              state.dialogRecipe.openDialog = false} }
          ],
    });
    const NotifyCreate2 = (mess, col?) => Notify
      .create({
        message: mess,
        color: 'primary',
        timeout: 0,
        position: 'center',
        actions: [
          { label: 'Cencel', color: 'white', handler: () => { /* ... */ } },
          { label: 'Ok', color: 'white', handler: () => {
            FETCH_API('recipeListDelete', {
              tHRezeptArtnrrezept: dataRowDelete.artnrrezept
            })
          }}
        ]
    });
    const sortData = (charts, params) => {
      if (params == 'bezeich1') {
        return charts.sort((a, b) => {
          const ab = a[params].toLowerCase()
          const bc = b[params].toLowerCase()
          if(ab < bc){
            return -1
          }
        })
      } else {
        return charts
        .sort((a, b) => a[params] - b[params])
      } 
      
    }
    const filterData = (charts, value, params) => {
      return charts.filter(items => {
        if (isNaN(value.inputan)) {            
          return items.bezeich1.toLowerCase()
          .includes(value.inputan.toLowerCase())
        } else {
          return items[params].toString()
          .includes(value.inputan)
        }})
    }
    const mapSelect = (GET_DATA) => {
      const data = GET_DATA.recipe.recipe
      return data.map(items => ({
        label : `${items.katno} - ${items.bezeich}`,
        value : items.katno
      }))
    }

    // Fetch API

    const FETCH_API = async (api, body?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.inventory.FetchAPIINV(api, body), 
        $api.inventory.FetchCommon(api, body)
        ])
        switch (api) {
          case 'recipeListPrepare':
            charts = DATA_RECIPE(GET_DATA)
              state.data = charts
              if (charts.length !== 0) {
                state.hide_bottom = true
              }
              let x = []
              for(const i in charts){
                x.push(charts[i].artnrrezept)
              }
              state.dialogRecipe.max_result = Math.max(...x)
              break;
          case 'recipeSelect':
            const data = mapSelect(GET_DATA)
            state.dialogRecipe.selectCatNo = data
            break;
          case 'checkPermission':
            if (GET_COMMON.zugriff) {
              DELETE_DATA(true)
            } else {
              NotifyCreate('Access denied, can not delete', 'red')
            }
            break;
          case 'recipeListDelCheck':
            if (GET_DATA.msgStr == '') {
              NotifyCreate2(`Do you really want to delete ${dataRowDelete.artnrrezept} ${dataRowDelete.bezeich1}`)
            } else {
              NotifyCreate(GET_DATA.msgStr, 'red')
            }
          break;
          case 'recipeListDelete':
            DELETE_DATA(false)
            break;
          default:
            if (GET_DATA.hBezeich !== '' && GET_DATA.katnr !== 0) {
                state.dialogRecipe.dataEdit = GET_DATA
            } else {
              NotifyCreate1('this record is being modifed by oher user', 'white', 'negative')
            }
            break;
        }
    }

    // Function

    onMounted(() => {
        FETCH_API('recipeListPrepare')
        FETCH_API('recipeSelect')
    });

    const DELETE_DATA = (val) => {
      if (val) {        
        const data = {
          pvILanguage: 1,
          tHRezeptArtnrrezept: dataRowDelete.artnrrezept
        }
        FETCH_API('recipeListDelCheck', data)
      } else {
        FETCH_API('recipeListPrepare')
      }
    }

    const onSearch = (value) => {
      if (value.group == '1') {
        if (value.inputan == null || value.inputan == '') {
          state.data = sortData(charts, 'artnrrezept')
        } else {
          if (!isNaN(value.inputan)) {                    
            const x = filterData(charts, value, 'artnrrezept')
            if (x.length !== 0) {
              state.data = x
            } else {
              NotifyCreate('Data Not Found', 'red')
            }
          } else {
            NotifyCreate('this is not a number', 'red')
          }
        }
      } else if(value.group == '2'){
        if (value.inputan == null || value.inputan == '') {
          state.data = sortData(charts, 'bezeich1')
        } else {
          const x = filterData(charts, value, 'bezeich1')
          if(x.length !== 0){
            state.data = x
          } else {
            NotifyCreate('Data Not Found', 'red')
          }
        }
      } else {
        if (value.inputan == null || value.inputan == '') {
          state.data = sortData(charts, 'kategorie')
        } else {
          if (!isNaN(value.inputan)) {
            const x = filterData(charts, value, 'kategorie')
            if(x.length !== 0){
              state.data = x
            } else {
              NotifyCreate('Data Not Found', 'red')
            }
          } else {
            NotifyCreate('this is not a number', 'red')
          }
        }
      }
    };

    const x1 = useInputModal.filter(items => ['Category Number',
    'Description', 'Category Name'].includes(items.label)
    )
    const x2 = useInputModal.filter(items => [
    'Articel Number', 'Recipe Cost',
    'Loss Factor', 'Quantity', 'content',
    'Recipe Number'].includes(items.label)
    )

    const xii = () => {
      for(const i in x1){
        x1[i].disable = false
        x1[i].value = ''
      }
      for(const i in x2){
        x2[i].disable = true
        x2[i].value = ''
      }
      useInputModal[4].value = '1'
      useInputModal[4].disable = false
    }

    const onClickDialog = () => {
      state.dialogRecipe.openDialog = true
      state.dialogRecipe.KEY_MODAL = 1
      xii()
    }

    const onClickEdit = (onRowData) => {
      state.dialogRecipe.openDialog = true
      state.dialogRecipe.KEY_MODAL = 2
      xii()
      FETCH_API('chgRecipePrepare', {
        "hArtnr" : onRowData.artnrrezept,
        "DESCRIPTION" : onRowData.bezeich1.trim()
      })
    }

    const addRecipeSave = () => {
      FETCH_API('recipeListPrepare')
      setTimeout(() => {
        state.dialogRecipe.openDialog = false
      },2000)
    }

    const deleteDataRow = (dataRow) => {
      const data = {
        "expectedNr": "2",
		    "arrayNr": "53",
		    "userInit": "01"
      }
      dataRowDelete = dataRow
      FETCH_API('checkPermission', data)
    }


    // const deleteData = async () => {
    //   await Promise.all([
    //     $api.inventory.FetchAPIINV('recipeListDelCheck', {
    //       pvILanguage: 1,
    //       ['t-h-rezept-artnrrezept']: 'Recipe Number',
    //     }),
    //   ]);
    // };

    return {
      ...toRefs(state),
      onSearch,
      addRecipeSave,
      onClickDialog,
      deleteDataRow,
      onClickEdit,
      tableHeaders,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    SearchChartOfAccounts: () => import('./components/SearchRecipe.vue'),
    DialogChartOfAccounts: () => import('./components/DialogRecipe.vue'),
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
