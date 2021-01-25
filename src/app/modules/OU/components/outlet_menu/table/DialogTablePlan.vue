<template>
    <!-- <section> -->
    <div class="q-pa-sm">
      <q-dialog
        v-model="dialogModel"
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down">
        <q-card class="bg-white text-black">
         
         <q-btn class="q-ma-md" size="14px" flat round icon="mdi-chevron-left" v-close-popup>
            <q-tooltip>
              Back
            </q-tooltip>
         </q-btn>
            <STable
              grid
              hide-header
              :loading="isFetching"
              :data="dataFilteredTable"
              :columns="tableHeaders"
              hide-bottom
              separator="cell"
              :rows-per-page-options="[0]"
              :filter="filter"
              :pagination.sync="pagination" >
              <template v-slot:item="props">
                <div class="q-pa-xs col-xl-1 col-sm-3 col-md-1">
                  <q-card>
                    <q-card-section @click="onClickTable(props.row)" :class="props.row.rechnr == 0 ? 'bg-white text-center text-black' : 'bg-red text-center text-white'">
                      <strong>{{ props.row.tischnr }}</strong>
                    </q-card-section>
                  </q-card>
                </div>
              </template>

              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="mdi-magnify" />
                  </template>
                </q-input>
              </template>
            </STable>

            <dialogOpenTable :showDialogOpenTable="showDialogOpenTable" @onDialog="onDialog" @onResultOpenTable="onResultOpenTable" :dataTableSelected="dataTableSelected" />
                <!-- <dialogOpenMenu :dialogOpenMenu="dialogOpenMenu" :dataTableSelected="dataTableSelected" @onDialogMenu="onDialogMenu"/> -->            
        </q-card>
      </q-dialog>
    </div>
    <!-- </section> -->
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch, computed, ref, onUpdated} from '@vue/composition-api';
import { date , Notify, Cookies} from 'quasar';
import {displayTime} from '../../../utilsOU/utils';
import { store } from '~/store';

interface State {
  userInit: any,
  isFetching: Boolean,
  dataPrepareS: {},
  dataTable: any,
  dataTableSelected: null,
  dataFilteredTable: any,
  showDialogOpenTable: Boolean,
  filter: String,
  currDept: any,
}

export default defineComponent({
    props: {
      showDialogTablePlan: { type: Boolean, required: true },
      dataPrepare: { type: null, required: false },
    },
    setup(props, { emit, root: { $api, $root } }) {

    const dataStoreLogin = store.state.auth.user || {} as any;

    const state=reactive<State>({
      userInit: dataStoreLogin['userInit'],
      isFetching: false,
      dataPrepareS: {},
      dataTable: [],
      dataTableSelected: null,
      dataFilteredTable: [],
      showDialogOpenTable: false,
      filter: '',
      currDept: 1,
    });
  
    watch(
      () => props.showDialogTablePlan, (showDialogTablePlan) => {

        if (props.showDialogTablePlan) {
          console.log('Prepare on mount : ', props.dataPrepare);
          state.currDept = props.dataPrepare['currDept'];
          state.isFetching = true;
          getDataPrepareTable();

          // Cookies.remove('OU_isFisrtLoad');

        }
      }
    );

    const tableHeaders = [
      {
        label: 'tischnr',
        field: 'tischnr',
        align: 'center',
      },
      {
        label: 'bezeich',
        field: 'bezeich',
        align: 'right',
      }
    ];
 
    const dialogModel = computed({
      get: () => props.showDialogTablePlan,
      set: (val) => {
        emit('onDialogTablePlan', val);
      },
    });

    const onDialog = (val) => {
      // if(!val) {
      //   state.dataTableSelected = null;
      // }
      state.showDialogOpenTable = val;
    }

    const onClickTable = (data) => {
      const tQueasy33 = state.dataPrepareS['tQueasy33']['t-queasy33'];
      const tQueasy31 = state.dataPrepareS['tQueasy31']['t-queasy31'];
      const tQueasy = state.dataPrepareS['tQueasy']['t-queasy'];
      const tHBill = state.dataPrepareS['tHBill']['t-h-bill'];
      const dataSelected = data;

      let tableOk = true;
      tableOk = state.dataPrepareS['tKellner']['t-kellner'][0]['masterkey'];

      if (!tableOk) {
        for (let i = 0; i<tHBill.length; i++) {
          const tischnr = tHBill[i]['tischnr'];
          const dataRow = tHBill[i];

          if (tischnr == dataSelected['tischnr']) {
            dataSelected['belegung'] = dataRow['belegung'];
            dataSelected['bilname'] = dataRow['bilname'];
            dataSelected['resnr'] = dataRow['resnr'];
            dataSelected['reslinnr'] = dataRow['reslinnr'];
            dataSelected['saldo'] = dataRow['saldo'];
            tableOk = true;
      
            if (dataRow['kellner-nr'] != state.userInit) {
              tableOk = false;
              Notify.create({
                message: 'This table belongs to other waiter',
                color: 'red',
              });
              return false;
            } 
            break;
          }
        }

        for (let i = 0; i<state.dataTable.length; i++) {
          const kellnernr = state.dataTable[i]['kellner-nr'];
          const tischnr = state.dataTable[i]['tischnr'];

          if ((tischnr == dataSelected['tischnr']) && (kellnernr != 0) && (kellnernr != state.userInit)) {
            tableOk = false;
            Notify.create({
                message: 'This table belongs to other waiter',
                color: 'red',
            });
            break;
          }
        }
      } else {
        for (let i = 0; i<tHBill.length; i++) {
          const tischnr = tHBill[i]['tischnr'];
          const dataRow = tHBill[i];

          if (tischnr == dataSelected['tischnr']) {
            dataSelected['belegung'] = dataRow['belegung'];
            dataSelected['bilname'] = dataRow['bilname'];
            dataSelected['resnr'] = dataRow['resnr'];
            dataSelected['reslinnr'] = dataRow['reslinnr'];
            dataSelected['saldo'] = dataRow['saldo'];
            break;
          }
        }
      }

      async function asyncCall() {
        const [dataCheckTable] = await Promise.all([
          $api.outlet.getOUPrepare('tablePlanCheckTable', {
            pvlLanguage : "1",
            resnr : dataSelected['resnr'],
            reslinnr : dataSelected['reslinnr'],
          }),
        ]);

        if (dataCheckTable) {
          const responseCheckTable = dataCheckTable || [];
          const okFlag = responseCheckTable['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          } 

          dataSelected['availBill'] =  responseCheckTable['availBill'];
          dataSelected['klimit'] = responseCheckTable['klimit'];
          dataSelected['ksaldo'] = responseCheckTable['ksaldo'];
          dataSelected['recidBill'] = responseCheckTable['recidBill'];
          dataSelected['remark'] = responseCheckTable['remark'];
          dataSelected['resline'] = responseCheckTable['resline'];
          dataSelected['rmno'] = responseCheckTable['rmno'];
          dataSelected['bcol'] = 0;
          dataSelected['fcol'] = 0;
          // dataSelected['resnr1'] = 0;
          // dataSelected['reslinnr1'] = 0;

          //check resline true or false
          if (responseCheckTable['resline']) { } 
          
          for (let i = 0; i<tQueasy31.length; i++) {
            const recid31 = tQueasy31[i]['rec-id'];

            if (tQueasy31[i]['number2'] == dataSelected['tischnr']) {
              for (let x = 0; x<tQueasy.length; x++) {
                const recid = tQueasy[x]['rec-id'];
                if (recid31 == recid) {
                  dataSelected['bcol'] = tQueasy[x]['bcol'];
                  dataSelected['fcol'] = tQueasy[x]['fcol'];
                  break;
                }
              }
            }
          }

          for (let i = 0; i<tQueasy.length; i++) {
            if (tQueasy[i]['key'] == 31) {
              if (dataSelected['tischnr'] == tQueasy[i]['number2']) {
                const queasy = tQueasy[i];
                const currDate = date.formatDate(new Date(), "HH:mm:ss");
                const number3 = displayTime(queasy['number3']);

                // ---- //
                
                // var timeEnd = date.formatDate(queasy['number3'] + " " +queasy['date1'], "HH:mm:ss YYYY-MM-DD");
                
                if (queasy['date1'] != null) {
                  dataSelected['dateOpened'] = queasy['date1'];

                  var strDate1 = (queasy['date1']).split('-');
                  var strNumber3 = number3.split(':');
                  const mCurrDate = (strNumber3[0] as any) *3600 + ( strNumber3[1] as any)*60 + (+strNumber3[2] || 0);

                  var timeStart = new Date();
                  var timeEnd = date.buildDate({ year: strDate1[0], month: strDate1[1], date: strDate1[2], hours: strNumber3[0] as any, minutes: strNumber3[1] as any, seconds: strNumber3[2] as any });

                  var difHours = date.getDateDiff(timeStart, timeEnd, 'hours');
                  var difMinutes = date.getDateDiff(timeStart, timeEnd, 'minutes');
                  var difSeconds = date.getDateDiff(timeStart, timeEnd, 'seconds');
                  var time = difHours + ":" + difMinutes + ":" + difSeconds;

                  dataSelected['timeOpened'] = secondsToHMS(difSeconds - mCurrDate);

                  // console.log("time start : ", timeStart); 
                  // console.log("time end : ", timeEnd); 
                  // console.log("dif : ", secondsToHMS(difSeconds - mCurrDate));
                } else {
                  dataSelected['timeOpened'] = "";
                }
                break;
              }
            }
          }

          if (dataSelected['tischnr'] == 0 || dataSelected['rmno'] == "" || dataSelected['bilname'] == "") {
            dataSelected['flagChangeGuest'] = true;
          } else {
            dataSelected['flagChangeGuest'] = false;
          }

          state.dataTableSelected = dataSelected;
          onDialog(true);
        }
      }
      asyncCall();
    }

    const onResultOpenTable = (dataOpenTable) => {
      // console.log("data open table", dataOpenTable);
      // console.log("data table selected", state.dataTableSelected);

      getCheckTable(dataOpenTable);
    }

    function secondsToHMS(secs) {
      function z(n){return (n<10?'0':'') + n;}
      var sign = secs < 0? '-':'';
      secs = Math.abs(secs);
      return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
    }

    const getCheckTable = (data) => {
      async function asyncCall() {
        const [dataCheckTable] = await Promise.all([
          $api.outlet.getOUAction('restInvCheckBill', {
            caseType: 1,
            tischnr: data['tischnr'],
            currDept: state.currDept,
          }),
        ]);

        if (dataCheckTable) {
          const responseCheckTable = dataCheckTable || [];
          const okFlag = responseCheckTable['outputOkFlag'];
          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }

          console.log('OU Main - getCheckTable: ', responseCheckTable);
          
          emit('onResultTablePlan', state.dataTableSelected);
          emit('onDialogTablePlan', false);
          //emit
        }
        
      }
      asyncCall();
    }

    const getDataPrepareTable = () => {
        async function asyncCall() {
            const [dataPrepare] = await Promise.all([
                $api.outlet.getOUPrepare('tablePlanPrepare', {
                    dept : state.currDept,
                    currWaiter : state.userInit
                }),
            ]);

            if (dataPrepare) {
                const responsePrepare = dataPrepare || [];
                state.dataPrepareS = responsePrepare;   

                const okFlag = state.dataPrepareS['outputOkFlag'];
                if (!okFlag) {
                Notify.create({
                    message: 'Failed when retrive data, please try again',
                    color: 'red',
                });
                state.isFetching = false;
                return false;
                } 

                state.dataTable = [];
                state.dataFilteredTable = [];
                state.dataTable = state.dataPrepareS['tTisch']['t-tisch'];
                state.dataFilteredTable = state.dataTable;

                const tHBill = state.dataPrepareS['tHBill']['t-h-bill'];
                for (let i = 0; i<state.dataFilteredTable.length; i++) {
                    const tischnrTable = state.dataFilteredTable[i]['tischnr'];
                    state.dataFilteredTable[i]['rechnr'] = 0;

                    for (let x = 0; x<tHBill.length; x++) {
                        const tischnrBill = tHBill[x]['tischnr'];

                        if (tischnrTable == tischnrBill) {
                            state.dataFilteredTable[i]['rechnr'] = tHBill[x]['rechnr'];
                            break;
                        }
                    }
                }

                console.log("dataPrepare : " , dataPrepare);
                console.log("dataTable: " , state);
            
                state.isFetching = false;
            } else {
                Notify.create({
                message: 'Please check your internet connection',
                color: 'red',
                });
                state.isFetching = false;
                return false;
            }
        }
        asyncCall();
    }

    return {
      dataStoreLogin,
      ...toRefs(state),
      dialogModel,
      tableHeaders,
      onDialog,
      onClickTable,
      onResultOpenTable,
      getCheckTable,
      getDataPrepareTable,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    dialogOpenTable: () => import('./DialogOpenTable.vue'),
  },
})
</script>

<style lang="scss">
.my-menu-link {
  color: white;
  background: $primary;
  border: 4px;
}

.flex-container {
  z-index: 99;
  display: flex;
  flex-wrap: wrap;
  background-color: DodgerBlue;
}

.flex-container > div {
  background-color: #f1f1f1;
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
}
</style>