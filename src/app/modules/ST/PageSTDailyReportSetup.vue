<template>
    <div style="margin: 20px">
        <div class="q-mb-md">
          <q-btn flat round class="q-mr-lg">
            <img :src="require('~/app/icons/Icon-Add.svg')" height="25" @click="onAdd" />
          </q-btn>
          <q-btn flat round class="q-mr-lg">
            <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
          </q-btn>
          <q-btn flat round>
            <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
          </q-btn>
        </div>
        <SearchDailyReportSetup :colors="colors"/>
        <STable
          :loading="isFetching"
          :columns="tableHeaders"
          :data="data"
          :rows-per-page-options="[0]"
          :hide-bottom="hide_bottom"
          class="table-accounting-date"
          style="marginTop: 20px"
        >
          <template v-slot:header="props">
            <q-tr style="height: 40px" :props="props">
              <q-th
              :props="props"
              v-for="col in props.cols"
              :key="col.name"
              :style="col.style"
              >
                  {{col.label}}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr 
              :props="props" 
              @click="onRowClick(props.row)" 
              :class="{
                selected : props.row.selected
              }"
            >
             <q-td 
             :key="col.name" 
             :props="props" 
             v-for="col in props.cols.filter(x => ![
              'actions'].includes(x.name))">
                {{col.value}} 
             </q-td>
              <q-td :props="props" 
                key="actions">
                <q-icon name="mdi-dots-vertical" size="16px">
                  <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                    <q-list :props="props">
                      <q-item :props="props" @click="onClickEdit" clickable v-ripple>
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item @click="deleteDataRow(props.row)" clickable v-ripple>
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-td>
            </q-tr>
          </template>
        </STable>
      <CheckPermission :dialogConfirm="dialogConfirm"/>
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { store } from '~/store';
import {tableHeaders} from './tables/DayilyReportSetup.table'
import { use_input, table_input, dataTable, ChCol} from './utils/DailyReportSetup'
import {Notify} from 'quasar'
// import CryptoJS from 'crypto-js'
import { item } from '../INV/LayoutMainHeader';
import SheetJS from 'xlsx';

export default defineComponent({
    setup(_, { root: { $api } }) {
        const prepareInput = ['briefnr', 'kateg']
        let onEdit
        const state = reactive({
          data: [],
          isFetching: false,
          hide_bottom: false,
          colors: 'grey',
          vhpwords: 'grey',
          dialogConfirm: {
            confirm: false,
            message: ''
          },
          dialogDelete: {
            confirm: false,
            message: '',
            briefkateg: 0,
            isLoading: false
          },
          dialogVHPWords: {
            confirm: false,
            editor: ''
          }
        });

        const NotifyCreate = (message) => Notify.create({
          message: message,
          type: 'negative',
          position: 'top',
          textColor: 'white',
          timeout: 2000,
        });

        // API

        const FETCH_API = async (api, body?) => {
          const [GET_DATA, GET_DATA2 ] = await Promise.all([
            $api.systemsetting.FetchCommon(api, body),
            $api.systemsetting.FetchAPIST(api,body)
          ])
          switch (api) {
            case 'checkPermission':
              if (GET_DATA.zugriff == 'false') {
                state.dialogConfirm.confirm = true
                state.dialogConfirm.message = GET_DATA.messStr
              }
              break;

            case 'foWordadminBtnExit': 
            if (GET_DATA2.successFlag == 'true') {
              setTimeout(() => {
                state.isFetching = false
                state.colors = 'grey'
                getGuestbook()
                onRefresh()
              },1000)
            }
              break;
            case 'foWordadminBtnDel':
              setTimeout(() => {
                state.dialogDelete.isLoading = false
                state.dialogDelete.confirm = false
                onRefresh()
              },1000)
              break;
            case 'deleteBriefzei':
              
              break;
            case 'foWordviPrepare':
              state.dialogVHPWords.editor = GET_DATA2.tBriefzei['t-briefzei'][0]['texte'].replace(/\n/g,'<br/>');
              break;
            default:
              for(const items in prepareInput){
                use_input[items].value = GET_DATA2[prepareInput[items]]
              }
              state.data = dataTable(GET_DATA2.tBrief['t-brief'])
              if (state.data.length !== 0) {
                state.hide_bottom = true
              }
              break;
          }
        }

        const onRowClick = (datarow) => {
          let disable
          onEdit = datarow
          for(const items of use_input.filter(x => ![
            'File Number', 'Category'
          ].includes(x.label))) {
            if (items.disable) {
              disable = true
              state.vhpwords = 'primary'
            } else {
              disable = false
            }
          }
          if (disable) {            
            for(const i of state.data){
              i.selected = false
            }
            datarow['selected'] = true; 
            for(const index in table_input){
              use_input[index].value = datarow[table_input[index]]
            }
          }
        }

        const onRefresh = () => {
          FETCH_API('foWordadmin')
          state.vhpwords = 'grey'
          for(const items of use_input){
            items.value = ''
            items.disable = true
          }
        }

        onMounted(() => {
          // const tmp = SheetJS.readFile('E:\\Michael\\ZinFInancialNew.xls', {type: 'binary'});
          // const tmp2 = atob(String(tmp));
          // console.log('BLAH', tmp2);
          
          const { userInit } = store.state.auth.user;
          FETCH_API('checkPermission', {
            userInit: userInit,
            arrayNr: 6,
            expectedNr: 2
          })
          onRefresh()
          // const xi = SheetJS.readFile('C:\\Users\\Anita\\Downloads\\Daily Report(1).xlsx')
          const workbook = SheetJS.read('C:\\Users\\Anita/Downloads/Daily Report.xlsx',  {
            type: 'binary'
          })
          
          console.log('sukses', workbook);
        })

        // TRIGER ADD, EDIT, DELETE

        const onAdd = () => {
          if (state.colors != 'primary') {
            FETCH_API('foWordadmin')
            for(const items of use_input.filter(x => ![
               'File Number', 'Category'
             ].includes(x.label))) {
               items.disable = false
               items.value = ''
             }
             state.colors = 'primary'
             state.vhpwords = 'grey'
          }
        }
        const onClickEdit = () => {
          for(const items of use_input.filter(x => ![
            'File Number', 'Category'
          ].includes(x.label))) {
            items.disable = false
          }
          state.colors = 'primary'
        }
        const onCancel = () => {
          let selected
          for(const items of state.data){
            if (items.selected) {
              selected = items.selected
            }
          }
          for(const items of use_input.filter(x => ![
            'File Number', 'Category'
          ].includes(x.label))) {
            items.disable = true
            if (selected == undefined) {
              items.value = ''
            }
          }
          state.colors = 'grey'
        }

        const deleteDataRow = (row) => {
          if (state.colors != 'primary') {
            state.dialogDelete.confirm = true
            state.dialogDelete.message = `Do you really want to DELETE the Letter<br/>${row['briefkateg']} - ${row['briefbezeich']}?`,
            state.dialogDelete.briefkateg = row['briefnr']
          }
        }

        // ADD, EDIT, DELETE

        const onSave = () => {
          // const hash = CryptoJS.enc.Base64.parse('irfan nurzaman').toString()
          // console.log('sukses', hash);
          
          let selected
          for(const items of state.data){
            if (items.selected) {
              selected = items.selected
            }
          }
          if (use_input[5].value == '') {
            NotifyCreate(`Letter's description not yet defined`)
          } else if (use_input[2].value == '') {
            NotifyCreate(`File does not exist`)
          } else {
            if (selected) {
              let validate = []
              const filterdata = state.data.filter(item => 
              item.briefbezeich !== onEdit['briefbezeich'])
              for(const item of filterdata){
                validate.push(item['briefbezeich'])
              }
              if (validate.includes(use_input[5].value)) {
                NotifyCreate('Other Letter with the same description exist')
              } else {
                let keyColumn 
                state.isFetching = true
                ChCol.filter((items,index)=>{
                  if (items == use_input[3].value.toUpperCase()) {
                    keyColumn = index
                  }
                })
                FETCH_API('foWordadminBtnExit', {
                  "tBrief": {
		              	"t-brief": [{
		              		"briefnr": use_input[0].value,
		              		"briefkateg": use_input[1].value,
		              		"briefbezeich": use_input[5].value,
		              		"sprachcode": 1,
		              		"tabulator": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		              		"fname": use_input[6].value,
		              		"ftyp": keyColumn+1,
		              		"etk-anzahl": use_input[4].value,
		              		"betriebsnr": 0
		              	}]
		              },
		              "caseType": 2,
		              "lastColumn": use_input[3].value.toUpperCase(),
		              "kateg": 15
                })
              }
            } else {
              let keyColumn 
              state.isFetching = true
              ChCol.filter((items,index)=>{
                if (items == use_input[3].value.toUpperCase()) {
                  keyColumn = index
                }
              })
                FETCH_API('foWordadminBtnExit', {
                  "tBrief": {
		              	"t-brief": [{
		              		"briefnr": use_input[0].value,
		              		"briefkateg": use_input[1].value,
		              		"briefbezeich": use_input[5].value,
		              		"sprachcode": 1,
		              		"tabulator": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		              		"fname": use_input[6].value,
		              		"ftyp": keyColumn+1,
		              		"etk-anzahl": use_input[4].value,
		              		"betriebsnr": 0
		              	}]
		              },
		              "caseType": 1,
		              "lastColumn": use_input[3].value.toUpperCase(),
		              "kateg": 15
                })
            }
          }
        }

        const getGuestbook = () => {
          FETCH_API('getGuestbook', {
            inStr: 1,
            tData: {
              't-data': [
                {
                  gastnr: Number('-200000'+ use_input[0].value),
                  infostr: use_input[2].value,
                  // 'orig-infostr': CryptoJS.MD5(use_input[2].value).toString()
                }
              ]
            }
          })
        }

        const onClickDelete = (row) => {
          state.dialogDelete.isLoading = true
          FETCH_API('foWordadminBtnDel', {
            "briefnr" : row['briefkateg'], 
            "int1": row['briefkateg']
          })
        }
        const onClickCancel = (row) => {
          FETCH_API('deleteBriefzei', {
            "caseType" : 1,
            "int1" :  row['briefkateg'],
            "int2" : 1
          })
        }

        // VHP Words

        const vhpWords = () => {
          if (state.vhpwords == 'primary') {
            state.dialogVHPWords.confirm = true
            FETCH_API('foWordviPrepare', {
              briefnr: onEdit['briefnr']
            })
          }
        }

        const onOke = () => {
          state.dialogVHPWords.confirm = false
          state.dialogVHPWords.editor = ''
        }

        // Load Macro
        const loadMacro = () => {
          console.log('sukses', use_input[2].value);
          
        }
        
        return {
            ...toRefs(state),
            tableHeaders,
            onRowClick,
            onAdd,
            onClickEdit,
            onCancel,
            onSave,
            deleteDataRow,
            onClickDelete,
            onClickCancel,
            vhpWords,
            onOke,
            loadMacro
        }
    },
    components: {
        SearchDailyReportSetup: () => import('./components/SearchDailyReportSetup.vue'),
        CheckPermission: () => import('./components/DialogCheckPermission.vue'),
        DialogDelte: () => import('./components/DialogDelete.vue'),
        VHPWords: () => import('./components/VHPWords.vue')
    }
})
</script>
<style lang="scss" scoped>
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>

