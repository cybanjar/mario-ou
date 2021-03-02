<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="235" persistent>
    <SearchCompetotorStaticEntry @onSearch="onSearch" :stateData="stateData"/>
    </q-drawer>
    <div class="q-pa-lg">
      <div class="row justify-between">
        <div class="q-mb-md">
          <q-btn v-if="!stateData"  @click="onClickDialog" flat round class="q-mr-lg">
            <img :src="require('~/app/icons/Icon-AddCompetitor.svg')" height="25" />
          </q-btn>
          <q-btn v-else flat round class="q-mr-lg">
            <img :src="require('~/app/icons/Icon-AddCompetitorDisable.svg')" height="25" />
          </q-btn>
          <q-btn @click="onModify" flat round class="q-mr-lg">
            <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
          </q-btn>
          <q-btn flat round class="q-mr-lg">
            <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
          </q-btn>
        </div>
        <div v-if="stateData" style="marginTop: 15px">
          <q-btn 
            style="marginRight: 20px; width: 100px" unelevated size="sm" 
            @click="onCancel" 
            color="primary" outline label="Cancel" />
          <q-btn style="width: 100px" unelevated size="sm" color="primary" @click="onClickSave" label="save" />
        </div>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="!stateData? data : data2"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        :hide-bottom="hide_bottom"
        class="table-accounting-date"
      >
        <template v-slot:header="props">
            <q-tr style="height: 40px" :props="props">
                <q-th
                :props="props"
                v-for="col in props.cols.filter(items => ![
                'actions'
                ].includes(items.name))"
                :key="col.name"
                :style="col.style"
                >
                   <span v-if="col.label.length <= 13 || col.label == 'Competitor Name'">{{col.label}}</span>
                   <span v-else>
                       <span>{{col.label.substring(0, col.label.lastIndexOf(' '))}}</span>
                       <br/>
                       <span>{{col.label.substring(col.label.lastIndexOf(' '))}}</span>
                   </span>
                </q-th>
                <q-th
                  v-if="stateData"
                  :props="props"
                  v-for="col in props.cols.filter(items => [
                  'actions'
                  ].includes(items.name))"
                  :key="col.name"
                  :style="col.style"
                >{{col.label}}</q-th>
            </q-tr>
        </template>
        <template v-if="!stateData" v-slot:body="props">
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
           v-for="col in props.cols.filter(items => ![
           'actions'
           ].includes(items.name))">
              {{col.value}} 
           </q-td>
          </q-tr>
        </template>
        <template v-else v-slot:body="props">
          <q-tr 
            :props="props" 
            style="backgroundColor: #fff"
            >
            <q-td key="datum" :props="props">
              <input type="date" v-model="props.row.datum" :max="maxDate"/>
            </q-td>
            <q-td key="betriebsnr" :props="props">
              <input disabled type="text2" v-model="props.row.betriebsnr"/>
              <button @click="onClickCompetitor(props)" id="buttonCN" type="submit">
                <span style="color: #fff" class="mdi mdi-magnify"/>
              </button>
            </q-td>
            <q-td key="bezeich" :props="props">
              <input disabled type="text" v-model="props.row.bezeich" />
            </q-td>
            <q-td key="zimmeranz" :props="props">
              <input @input="saleableRoom(props.row)" type="text" v-model="props.row.zimmeranz" />
            </q-td>
            <q-td key="personen" :props="props">
              <input @input="occupiedRoom(props.row)" type="text" v-model="props.row.personen" />
            </q-td>
            <q-td key="munit" :props="props">
              <input @input="comlimentaryRoom(props.row)" type="text" v-model="props.row.munit" />
            </q-td>
            <q-td key="logisumsatz" :props="props">
              <input @input="roomRevenue(props.row)" type="text" v-model="props.row.logisumsatz" />
            </q-td>
            <q-td v-if="stateData" :props="props.row.actions" class="right">
              <q-icon name="mdi-dots-vertical">
                <q-menu :props="props" auto-close anchor="bottom right" self="top right">
                  <q-list :props="props">
                    <q-item @click="InsertCompetitor" :props="props" clickable v-ripple>
                      <q-item-section>Insert Competitor Statistic</q-item-section>
                    </q-item>
                    <q-item @click="DeleteCompetitor(props.row)" :props="props" clickable v-ripple>
                      <q-item-section>Delete Competitor Statistic</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
    <DilagCompetitorStatistic 
      @onClickConfirm="onClickConfirm" 
      :dialog="dialog"
    />
    <DialogConfirmCompetitorStatickEntry
      :dialogConfirm="dialogConfirm"
      @onClickConfirmSave="onClickConfirmSave"
    />
    <DialogCheckPermission :dialogConfirm="CheckPermission"/>
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
import {tableHeaders} from './Tables/CompetitorStaticEntry.table'
import {data_Table, paramsSave, paramsModify, data_TableModify} from './utils/CompetitorStaticEntry'
import { date, Notify } from 'quasar'
import Inputmask from 'inputmask';
import {store} from '~/store'


export default defineComponent({
    setup(_, {root: {$api}}){
        let xi = 0, dateSearch, keySave
        const state = reactive({
            isFetching: false,
            hide_bottom: false,
            data: [] as any,
            data2: [],
            stateData: false,
            dialog: {
              dialog: false,
              data: [],
              rowIndex: null
            },
            dialogConfirm: {
              confirm: false,
              loadingButton: false
            },
            CheckPermission: {
              confirm: false,
              message: ''
            },
            maxDate: date.formatDate(new Date(), 'YYYY-MM-DD')
        })

        const NotifyCreate = (message) =>
          Notify.create({
            message: message,
            position: 'top',
            color: 'red',
            textColor: 'white',
            timeout: 2000,
          });

        const Fecth_API = async (api, body?) => {
            const [GET_DATA, GET_DATA2] = await Promise.all([
                $api.incomeaudit.FetchCommon(api, body),
                $api.incomeaudit.FetchAPINA(api, body)
            ])
            switch (api) {
                case 'competitorAdmPrepare':
                    state.data = data_Table(GET_DATA2?.b1List?.['b1-list']) 
                    setTimeout(() => {
                      state.isFetching = false
                      if (state.data.length !== 0) {
                          state.hide_bottom = true
                      } else {
                        NotifyCreate('Data Not Found')
                      }                  
                    },1000)
                    break;
                case 'selectHotel':
                  for(const xi of GET_DATA.b1List['b1-list']){
                    xi['selected'] = false
                  }
                  state.dialog.data = GET_DATA.b1List['b1-list']
                  break;
                case 'competitorAdmCheck':
                  if (GET_DATA2.msgStr !== '') {
                    NotifyCreate(GET_DATA2.msgStr)
                  } else {
                    state.dialogConfirm.confirm = true
                  }
                  break;
                case 'competitorAdmSave':
                  state.dialogConfirm.loadingButton = true
                  setTimeout(() => {
                    state.stateData = false
                    state.dialogConfirm.loadingButton = false
                    state.dialogConfirm.confirm = false
                    if (state.data.length == 0) {
                      state.hide_bottom = false
                    }
                  },1500)
                  break;
                case 'competitorAdmUpdate': 
                    state.dialogConfirm.loadingButton = true
                    setTimeout(() => {
                      state.stateData = false
                      state.dialogConfirm.loadingButton = false
                      state.dialogConfirm.confirm = false
                      if (state.data.length == 0) {
                        state.hide_bottom = false
                      }
                      onRefreshModify()
                    },1500)
                  break;
                case 'competitorAdmLoad':
                    state.data2 = data_TableModify(GET_DATA2.slist['slist'])
                    state.stateData = true     
                  break;
                default:
                  if (GET_DATA['zugriff'] !== "true") {
                    state.CheckPermission.confirm = true
                    state.CheckPermission.message = GET_DATA['messStr']
                  }
                    break;
            }
        }

        onMounted(() => {
          const {userInit} = store.state.auth.user
          Fecth_API('checkPermission', {
              userInit: userInit,
              arrayNr: '21',
              expectedNr: '1'
          })
          Fecth_API('selectHotel')
        })

        const onSearch = (data) => {
          dateSearch = data
          const {startDate, endDate} = data.date
            state.isFetching = true
            Fecth_API('competitorAdmPrepare', {
              "fromDate":  startDate,
              "toDate": endDate
            })            
        }

        const onRefreshModify = () => {
          const {startDate, endDate} = dateSearch.date
            state.isFetching = true
            Fecth_API('competitorAdmPrepare', {
              "fromDate":  startDate,
              "toDate": endDate
            })            
        }

        const onRowClick = (datarow) => {
          for(const i of state.data){
            i.selected = false
          }
          datarow['selected'] = true;
        }
        const onClickDialog = () => {
          keySave = 'addData'
          xi += 1
          state.data2 = []
          state.stateData = true
          state.data2.push({
            betriebsnr: '',
            bezeich: '',
            datum: date.formatDate(new Date(), 'YYYY-MM-DD'),
            logisumsatz: '',
            personen: '',
            zimmeranz: '',
            index: xi
          })
          state.hide_bottom = true
        }

        const onClickSave = () => {
          const data = []
          for(const items of state.data2){
            if (
              items['betriebsnr'] == '' ||
              items['bezeich'] == '' ||
              items['logisumsatz'] == '' ||
              items['personen'] == '' ||
              items['zimmeranz'] == '' 
              ) {
                data.push('gagal')
                }
          }
          if (data.length !== 0) {
            NotifyCreate('No record(s) found')
          } else {
            if (keySave == 'addData') {              
              const params = paramsSave(state.data2)
              Fecth_API('competitorAdmCheck', params)
            } else {
              state.dialogConfirm.confirm = true
            }
          }
        }

        const onClickCompetitor = (key) => {
          state.dialog.dialog = true
          state.dialog.rowIndex = key['rowIndex']
          for(const i of state.dialog.data){
            i.selected = false
          }          
        }

        const onClickConfirm = (dataRow, rowIndex) => {
          state.dialog.dialog = false
          state.data2[rowIndex]['betriebsnr'] = dataRow.aktionscode
          state.data2[rowIndex]['bezeich'] = dataRow.bezeich
        }

        const saleableRoom = (dataRow) => {
          if (isNaN(dataRow['zimmeranz'])) {
            dataRow['zimmeranz'] = ''
          }
          if (dataRow['zimmeranz'] == '0') {
            dataRow['zimmeranz'] = ''
            NotifyCreate('Unfilled SALEABLE ROOM field detected')
          }
        }
        const occupiedRoom = (dataRow) => {
          if (isNaN(dataRow['personen'])) {
            dataRow['personen'] = ''
          }
          if (dataRow['personen'] == '0') {
            NotifyCreate('Inconsistent data found : Room Revenue is not null but Occupied room is null.')
            dataRow['personen'] = ''
          }
        }
        const comlimentaryRoom = (dataRow) => {
          if (isNaN(dataRow['munit'])) {
            dataRow['munit'] = ''
          }
          if (dataRow['munit'] == '0') {
            NotifyCreate('Inconsistent data found : Room Revenue is not null but Occupied room is null.')
            dataRow['munit'] = ''
          }
        }
        const roomRevenue = (dataRow) => {
          if (isNaN(dataRow['logisumsatz'])) {
            dataRow['logisumsatz'] = ''
          }
          if (dataRow['logisumsatz'] == '0') {
            NotifyCreate('Inconsistent data found : Room Revenue is not null but Occupied room is null.')
            dataRow['logisumsatz'] = ''
          }        
        }
        const InsertCompetitor = () => {
          xi += 1
          state.data2.push({
            betriebsnr: '',
            bezeich: '',
            datum: date.formatDate(new Date(), 'YYYY-MM-DD'),
            logisumsatz: '',
            personen: '',
            zimmeranz: '',
            index: xi
          })
        }
        const DeleteCompetitor = (data) => {
          state.data2 = state.data2.filter(items => items['index'] !== data['index']) 
          if (state.data2.length == 0) {
            state.stateData = false
            if (state.data.length == 0) {
              state.hide_bottom = false
            }
          }         
        }

        const onClickConfirmSave = () => {
          if (keySave == 'addData') {            
            const params = paramsSave(state.data2)
            Fecth_API('competitorAdmSave', params)
          } else {
            const params = paramsModify(state.data2)          
            Fecth_API('competitorAdmUpdate', params)
          }
        }

        const onModify = () => {
          const {startDate, endDate} = dateSearch.date
          keySave = 'modifyData'
          Fecth_API('competitorAdmLoad', {
              "fromDate":  startDate,
              "toDate": endDate
          })
        }

        const onCancel = () => {
          state.stateData = false
          if (state.data.length !== 0) {
            state.hide_bottom = true
          } else {
            state.hide_bottom = false
          }
        }
        return {
            pagination: {
              rowsPerPage: 0,
            },
            onSearch,
            ...toRefs(state),
            onRowClick,
            onClickDialog,
            onClickSave,
            onClickCompetitor,
            onClickConfirm,
            saleableRoom,
            occupiedRoom,
            comlimentaryRoom,
            roomRevenue,
            tableHeaders,
            InsertCompetitor,
            DeleteCompetitor,
            onClickConfirmSave,
            onModify,
            onCancel
        }
    },
    components: {
        SearchCompetotorStaticEntry: () => import('./components/SearchCompetitorStaticEntry.vue'),
        DilagCompetitorStatistic: () => import('./components/DialogCompetitorStatistic.vue'),
        DialogConfirmCompetitorStatickEntry: () => import('./components/DialogConfirmCompetitorStatickEntry.vue'),
        DialogCheckPermission: () => import('./components/DialogCheckPermission.vue'),
    }
})
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
      text-align: left;
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

input[type=text] {
  width: 100%;
  height: 25px;
  border-radius: 4px;
  border: 0.5px solid rgb(138, 136, 136);
  background-image: "mdi mdi-magnify";
}
input[type=date] {
  width: 100%;
  height: 25px;
  border-radius: 4px;
  border: 0.5px solid rgb(138, 136, 136);
  background-image: "mdi mdi-magnify";
}
input[type=text2] {
  width: 80%;
  height: 25px;
  border: 0.5px solid rgb(138, 136, 136);
  background-image: "mdi mdi-magnify";
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
#buttonCN {
  height: 25px;
  border: 0.5px solid #2887D2;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #2887D2;
}
</style>