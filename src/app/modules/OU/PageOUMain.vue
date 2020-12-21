<template>
    <!-- <section> -->
        <div class="q-pa-sm">
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
                    <div class="q-pa-xs col-xl-12 col-sm-3 col-md-1">
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

            <dialogOpenTable :dialogOpenTable="dialogOpenTable" @onDialog="onDialog" @onResultOpenTable="onResultOpenTable" :dataTableSelected="dataTableSelected" />
            <dialogOpenMenu :dialogOpenMenu="dialogOpenMenu" :dataTableSelected="dataTableSelected" @onDialogMenu="onDialogMenu"/>
        </div>
    <!-- </section> -->
</template>

<script>
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { date , Notify} from 'quasar';
import {displayTime} from './utilsOU/utils';

export default defineComponent({
    setup(_, { root: { $api } }) {

    const state = reactive({
      userInit: 1,
      isFetching: true,
      dataPrepare: {},
      dataTable: [],
      dataTableSelected: null,
      dataFilteredTable: [],
      dialogOpenTable: false,
      dialogOpenMenu: false,
      filter: '',
    });

    const tableHeaders = [
      {
        label: 'tischnr',
        field: 'tischnr',
        sortable: false,
        align: 'center',
        width: 120,
        divider: true,
      },
      {
        label: 'bezeich',
        field: 'bezeich',
        sortable: false,
        align: 'right',
        width: 200,
        divider: true,
      },
    ];

    onMounted(async () => { 
      const [dataPrepare] = await Promise.all([
        $api.outlet.getOUPrepare('tablePlanPrepare', {
            dept : "1",
            currWaiter : state.userInit
        }),
      ]);

      if (dataPrepare) {
        const responsePrepare = dataPrepare || [];
        state.dataPrepare = responsePrepare;   

        const okFlag = state.dataPrepare['outputOkFlag'];
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
        state.dataTable = state.dataPrepare['tTisch']['t-tisch'];
        state.dataFilteredTable = state.dataTable;

        const tHBill = state.dataPrepare['tHBill']['t-h-bill'];
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

        // add billname in prepare
        // for (let i = 0; i<tHBill.length; i++) {
        //   const tischnr = tHBill[i]['tischnr'];
        //   const dataRow = tHBill[i];

        //   if (tischnr != dataSelected['tischnr']) {
        //     dataSelected['belegung'] = dataRow['belegung'];
        //     dataSelected['bilname'] = dataRow['bilname'];
        //     dataSelected['resnr'] = dataRow['resnr'];
        //     dataSelected['reslinnr'] = dataRow['reslinnr'];
        //     dataSelected['saldo'] = dataRow['saldo'];
        //     break;
        //   }
        // }

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
    });

    const onDialog = (val) => {
      // if(!val) {
      //   state.dataTableSelected = null;
      // }
      state.dialogOpenTable = val;
    }

    const onDialogMenu = (val) => {
      state.dialogOpenMenu = val;
    }

    const onClickTable = (data) => {
      // For Remark: 
      const tQueasy33 = state.dataPrepare['tQueasy33']['t-queasy33'];
      const tQueasy31 = state.dataPrepare['tQueasy31']['t-queasy31'];
      const tQueasy = state.dataPrepare['tQueasy']['t-queasy'];
      const tHBill = state.dataPrepare['tHBill']['t-h-bill'];
      const dataSelected = data;

      // for (let i = 0; i<tQueasy31.length; i++) {
      //   const number2 = tQueasy31[i]['number2'];

      //   if (number2 == dataSelected['tischnr']) {
      //     if (tQueasy31['date1'] != null) {
      //       dataSelected['isReserved'] = true;
      //       break;
      //     }
      //   }
      // }

      // const currDate = date.formatDate(new Date());
      // const currDateP2Hour = date.addToDate(currDate, {hours : 2});
      // const currDateM30Minute = date.addToDate(currDate, {seconds: -1800});

      // const hh1 = date.formatDate(currDate, "HH:mm");
      // const hh2 = date.formatDate(currDateP2Hour, "HH:mm");
      // const hh3 = date.formatDate(currDateM30Minute, "HH:mm");
      // console.log(hh1 + " - " + hh2 + " - " + hh3);

      // for (let i = 0; i<tQueasy33.length; i++) {
      //   const number2 = tQueasy33[i]['number2'];

      //   if (number2 == dataSelected['tischnr']) {
          
      //   }
      // }

      // Check Table 
      let tableOk = true;
      tableOk = state.dataPrepare['tKellner']['t-kellner'][0]['masterkey'];

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
                  const mCurrDate = strNumber3[0]*3600 + strNumber3[1]*60 + (+strNumber3[2] || 0);

                  var timeStart = new Date();
                  var timeEnd = date.buildDate({ year: strDate1[0], month: strDate1[1], date: strDate1[2], hours: strNumber3[0], minutes: strNumber3[1], seconds: strNumber3[2] });

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

          // console.log('Response check table : ', responseCheckTable);                

          state.dataTableSelected = dataSelected;
          onDialog(true);
        }
      }
      asyncCall();


{
      // for (let i = 0; i<state.dataFilteredTable.length; i++) {
      //   const aTisch = state.dataFilteredTable[i];
      //   state.dataFilteredTable[i]['isReserved'] = false;

      //   for (let x = 0; x<tQueasy33.length; x++) {
      //     const queasy33 = tQueasy33[x];
            
      //     if (queasy33['number2'] == aTisch['tischnr']) {
      //       state.dataFilteredTable[i]['isReserved'] = true;
      //       break;
      //     }
      //   }
      // }

      // for (let i = 0; i<state.dataFilteredTable.length; i++) {
      //   const tischnr = state.dataFilteredTable[i]['tischnr'];
      //   state.dataFilteredTable[i]['dateOpened'] = "";
      //   state.dataFilteredTable[i]['timeOpened'] = "";

      //   for (let x = 0; x<tQueasy.length; x++) {
      //     if (tQueasy[x]['key'] == 31) {
      //       const queasy = tQueasy[x];
      //       const number2 = tQueasy[x]['number2']

      //       if (tischnr == number2) {
      //         state.dataFilteredTable[i]['timeOpened'] = queasy['number3'];

      //         const currDate = date.formatDate(new Date(), "HH:mm:ss");
      //         const number3 = queasy['number3'];

      //         console.log("Number 3 : ", displayTime(number3));
      //         console.log("Curr Date : ", currDate);
      //         // console.log("Number 3 Date : ", number2, " - ", displayTime(number3));
      //         console.log("Date dif : ", date.getDateDiff(currDate, displayTime(number3), 'hours'));

      //         if (queasy['date1'] != null) {
      //           state.dataFilteredTable[i]['dateOpened'] = queasy['date1'];
      //         }
      //         break;
      //       }
      //     }
      //   }
      // }
}
    }

    const onResultOpenTable = (dataOpenTable) => {
      console.log("data open table", dataOpenTable);
      console.log("data table selected", state.dataTableSelected);

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
            currDept: '1'
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
            state.isLoading = false;
            return false;
          }
          console.log('OU Main - getCheckTable: ', responseCheckTable);
          onDialogMenu(true);
        }
        
      }
      asyncCall();
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onDialog,
      onDialogMenu,
      onClickTable,
      onResultOpenTable,
      getCheckTable,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    dialogOpenTable: () => import('./components/outlet_menu/table/DialogOpenTable.vue'),
    dialogOpenMenu: () => import('./components/outlet_menu/DialogOutletMenu.vue'),
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