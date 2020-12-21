<template>
  <!-- <div class="q-pa-md q-gutter-sm"> -->
    
  <div>
    <q-dialog
      v-model="dialogModel"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down">

      <!-- <layoutMainHeader/> -->

      <q-header elevated>
        <q-toolbar class="bg-secondary justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
              viewBox="0 0 50 50"
              width="44"
              height="44"
              class="q-ml-md" >
              <path fill="none" d="M0 0h50v50H0z" />
              <g fill="#fefefe">
                <path
                  d="M35 15v4h7c3 0 3 4 0 4h-7v12h5v-8h5c6-1 6-12-1-12h-9zM6 15l4 14 4-14h6l-7 20H7L0 15zM21 15h5v8h7v5h-7v7h-5z" />
              </g>
            </svg>

            <div class="text-weight-bold">
              {{ user.htlName }} - {{ user.htlCity }}
            </div>

            <div>
              <q-btn
                flat
                :label="user.userName"
                icon="mdi-account"
                style="text-transform: none;">
              </q-btn>
            </div>
        </q-toolbar>
      </q-header>
      
      <q-card class="bg-white text-black">
        <div>
          <div class="q-pa-lg">
            <div class="q-mb-md">
              <q-btn flat round class="q-mr-lg">
                <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
              </q-btn>

              <q-btn flat round>
                <img :src="require('~/app/icons/Icon-Print.svg')" height="30" @click="onClickNew"/>
              </q-btn>
            </div>
            
            <!-- <div class="row q-gutter-xs">
              <div class="col"> -->
                <STable
                  style="height:700px;"
                  :loading="isLoading"
                  dense
                  :data="dataTable"
                  row-key="name"
                  :columns="tableHeaders"
                  separator="cell"
                  :rows-per-page-options="[10, 13, 16]"
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
                  <searchTableResPlan :searches="searches"/>
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
  confirm: boolean
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
      caseType: '',
      confirm: false,
    });
    
    let title = [] as any;
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

    const tableHeaders = [] as any;
    let resetDate = false;
    let indexTitle = 0;
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
          field: "uhrzeit" + (i - 2),
          name: "uhrzeit" + (i - 2),
          format: val => `${val}`,
          align: "right", 
          style: 'width: 100px',
          headerStyle: 'width: 300px',
        }); 
      }
    }

    let titleHeaders = [{
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

          state.dataTable = [];
          const datatable = state.dataPrepare['tableList']['table-list'];
          for (let i = 0; i<datatable.length; i++) {
            const datarow = datatable[i];
            let data = datarow;

            for (let y = 0; y<state.dataPrepare['tQueasy33']['t-queasy33'].length; y++) {
              const datarowqueasy = state.dataPrepare['tQueasy33']['t-queasy33'][y];

              if (datarow['tischnr'] == datarowqueasy['number2']) {
                const time = datarowqueasy['char1'].split(";");
                const name = datarowqueasy['char2'] + " - " + time[1];                
                
                const hour1 = time[0].substring(0, 2); //19
                const hour2 = time[0].substring(4, 6); //20
                const minute1 = time[0].substring(2, 3); 
                const minute2 = time[0].substring(6, 7); 
                
                for (let v = 0; v<title.length; v++) {
                  if (hour1 == title[v]) {
                    let index = hour2 - hour1; 
                    if (index != 0 && minute2 < 30) {
                      index = index * 2;
                    } else if (index == 0) {
                      index = 1;
                    }

                    for (let k = 0; k<index; k++) {
                      if (hour2 >= title[v]) {
                        datarow['uhrzeit'][v] = name;
                        v++;
                      }
                    }
                    break;
                  }
                }
                // console.log(datarow);
              }
            }

            for (let x = 0; x<datarow['uhrzeit'].length; x++) {
              let x1 = x.toString();
              if (x < 10) {
                x1 = '0' + x.toString();
              } 
              data['uhrzeit' + x1] = datarow['uhrzeit'][x];
            }
            state.dataTable.push(data);
          }
        }
        state.isLoading = false;
      }
      asyncCall();
    };

    const onClickNew = () => {
      state.flagIsNew = !state.flagIsNew;
      if (!state.flagIsNew) {
        state.flagIsNew = false;
        state.selected = [];
        state.caseType = '';
      } else {
        state.caseType = 'new'
      }
    }

    const selectRow = (colname, proprow, col) => {
      // console.log('colname', colname);
      // console.log('proprow', proprow);
      // console.log('col', col);

      if (state.flagIsNew) {
        const row = proprow['row'];
        // console.log('value : ', col['value']);
        
        // if (col['value'] != undefined) {
        //   Notify.create({
        //     message: 'Blocking not possible!',
        //     color: 'red',
        //   });
        // } else 
        // {
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
              for (let i = 0; i<titleHeaders.length; i++) {
                if (titleHeaders[i]['urz'] == colname) {
                  // console.log('i', i);
                  // if (state.selected.length == 0) {
                  //   colval = titleHeaders[i]['flagtime'] + '30';
                  // } else {
                    // colval = titleHeaders[i]['flagtime'];
                  // }                
                                        
                  colval = titleHeaders[i]['flagtime'];
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
              state.dataSelected['currdate'] = state.dataPrepare['dParam87']

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
      }

  {
      // if(state.selected.hasOwnProperty(index)) {
      //   state.selected[index].indexOf(value)==-1?state.selected[index].push(value):state.selected[index].splice(state.selected[index].indexOf(value),1)
      // } else {
      //   state.selected[index]=[];
      //   state.selected[index].push(value);
      //   state.selected = Object.assign({},state.selected)
      // }
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

