<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="220" persistent>
      <searchIncoming 
      :searches="searches" 
      @onSearch="onSearch" 
      />
    </q-drawer>
    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="25" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="25" />
        </q-btn>
      </div>
      <STable
        :loading="isFetching"
        :columns="tableHeaders"
        :data="dataTO"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        class="table-accounting-date"
        :hide-bottom="hide_bottom"
      >
      <template #header="props">
        <q-tr :props="props">
          <q-th
            :props="props"
            key="icons"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4"
          >
          {{props.colsMap.icons.label}}
          </q-th>
          <q-th
            :props="props"
            key="roomNumber"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; left: 75px;"
          >
            {{ props.colsMap.roomNumber.label }}
          </q-th>
          <q-th
            :props="props"
            key="floor"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; left: 134px;"
          >
            {{ props.colsMap.floor.label }}
          </q-th>
          <q-th
            :props="props"
            key="roomType"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; left: 252px;"
          >
            {{ props.colsMap.roomType.label }}
          </q-th>
          <q-th
            :props="props"
            key="roomStatus"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; left: 369px;"
          >
            {{ props.colsMap.roomStatus.label }}
          </q-th>
          <q-th
            :props="props"
            key="guestNote"
            rowspan="2"
            class="fixed-col left"
            style="z-index: 4; left: 465px;"
          >
            {{ props.colsMap.guestNote.label }}
          </q-th>
          <q-th
            v-for="col in props.cols.filter(x => 
            ![
              'icons',
              'roomNumber',
              'floor',
              'roomType',
              'roomStatus', 
              'guestNote',
              'actions'
            ].includes(x.name))"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
          <q-th
            :props="props"
            key="actions"
            rowspan="2"
            class="fixed-col right"
            style="z-index: 4;"
          >
            {{ props.colsMap.actions.label }}
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr
          :props="props"
          class="cursor-pointer"
          @click="onRowClick(props.row)"
          :class="{
            selected: props.row.selected,
          }"
        >
          <q-td
            :props="props"
            key="icons"
            class="fixed-col left"
            style="padding-left: '8px'; max-width: 100px, width: 100px"
          >
            <span 
            v-if="props.row['resli-wabkurz'] !== ''" 
            class="mdi mdi-email mdi-18px"
            ></span>
          </q-td>

          <q-td
            v-if="props.row['voucher-nr'].length < 6"
            :props="props"
            key="roomNumber"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 75px;"
          >
            {{ props.row['voucher-nr']}}
          </q-td>
          <q-td
            v-else
            :props="props"
            key="roomNumber"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 75px;"
          >
            {{ props.row['voucher-nr'].substr(0, 4)+'...'}}
              <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
                {{props.row['voucher-nr']}}
              </q-tooltip>
          </q-td>

          <q-td
            :props="props"
            key="floor"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 134px;"
          >
            {{ props.row.grpflag}}
          </q-td>

          <q-td
            v-if="props.row['reser-name'].length < 10"
            :props="props"
            key="roomType"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 252px;"
          >
            {{ props.row['reser-name']}}
          </q-td>

          <q-td
            v-else
            :props="props"
            key="roomType"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 252px;"
          >
            {{ props.row['reser-name'].substr(0,10)+'...'}}
              <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
                {{props.row['reser-name']}}
              </q-tooltip>
          </q-td>

          <q-td
            :props="props"
            key="roomStatus"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 369px;"
          >
            {{ props.row.zinr}}
          </q-td>

          <q-td
            v-if="props.row['resli-name'].length < 7"
            :props="props"
            key="guestNote"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 465px;"
          >
            {{ props.row['resli-name']}}
          </q-td>

          <q-td
            v-else
            :props="props"
            key="guestNote"
            class="fixed-col left"
            style="box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15); left: 465px;"
          >
            {{ props.row['resli-name'].substr(0, 7)+'...'}}
              <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
                {{props.row['resli-name']}}
              </q-tooltip>
          </q-td>

          <q-td
            :props="props"
            v-for="col in props.cols.filter(x => 
              ![
                'icons',
                'roomNumber',
                'floor',
                'roomType',
                'roomStatus', 
                'guestNote',
                'actions'
              ].includes(x.name))"
            :key="col.name"
            :class="[col.name === 'Remark']"
          >
            <div v-if="col.name === 'Remark'">
              {{ props.row.bemerk }}
              <!-- <q-tooltip
                v-if="props.row.bemarkToltip.length > 52"
                anchor="bottom middle"
                self="top middle"
                :offset="[0, 0]"
              >
                {{ props.row.bemarkToltip }}
              </q-tooltip> -->
            </div>
            <!-- <template v-else>
              {{ props.row[col.field] }}
            </template> -->
          </q-td>

          <q-td
            :props="props"
            key="guestName"
            class="fixed-col right"
            style="box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);"
          >
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple @click="taskReport(props.row)">
                    <q-item-section>Task Report</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple @click="ignitoGuest(props.row)">
                    <q-item-section>Incognito Guest</q-item-section>
                  </q-item>
                  <q-separator style="marginTop: -2px" class="q-my-md" />
                  <q-item 
                  style="marginTop: -17px" 
                  clickable v-ripple 
                  @click="activateLineExtension(props.row)">
                    <q-item-section>Activate Line Extension</q-item-section>
                  </q-item>
                  <q-item 
                  clickable v-ripple 
                  @click="deactivateLineExtension(props.row)">
                    <q-item-section>Deactivate Line Extension</q-item-section>
                  </q-item>
                  <q-item 
                  clickable v-ripple 
                  @click="deactivateSameResno(props.row)">
                    <q-item-section>Deactivate All Same Reservation Number</q-item-section>
                  </q-item>
                  <q-separator style="marginTop: -2px" class="q-my-md" />
                  <q-item 
                  style="marginTop: -17px" 
                  clickable v-ripple
                  @click="activateWifi(props.row)"
                  >
                    <q-item-section>Activate WiFi</q-item-section>
                  </q-item>
                  <q-item 
                  clickable v-ripple
                  @click="deactivateWifi(props.row)"
                  >
                    <q-item-section>Deactivate WiFi</q-item-section>
                  </q-item>
                  <q-separator style="marginTop: -2px" class="q-my-md" />
                  <q-item style="marginTop: -17px" clickable v-ripple>
                    <q-item-section>Print List</q-item-section>
                  </q-item>
                  <q-separator style="marginTop: -2px" class="q-my-md" />
                  <q-item @click="onClickMessage(props.row)" style="marginTop: -17px" clickable v-ripple>
                    <q-item-section>Guest Message</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </q-tr>
      </template>
      </STable>
    </div>
    <messageDialog 
    :dataMessage="dataMessage"
    @onClickFirst="onClickFirst"
    @onClickLast="onClickLast"
    @onClickPrev="onClickPrev"
    @onClickNext="onClickNext"
    @newMessage="newMessage"
    @deleteMessage="deleteMessage"
    @saveData="saveData"
    @modifayMessage="modifayMessage"
    />
    <wakeupcalldialog
    :dataWakeupcall="dataWakeupcall"
    @cekStatus="cekStatus"
    @onClickRoomNumber="onClickRoomNumber"
    @onClickGroupName="onClickGroupName"
    />
    <taskReport :dataTaskReport="dataTaskReport"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  watch,
  
} from '@vue/composition-api';
import { tableHeaders, sorting, display, dataTable, dataTableWakeupcall } from './tables/telephoneOperator.table'
import { formatDates } from '../../helpers/dateFormat.helpers'
import { Notify, date } from 'quasar';
import { paramsOnSearch, paramsPrepare, saveDataMessage } from './utils/paramsTelephoneOperator'
import { store } from '~/store';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let messageLod, 
    massInit, 
    dataMess, 
    keySave, 
    respone, 
    valueIncognitoGuest, 
    valueOnSearch
    let dateNew = formatDates(new Date())
    const state = reactive({
      isFetching: true,
      ciDate: '',
      dataTO: [] as any,
      hide_bottom: false,
      paramsIncognitoGuest: '' as any,
      messDelete: [] as any,
      dataMessage: {
        data: [],
        dataLoad: [] as any,
        modal: false,
        dataNr: 0,
        disablePrev: false as any,
        disableNext: false as any,
        key: ''
      }, 
      searches : {
        data : [] as any,
        sorting: sorting,
        display: display,
        bemark: {} as any
      },
      dataWakeupcall : {
        dialogWakeupcall : false,
        data: [] as any,
        prepareData: {} as any,
        hide_bottom: false
      },
      dataTaskReport: {}
    });

    // HELPER 
    const NotifyCreate = (mess, col?, type?) => Notify.create({
              message: mess,
              color: col,
              type: type
            });
    const NotifyActions = (mess, col?,) => Notify.create({
              message: mess,
              color: 'primary',
              timeout: 0,
              position: 'center',
              actions: [
                { label: 'No', color: 'white', handler: () => { /* ... */ } },
                { label: 'Yes', color: 'white', handler: () => {
                  FETCH_API('incognitoGuest', valueIncognitoGuest, mess)
                } }
              ]
            });
    const deleteData = (body?) => {
      state.dataWakeupcall.prepareData = {
          name: '',
          ankunft: body,
          abreise: body,
      }
      state.dataWakeupcall.data = []
    }

    // FETCH_API
    const FETCH_API = async (api, body?, params?) => {
      const [GET_DATA, GET_COMMON] = await Promise.all([
        $api.telephoneOperator.fetchApiTelephoneOperator(api, body),
        $api.telephoneOperator.fetchApiCommon(api, body)
      ])
      
      switch (api) {
        case 'telopPrepare':
          onPrepare(GET_DATA)
          break;
        case 'telopList':
          state.dataTO = dataTable(GET_DATA)
          state.isFetching = false
          if (state.dataTO.length !== 0) {
            state.hide_bottom = true
          }
          break;


        case 'prepare':          
          const [telopPrepare, telopList] = await Promise.all([
          $api.telephoneOperator.fetchApiTelephoneOperator('telopPrepare'),
          $api.telephoneOperator.fetchApiTelephoneOperator('telopList', body)
          ])

          
          state.ciDate = telopPrepare.ciDate
          state.searches.data = telopList
          if (telopList.telopList['telop-list'].length !== 0) {
            state.isFetching = false
            state.hide_bottom = true
          }
          break;
        case 'lineExtActDeact':
          const lineExtActDeact = await $api.telephoneOperator.fetchApiTelephoneOperator('lineExtActDeact', body)
          if (lineExtActDeact.successFlag == 'true') {
            const message = body.sameResno == '?' ?
            'Line Extension activated' : body.sameResno == false ?
            'Line Extension(s) deactivated' : 
            'All extensions under the same Reservation Number deactivated'
            NotifyCreate(message, 'positive')
          }
          break;
          case 'activateWifi':
            const activateWifi = await $api.telephoneOperator.fetchApiTelephoneOperator('wifiExt', body)
            break
          case 'message':
            const [messagePrepare, messageInit] = await Promise.all([
              $api.telephoneOperator.fetchApiTelephoneOperator('messagePrepare', body[0]),
              $api.telephoneOperator.fetchApiTelephoneOperator('messageInit', Object.assign(body[0], body[1]))
              ])
              let messageLoad = []
              for (let index = 0; index < messageInit.messList['mess-list'].length; index++) {
                messageLoad.push(await $api.telephoneOperator.fetchApiTelephoneOperator('messageLoad', {
                mMessRecid: messageInit.messList['mess-list'][index]['mess-recid']}))
              }
              const inhous = {
                inhous : messagePrepare.pguest == 'true' ? 'yes' : 'no',
                dateArival: date.formatDate(messagePrepare.arrival, 'DD/MM/YYYYYY'),
                dateDepart: date.formatDate(messagePrepare.depart, 'DD/MM/YYYYYY'),
                newDate: formatDates(new Date()),
                timeNew: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
              } 
              const data = {
                username: '',
                tMessages: {
                  't-messages': [{
                    messtext:['', '', '', '', '', '', '', '', '', '']
                  }]
                }
              }
            if (messageLoad.length == 0) {
              state.dataMessage.data = Object.assign(messagePrepare, inhous, messageInit)
              state.dataMessage.dataNr = messageInit.nr
              state.dataMessage.dataLoad = data
              messageLod = data
              massInit = messageInit
              state.dataMessage.disablePrev = false
              state.dataMessage.disableNext = false
            } else {
              state.dataMessage.dataLoad = messageLoad[0]
              state.dataMessage.data = Object.assign(messagePrepare, inhous, messageInit)
              state.dataMessage.dataNr = messageInit.nr
              state.dataMessage.disablePrev = true
              messageLod = messageLoad
              massInit = messageInit
                if (params.recidMsg && params.resLineZinr){
                  state.dataMessage.dataLoad = messageLod[messageLod.length - 1]
                  state.dataMessage.dataNr = messageInit.tot
                  state.dataMessage.disablePrev = false
                  state.dataMessage.disableNext = true
                }
            }
            break
            case 'checkPermission':
              const checkPermission = await $api.telephoneOperator.fetchApiCommon('checkPermission', body)             
              if (checkPermission.zugriff == 'false') {
                NotifyCreate('User not found', 'red')
              } else {
                state.dataMessage.key = 'newData'
              }
            break
            case 'messageDel':
              const messageDel = await $api.telephoneOperator.fetchApiTelephoneOperator('messageDel', body)
              state.messDelete = messageDel
            break
            case 'readResLine':
              const readResLine = await $api.telephoneOperator.fetchApiCommon('readResLine', body[0])
                if (readResLine.tResLine['t-res-line'].length !== 0) {                
                  for (let i in readResLine.tResLine['t-res-line']) {
                    const readReservation = await $api.telephoneOperator.fetchApiCommon('readReservation', {
                      caseType: 1,
                    rsvNo: readResLine.tResLine['t-res-line'][i].resnr
                    })
                  }
                } else {
                  NotifyCreate('In-house guest not found', 'red')
                }
              if (body[2].key == 'room') {                
                if (body[1].value !== '') {
                  
                  const data = readResLine.tResLine['t-res-line'].filter(items => items.zinr == body[1].value)
                  state.dataWakeupcall.prepareData = data[0]
                  state.dataWakeupcall.data =  state.dataWakeupcall.data.filter(items => items.zinr == body[1].value)
                } else {
                  
                }
              } else {
                console.log('group')
              }
            break
            case 'readResHistory': 
              const readResHistory = await $api.telephoneOperator.fetchApiCommon('readResHistory', {caseType: 4})
                  setTimeout(() => {
                    if(readResHistory.tResHistory['t-res-history'].length !== 0){
                      
                      state.dataWakeupcall.data = dataTableWakeupcall(readResHistory)
                      if(state.dataWakeupcall.data.length !== 0){
                        state.dataWakeupcall.hide_bottom = true
                      }
                      } else {
    
                        NotifyCreate('not found', 'red')
                      }
                  },1000)
            break
            case 'checkPermissionIncognitoGuest':
              const checkPermissionIncognitoGuest = await $api.telephoneOperator.fetchApiCommon('checkPermission', {
                userInit: '01',
                arrayNr: '14',
                expectedNr: '2'
                })
                if (checkPermissionIncognitoGuest.zugriff == "true"){                    
                  if (params['active-flag'] !== 2) {
                    if (params.pseudofix) {
                      NotifyActions('Incognito Guest: Status ON. Undo it?')
                    } else {
                      NotifyActions('Incognito Guest: Status OFF. Switch it ON?')
                    }
                  }
                  } else {
                  NotifyCreate('You don’t have access', 'red')
                }
            break
            case 'incognitoGuest':
              const incognitoGuest = await $api.telephoneOperator.fetchApiTelephoneOperator('incognitoGuest', {
                tResnr: body.resnr,
                tReslinnr: body.reslinnr,
                userInit: '01'
              })
              if (incognitoGuest.outputOkFlag) {
                state.paramsIncognitoGuest = params
              }
            break
            default:
              const messageSave = await $api.telephoneOperator.fetchApiTelephoneOperator('messageSave', body)
              state.messDelete = messageSave
              state.dataMessage.key = ''
              break;
      }
      
    }

    useExtraMenu([
      {
        handler: () => alarmClock(),
        icon: 'TO/Icon-alarmclock',
      },
    ]);

    watch(() => state.paramsIncognitoGuest,
          (paramsIncognitoGuest, prev) => {
            if(valueOnSearch == undefined) {
              FETCH_API('prepare',paramsPrepare(state.ciDate))
            } else {
              FETCH_API('prepare',paramsOnSearch(valueOnSearch, state.ciDate))
            }
          }
    )

    onMounted(() => {
        FETCH_API('prepare')
        FETCH_API('telopPrepare')
    })

    const onPrepare = (cidate) => {
      FETCH_API('telopList',paramsPrepare(cidate['ciDate']))
    }

    // watch(() => state.ciDate,
    //       (ciDate, prev) => {
    //         if (ciDate && ciDate !== prev) {
    //         FETCH_API('prepare',paramsPrepare(ciDate))
    //         }
    //       }
    // )

    watch(() => state.messDelete,
          (messDelete, prev) => {
            if (messDelete && messDelete !== prev) {              
              if (messDelete.outputOkFlag == 'true') {
                const data = [
                      {
                        gastnr: dataMess.gastnrmember,
                        resnr: dataMess.resnr,
                        reslinnr: dataMess.reslinnr
                      },
                      {
                        ifFlag: 'no',
                      }]
                FETCH_API('message', data, messDelete)
              }
            }
          }
    )

    function getDefaultColumns(cols) {
      return cols.filter(
        (col) => ![
        'icons',
        'roomNumber',
        'floor',
        'roomType',
        'roomStatus', 
        'guestNote',
        'actions'
        ].includes(col.name)
      );
    }

    const onRowClick = (datarow) => {
      for(const i in state.dataTO){
        state.dataTO[i]['selected'] = false
      }
      datarow['selected'] = true;
      state.searches.bemark = datarow
      state.dataMessage.key = ''
    }

    const onSearch = (val) => {
      valueOnSearch = val
      state.isFetching = true
      FETCH_API('prepare',paramsOnSearch(val, state.ciDate))
    }

    const activateLineExtension = (dataRow) => {
      const data = {
        caseType: 1,
        sameResno: '?',
        resnr: dataRow.resnr,
        reslinnr: dataRow.reslinnr
      }
      FETCH_API('lineExtActDeact', data)
    }

    const deactivateLineExtension = (dataRow) => {
      const data = {
        caseType: 2,
        sameResno: false,
        resnr: dataRow.resnr,
        reslinnr: dataRow.reslinnr
      }
      FETCH_API('lineExtActDeact', data)
    }

    const deactivateSameResno = (dataRow) => {
      const data = {
        caseType: 2,
        sameResno: true,
        resnr: dataRow.resnr,
        reslinnr: dataRow.reslinnr
      }
      FETCH_API('lineExtActDeact', data)
    } 

    const activateWifi = (dataRow) => {
      const data = {
        caseType: 1,
        sameResno: false,
        resnr: dataRow.resnr,
        reslinnr: dataRow.reslinnr
      }
      FETCH_API('activateWifi', data)
    }

    const deactivateWifi = (dataRow) => {
      const data = {
        caseType: 2,
        sameResno: false,
        resnr: dataRow.resnr,
        reslinnr: dataRow.reslinnr
      }
      FETCH_API('activateWifi', data)
    }

    const onClickMessage = (dataRow) => {
      state.dataMessage.modal = true
      dataMess = dataRow
      const data = [
        {
          gastnr: dataRow.gastnrmember,
          resnr: dataRow.resnr,
          reslinnr: dataRow.reslinnr
        },
        {
          ifFlag: 'no',
        }]
      FETCH_API('message', data)
    }

    const onClickFirst = () => {
      if (messageLod.username !== '') {        
        state.dataMessage.dataLoad = messageLod[0]
        state.dataMessage.dataNr = massInit.nr
        if(massInit.nr == 1) {
          state.dataMessage.disablePrev = true
          state.dataMessage.disableNext = false
        }
      }
    }
    const onClickLast = () => {
      if (messageLod.username !== '') {        
        state.dataMessage.dataLoad = messageLod[messageLod.length - 1]
        state.dataMessage.dataNr = massInit.tot
        if (state.dataMessage.dataNr == massInit.tot ) {
          state.dataMessage.disablePrev = false
          state.dataMessage.disableNext = true
        }
      }
    }
    const onClickPrev = () => {
      if (messageLod.username !== '') {        
        const hasil = state.dataMessage.dataNr - 1
        if (hasil >= 1) {          
          state.dataMessage.dataNr = hasil
          state.dataMessage.dataLoad = messageLod[hasil - 1]
          state.dataMessage.disableNext = false
        } 
        if(hasil == 1) {
          state.dataMessage.disablePrev = true
        }
      }
    }
    const onClickNext = () => {
      if (messageLod.username !== '') {        
        const hasil = state.dataMessage.dataNr + 1
          if (hasil <= messageLod.length) {          
            state.dataMessage.dataNr = hasil
            state.dataMessage.dataLoad = messageLod[hasil - 1]
            state.dataMessage.disablePrev = false
          }
          if(hasil == messageLod.length ){
            state.dataMessage.disableNext = true
          }
      }
    }
    const newMessage = () => {
      keySave = 'save'
      const user = store.state.auth.user as any || {};
      const data = {
        userInit: user.userInit,
        arrayNr: '17',
        expectedNr: '2'
      }
      FETCH_API('checkPermission', data)
    }

    const deleteMessage = () => {
      const data = {
        recId: state.dataMessage.dataLoad.tMessages['t-messages'][0]['rec-id']
      }
      FETCH_API('messageDel', data)
    }

      const modifayMessage = () => {
        state.dataMessage.key = 'newData'
        keySave = 'modify'
        const user = store.state.auth.user as any || {},
        data = {
          userInit: user.userInit,
          arrayNr: '17',
          expectedNr: '2'
        }
        FETCH_API('checkPermission', data)
      }
    const saveData = (dataMessge) => {
      const user = store.state.auth.user as any || {},
      dataRow = state.searches.bemark,
      recid = state.dataMessage.dataLoad.tMessages['t-messages'][0]['rec-id']
      const params = {
        keySave,
        dataRow,
        recid,
        dataMessge,
        user
      }
      if (dataMessge.newText !== '' && dataMessge.newCaller !== '' && dataMessge.newPhone !== ''){
        FETCH_API('messageSave', saveDataMessage(params))
      } else {
        NotifyCreate('input please fill in', 'red')
      }
    }

    const alarmClock = () => {
      state.dataWakeupcall.dialogWakeupcall = true
      deleteData(dateNew)
    }

    const cekStatus = (value) => {
      
      const params ={
        caseType: 4
      }
      FETCH_API('readResHistory', params)
    } 

    const onClickGroupName = (value) => {
        const data = [
        {
          caseType: 101,
          rmNo: value
        },
        {
          value
        },
        {
          key: 'group'
        }
        ]
        FETCH_API('readResLine', data)

    }

    const ignitoGuest = (value) => {
      valueIncognitoGuest = value
       FETCH_API('checkPermissionIncognitoGuest', '', value)
    }

    const onClickRoomNumber = (value) => {
      const data = [
      {
        caseType: 101,
        rmNo: value
      },
      {
        value
      },
      {
        key: 'room'
      }
      ]
      FETCH_API('readResLine', data)
    }

    const taskReport = (dataRow) => {
      state.dataTaskReport = {
        modal : true,
        dataRow : dataRow
      }
    }

    return {
      ...toRefs(state),
      taskReport,
      onRowClick,
      onClickPrev,
      onClickNext,
      onClickLast,
      newMessage,
      deleteMessage,
      ignitoGuest,
      activateLineExtension,
      alarmClock,
      cekStatus,
      onClickGroupName,
      deactivateLineExtension,
      deactivateSameResno,
      saveData,
      onClickRoomNumber,
      modifayMessage,
      activateWifi,
      onClickMessage,
      onClickFirst,
      getDefaultColumns,
      onSearch,
      tableHeaders,
      pagination: { page: 1, rowsPerPage: 0 }
    };
  },
  components: {
    searchIncoming: () => import('./components/SearchTelephoneOperator.vue'),
    messageDialog: () => import('./components/dialogMessage.vue'),
    wakeupcalldialog: () => import('./components/wakeUpCall.vue'),
    taskReport: () => import('./components/taskReport.vue')
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

  tr.selected td {
    background-color: #2d00e2 !important;
    color: #fff;
  }
}
</style>
