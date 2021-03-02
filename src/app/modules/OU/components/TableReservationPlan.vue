<template>
  <!-- <div class="q-pa-md q-gutter-sm"> -->
    
  <div>
    <q-dialog
      v-model="dialogModel"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down">

      <q-card class="bg-white text-black">
        <div>
          <div class="q-pa-lg">
            <div class="q-mb-md">
              <q-btn flat round class="q-mr-lg">
                <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
              </q-btn>

              <q-btn flat round>
                <img :src="require('~/app/icons/Icon-Add.svg')" height="30" @click="onClickNew"/>
              </q-btn>

              <q-btn flat round>
                <img :src="require('~/app/icons/Icon-Add.svg')" height="30"@click="onClickEdit" />
              </q-btn>

            </div>
            
            <!-- <div class="row q-gutter-xs">
              <div class="col"> -->
                <STable
                  style="height:700px;"
                  :rows-per-page-options="[0]"
                  :loading="isLoading"
                  hide-bottom                  
                  :data="dataTable"
                  row-key="name"
                  :columns="tableHeaders"
                  separator="cell"
                  :pagination.sync="pagination">
                  <template v-slot:body="props">
                    <q-tr :props="props" class="cursor-pointer"  >
                      <q-td 
                        :props="props" 
                        v-for="col in props.cols" 
                          :key="col.name" 
                          @click.native="selectRow(col.name, props, col)" >
                            {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </STable>

                <div>
                  <searchTableResPlan :searches="searches" @getResPlanDataLoad="getResPlanDataLoad"/>
                </div>

                <dialogNewTableReservation 
                :dialogNewReservation="dialogNewReservation" 
                :selected="selected" 
                :dataSelected="dataSelected"
                :caseType="caseType"
                @onDialogNewReservation="onDialogNewReservation"/>

                <q-dialog v-model="confirm" persistent>
                  <q-card>
                    <q-card-section class="row items-center">
                      <q-avatar color="primary" text-color="white" />
                      <span class="q-ml-sm">Create table reservation.</span>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn flat label="No" color="primary" v-close-popup />
                      <q-btn flat label="Yes" color="primary" @click="openDialogNewTableReservation()" />
                    </q-card-actions>
                  </q-card>
                </q-dialog>

          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
  <!-- :class="props.row[col.name] && props.colsMap!= '' ? 'bg-red' : '' " -->
  <!-- :class="selected.hasOwnProperty(props.row.__index) && selected[props.row.__index].indexOf(col.name)!=-1?'bg-grey-2':''" -->
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs, ref, onMounted} from '@vue/composition-api';
import { date, Notify } from 'quasar';
import Vue from 'vue';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  dataTable: any;
  dialogNewReservation: boolean;
  title: string,
  date: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  searches: {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataPrepare: {},
  selected: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataSelected: {},
  flagIsNew: boolean,
  caseType: string,
  confirm: boolean,
  tempTable: any;
  flagIsEdit: boolean;
}
export default defineComponent({
  props: {
    dialogTableReservation: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api, $root } }) {
    const user = store.state.auth.user || {};

    const state = reactive<State>({
      isLoading: false,
      dataTable: [] as any,
      dialogNewReservation: false,
      title: "Menu",
      date: new Date(),
      searches : {},
      dataPrepare: {},
      selected: [],
      dataSelected: {},
      flagIsNew: false,
      flagIsEdit: false,
      caseType: '',
      confirm: false,
      tempTable: [],
    });
    
    let title = [] as any;
    {
        let emptyTitle = false;
        let titlestr = 11;
        for (let i = 0; i<32; i++) {
          if (titlestr > 22) {
            titlestr = 7;
          }
    
          let temptitle = titlestr.toString();
          if (titlestr < 10) {
            temptitle = '0' + titlestr.toString();
          } 
    
          if (!emptyTitle) {
            title.push(temptitle);
          } else {
            title.push(" ");
            titlestr++;
          }
          emptyTitle = !emptyTitle;
        } 
    }

    const tableHeaders = [] as any;
    {
        let counterUhrzeit = 0;
        for (let i = 0; i < 34; i++) {
          if (i == 0) {
            tableHeaders.splice(i, 0, {
              label: " ",
              field: "tischnr",
              name: "tischnr",
              align: "right",
            }); 
          } else if (i == 1) {
            tableHeaders.splice(i, 0, {
              label: "   ",
              field: "belegung",
              name: "belegung",
              align: "right",              
            }); 
          } else {
            tableHeaders.splice(i, 0, {
              label: title[i - 2],
              // field: "uhrzeit" + (i - 2),
              // name: "uhrzeit" + (i - 2),
              field: "uhrzeit" + counterUhrzeit,
              name: "uhrzeit" + counterUhrzeit,
              format: val => `${val}`,
              align: "right", 
              style: 'max-width: 100px',
              headerStyle: 'max-width: 100px',
              classes: "ellipsis"
            }); 
            counterUhrzeit++;
          }
        }
    }


    let titleHeadersHelper = [{
        "urz": "uhrzeit0",
        "title": "11",
        "flagtime": "11"
      }, {
        "urz": "uhrzeit1",
        "title": "",
        "flagtime": "11"
      }, {
        "urz": "uhrzeit2",
        "title": "12",
        "flagtime": "12"
      }, {
        "urz": "uhrzeit3",
        "title": "",
        "flagtime": "12"
      }, {
        "urz": "uhrzeit4",
        "title": "13",
        "flagtime": "13"
      }, {
        "urz": "uhrzeit5",
        "title": "",
        "flagtime": "13"
      }, {
        "urz": "uhrzeit6",
        "title": "14",
        "flagtime": "14"
      }, {
        "urz": "uhrzeit7",
        "title": "",
        "flagtime": "14"
      }, {
        "urz": "uhrzeit8",
        "title": "15",
        "flagtime": "15"
      }, {
        "urz": "uhrzeit9",
        "title": "",
        "flagtime": "15"
      }, {
        "urz": "uhrzeit10",
        "title": "16",
        "flagtime": "16"
      }, {
        "urz": "uhrzeit11",
        "title": "",
        "flagtime": "16"
      }, {
        "urz": "uhrzeit12",
        "title": "17",
        "flagtime": "17"
      }, {
        "urz": "uhrzeit13",
        "title": "",
        "flagtime": "17"
      }, {
        "urz": "uhrzeit14",
        "title": "18",
        "flagtime": "18"
      }, {
        "urz": "uhrzeit15",
        "title": "",
        "flagtime": "18"
      }, {
        "urz": "uhrzeit16",
        "title": "19",
        "flagtime": "19"
      }, {
        "urz": "uhrzeit17",
        "title": "",
        "flagtime": "19"
      }, {
        "urz": "uhrzeit18",
        "title": "20",
        "flagtime": "20"
      }, {
        "urz": "uhrzeit19",
        "title": "",
        "flagtime": "20"
      }, {
        "urz": "uhrzeit20",
        "title": "21",
        "flagtime": "21"
      }, {
        "urz": "uhrzeit21",
        "title": "",
        "flagtime": "21"
      }, {
        "urz": "uhrzeit22",
        "title": "22",
        "flagtime": "22"
      }, {
        "urz": "uhrzeit23",
        "title": "",
        "flagtime": "22"
      }, {
        "urz": "uhrzeit24",
        "title": "07",
        "flagtime": "07"
      }, {
        "urz": "uhrzeit25",
        "title": "",
        "flagtime": "07"
      }, {
        "urz": "uhrzeit26",
        "title": "08",
        "flagtime": "08"
      }, {
        "urz": "uhrzeit27",
        "title": "",
        "flagtime": "08"
      }, {
        "urz": "uhrzeit28",
        "title": "09",
        "flagtime": "09"
      }, {
        "urz": "uhrzeit29",
        "title": "",
        "flagtime": "09"
      }, {
        "urz": "uhrzeit30",
        "title": "10",
        "flagtime": "10"
      }, {
        "urz": "uhrzeit31",
        "title": "",
        "flagtime": "10"
    }]
    
    const getResPrepare = () => { 
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('resPlanPrepare', {
              currDept : "1",
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          console.log("response : ", responsePrepare);
          state.dataPrepare = responsePrepare;   

          const okFlag = state.dataPrepare['outputOkFlag'];
          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          const fdate = new Date(responsePrepare.dParam87);
          state.date = fdate;
          state.tempTable = responsePrepare['tableList']['table-list'].slice();

          readData(state.dataPrepare['tQueasy33']['t-queasy33']);
        }
        state.isLoading = false;
      }
      asyncCall();
    };

    const getResPlanDataLoad = (state2) => {  
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('resPlanPrepare', {
              currDept : "1",
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          console.log("response : ", responsePrepare);
          state.dataPrepare = responsePrepare;   

          const okFlag = state.dataPrepare['outputOkFlag'];
          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }         
          state.tempTable = responsePrepare['tableList']['table-list'].slice();
          state.date = state2.date;

          async function asyncCall() {
            const [dataPrepare] = await Promise.all([
              $api.outlet.getOUPrepare('resPlanResdataLoad', {
                  currDept : "1",
                  caseType: 2,
                  currDate: date.formatDate(state2.date, 'MM/DD/YYYY'),
                  vonTisch: '',
              }),
            ]);

            if (dataPrepare) {
              const responsePrepare = dataPrepare || [];
              console.log("response : ", responsePrepare);
              // state.dataPrepare = responsePrepare;   

              const okFlag = state.dataPrepare['outputOkFlag'];
              if (!okFlag) {
                Notify.create({
                  message: 'Failed when retrive data, please try again',
                  color: 'red',
                });
                state.isLoading = false;
                return false;
              } 

              readData(responsePrepare['tQueasy33']['t-queasy33']);
            }
            state.isLoading = false;
          }
          asyncCall();
        }
        state.isLoading = false;
      }
      asyncCall();
    }

    const readData = (dataTQueasy33) => {
      state.dataTable.length = 0;
      console.log('table : ', state.dataTable);

      const tableList = state.dataPrepare['tableList']['table-list'].slice(0);
      // const tQueasy33 = state.dataPrepare['tQueasy33']['t-queasy33'];
      
      const tQueasy33 = dataTQueasy33;
      const tempTableHeaders = tableHeaders.slice();
      tempTableHeaders.splice(0, 1);
      tempTableHeaders.splice(0, 1);

      console.log('dataTable : ', tableList);
      console.log('data queasy : ', tQueasy33);
      // console.log('tableHeaders: ', tempTableHeaders);

      for (let i = 0; i<tableList.length; i++) { // 50
        const datarow = tableList[i];
        // const uhrzeit = datarow['uhrzeit'];
        const data = datarow;
        data['havedata'] = false;

        for (let q = 0; q < tQueasy33.length; q++) { // 6
          const datarowqueasy = tQueasy33[q];
    
          if (datarow['tischnr'] == datarowqueasy['number2']) {
            const time = datarowqueasy['char1'].split(";");
            const name = datarowqueasy['char2'].replace('&&', '') + " - " + time[1];                
                  
            const hour1 = time[0].substring(0, 2); 
            const hour2 = time[0].substring(4, 6);
            const minute1 = time[0].substring(2, 4); 
            const minute2 = time[0].substring(6, 8);
            const minute1Check = time[0].substring(2, 3); 
            const minute2Check = time[0].substring(6, 7);

            let dataFound = false;
            const hour1IsOdd = minute1Check > 0 ? false : true;                 
            const hour2IsOdd = minute2Check > 0 ? false : true;
            
            // console.log('minute1 : ', minute1);
            // console.log('minute2 : ', minute2);
            // console.log('tischnr : ', datarow['tischnr']);
            // console.log('name : ', name);

            for (let t = 0; t < tempTableHeaders.length; t++) {
              const label = tempTableHeaders[t]['label'];
              data['havedata'] = false;
             
              // console.log('hour1 + hour2 + label : ', hour1 + ' + ' + hour2 + ' + '+ label);

              if (dataFound) {
                if (label < hour2) {
                  data['uhrzeit' + t] = name;
                  data['havedata'] = true;
                } else {
                  if (!hour2IsOdd) {
                    data['havedata'] = true;
                    data['uhrzeit' + (t)] = name;
                  }
                  dataFound = false;
                  break;
                }
              } else {
                if (label == hour1) {
                  // console.log('uhrzeit' + t);
                  dataFound = true;
                  data['havedata'] = true;

                  if (hour1IsOdd) {
                    data['uhrzeit' + t] = name;
                  } else {
                    data['uhrzeit' + (t + 1)] = name;
                  }
                }
              }
            }

            // console.log('end -------- : ', data);
            // console.log('name : ', name);
            // console.log('hour1 : ', hour1);
            // console.log('hour2 : ', hour2);
            // console.log('minute1 : ', minute1);
            // console.log('minute2 : ', minute2);
          }
        }

        state.dataTable.push(data);
      } 

      console.log(state.dataTable);
    }

    const onClickNew = () => {
      state.flagIsEdit = false;
      state.flagIsNew = !state.flagIsNew;
      
      if (!state.flagIsNew) {
        state.flagIsNew = false;
        state.selected = [];
        state.caseType = '';
      } else {
        state.caseType = 'new'
      }
    }

    const onClickEdit = () => {
      state.flagIsNew = false;
      state.flagIsEdit = !state.flagIsEdit;

      if (!state.flagIsEdit) {
        state.flagIsEdit = false;
        state.selected = [];
        state.caseType = '';
      } else {
        state.caseType = 'edit';
      }
    }

    const selectRow = (colname, proprow, col) => {
      console.log('colname', colname);
      console.log('proprow', proprow);
      console.log('col', col);

      if (state.flagIsNew) {
        const row = proprow['row'];

        if (proprow['row']['havedata']) {
          Notify.create({
            message: 'Blocking not possible!',
            color: 'red',
          });
          return false;
        }

        if (state.selected.length == 1) {
          if (proprow.rowIndex != state.selected[0]['row']) {
            Notify.create({
              message: "Select same table's record",
              color: 'red',
            });
            return false;
          }
        }

        if (state.selected.length < 2) {
          // console.log('title', titleHeaders);

          let colval = '';
          if (col.label == ' ') {
            for (let i = 0; i<titleHeadersHelper.length; i++) {
              if (titleHeadersHelper[i]['urz'] == colname) {                    
                colval = titleHeadersHelper[i]['flagtime'];
                state.selected.push({'col' : colname , 'row' : proprow.rowIndex, 'colval': colval});
                break;
              }
            }            
          } else {
            state.selected.push({'col' : colname , 'row' : proprow.rowIndex, 'colval': col.label});
          }
          console.log('Selected : ', state.selected);

          if (state.selected.length == 2) {
            const starttime = state.selected[0]['col'].replace('uhrzeit', '');
            const endtime = state.selected[1]['col'].replace('uhrzeit', '');
            const index = endtime - starttime; 
            const lengthtime = state.selected[1]['colval'] - state.selected[0]['colval']

            if (lengthtime == 0 && index == 0) {
              if (starttime % 2) {
                let e = parseInt(state.selected[1]['colval']) + 1;
                let t = '';
                if (e<10) {
                  t = '0' + e;
                  state.selected[1]['colval'] = t + '00';
                } else {
                  state.selected[1]['colval'] = e + '00';
                }
                e = parseInt(state.selected[0]['colval']);
                state.selected[0]['colval'] = e + '30';
              } else {
                let e = parseInt(state.selected[1]['colval']) + 1;
                let t = '';
                if (e<10) {
                  t = '0' + e;
                  state.selected[1]['colval'] = t + '30';
                } else {
                  state.selected[1]['colval'] = e + '30';
                }
                e = parseInt(state.selected[0]['colval']);
                state.selected[0]['colval'] = e + '00';
              }
            } else if (lengthtime == 1 && index == 1) {
              let e = parseInt(state.selected[1]['colval']);
              let t = '';
              if (e<10) {
                t = '0' + e;
                state.selected[1]['colval'] = t + '30';
              } else {
                state.selected[1]['colval'] = e + '30';
              }
              e = parseInt(state.selected[0]['colval']);
              state.selected[0]['colval'] = e + '30';

              console.log('elseif : 1');
            } else if (lengthtime == 0 && index == 1) {
              let e = parseInt(state.selected[1]['colval']) + 1;
              let t = '';
              if (e<10) {
                t = '0' + e;
                state.selected[1]['colval'] = t + '00';
              } else {
                state.selected[1]['colval'] = e + '00';
              }
              e = parseInt(state.selected[0]['colval']);
              state.selected[0]['colval'] = e + '00';

              console.log('elseif : 2');
            } else {
              if (index % 2) {
                let s = parseInt(state.selected[0]['colval']);
                let e = parseInt(state.selected[1]['colval']) + 1;
                let t = '';
                if (e<10) {
                  t = s + '0';
                  starttime % 2 ? state.selected[0]['colval'] = t + '30' : state.selected[0]['colval'] = t + '00';
                } else {
                  starttime % 2 ? state.selected[0]['colval'] = s + '30' : state.selected[0]['colval'] = s + '00';
                }

                if (starttime % 2) {
                  state.selected[1]['colval'] = (e - 1) + '30' ;
                } else {
                  state.selected[1]['colval'] = e + '00';
                }
                console.log('genap', starttime % 2 ? 'label' : 'no label');
              } else {
                let s = parseInt(state.selected[0]['colval'])
                let e = parseInt(state.selected[1]['colval']) + 1;
                  
                let t = '';
                if (e<10) {
                  t = s + '0';
                  starttime % 2 ? state.selected[0]['colval'] = t + '30' : state.selected[0]['colval'] = t + '00';
                } else {
                  starttime % 2 ? state.selected[0]['colval'] = s + '30' : state.selected[0]['colval'] = s + '00';
                }

                if (starttime % 2) {
                  state.selected[1]['colval'] = e + '00'
                } else {
                  state.selected[1]['colval'] = (e - 1) + '30';
                }
                console.log('ganjil' , starttime % 2 ? 'label' : 'no label');
              }
            }

            state.dataSelected['duration'] = lengthtime;
            state.dataSelected['timestart'] = state.selected[0]['colval'];
            state.dataSelected['timeend'] = state.selected[1]['colval'];
            state.dataSelected['tableno'] = row['tischnr'];
            state.dataSelected['currdate'] = state.date;

            console.log('index : ', endtime + "-" + starttime + '='  + index);
            console.log('lengthtime : ', lengthtime);
            console.log('time start : ', state.selected[0]['colval']);
            console.log('time end : ', state.selected[1]['colval']);

            state.confirm = true;

            // console.log('state dialog open : ', state);
            openDialogNewTableReservation();
            // console.log('Selected : ', state.selected);
          }
        }
      // }
      } else {
        state.selected = [];
        const row = proprow['row'];

        console.log('selected : ', row);
      }
    }

    watch(
      () => props.dialogTableReservation, (show) => {
        if ((props.dialogTableReservation)) {
        //   state.dataSelected = props.dataGCF;
          getResPrepare();
        }
      }
    );

    watch(
      () => state.flagIsNew, (flagIsNew) => {
        console.log("ISNEW : ", state.flagIsNew);
      }
    );

    const openDialogNewTableReservation= () => {
      state.confirm = false;
      onDialogNewReservation(true);
    }

    const onDialogNewReservation = (val) => {
      if (!val) {
        state.selected = [];
        state.flagIsNew = false;
        getResPrepare();

      }
      state.dialogNewReservation = val;
    }

    const dialogModel = computed({
        get: () => props.dialogTableReservation,
        set: (val) => {
            emit('onDialogTableReservation', val);
        },
    });

    return {
      ...toRefs(state),
      tableHeaders,
      user,
      selectRow,
      getResPrepare,
      dialogModel,
      onClickNew,
      openDialogNewTableReservation,
      onDialogNewReservation,
      getResPlanDataLoad,
      onClickEdit,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  components: {
    searchTableResPlan: () => import('./SearchTableReservationPlan.vue'),
    dialogNewTableReservation: () => import('./DialogNewTableReservation.vue'),
    // layoutMainHeader: () => import('~/layouts/components/LayoutMainHeader.vue'),
  },
});
</script>

