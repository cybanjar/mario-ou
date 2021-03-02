<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchComplimentReport :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
    </div>

    <STable
        :loading="isFetching"
        dense
        :data="build"
        :columns="tableHeaders"
        id="printMe"
        separator="cell"
        @row-click="onRowClick"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination">
        <template #body-cell-actions="props">
          <q-td :props="props" class="fixed-col right">
            <q-icon name="mdi-dots-vertical" size="16px">
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable v-ripple @click="showDialog(props.row)">
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>

        <template v-slot:body-cell-active="props">
          <q-td :props="props" :class="props.row.name != '' ? 'text-red':'text-black'">
            {{props.row['name']}}
          </q-td>
      </template>
    </STable>
    
    <dialogComplimentReportEdit :dialog="dialog" @onDialog="onDialog" :data-selected="dataSelected" />

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { date, Notify } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts = [] as any;

    const state = reactive({
      isFetching: true,
      build: [],
      dataSelected: {},
      dataPrepare:{},
      searches: {
        displayList: [
        {
            label: 'All Guest Name',
            value: 0
        },{
            label: 'Specific Name',
            value: 1
        }],
        display: {
            label: 'All Guest Name',
            value: 0
        },
        gnameList: [],
        gname: null,
        deptList: [],
        fromDept: [],
        fromDeptVal: null,
        toDept: [],
        toDeptVal: null,
        dispCheck: false,
        date: {start: new Date(), end: new Date()},
        optionSortType: '1',
      },
      dialog: false,
    });

    const tableHeaders = [
        {
            label: "Date",
            field: "datum",
            sortable: false,
            align: "left",
        },{
            label: "Department", 
            field: "deptname",
            sortable: false,
            align: "left",
        }, {
            label: "Bill Number", 
            field: "rechnr",
            sortable: false,
            align: "right",
        }, {
            label: "Guest Name", 
            field: "name",
            sortable: false,
            align: "left",
            classes (val) {
              return val.name != '' ? 'color:red;' : 'color:white;'
            },
        },{
            label: "Payment Article", 
            field: "p-artnr",
            sortable: false,
            align: "right",
        },  {
            label: "Description", 
            field: "bezeich",
            sortable: false,
            align: "left",
        }, {
            label: "Bill Amount", 
            field: "betrag",
            sortable: false,
            align: "right",
        }, {
            label: "Food Amount", 
            field: "f-betrag",
            sortable: false,
            align: "right",
        },{
            label: "Food Cost", 
            field: "f-cost",
            sortable: false,
            align: "right",
        },{
            label: "Beverage Amount", 
            field: "b-betrag",
            sortable: false,
            align: "right",
        }, {
            label: "Beverage Cost", 
            field: "b-cost",
            sortable: false,
            align: "right",
        },{
            label: "Cost of Sales", 
            field: "t-cost",
            sortable: false,
            align: "right",
        },{
            label: "Detailed", 
            field: "detailed",
            sortable: false,
            align: "left",
        },{ 
            name: 'actions',
            field: 'actions' 
        },
    ];

    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('complimentReportPrepare', {}),
      ]);

      if (data) {
        responsePrepare = data || [];
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

        const fdate = new Date(responsePrepare.billdate);
        const billDate = date.addToDate(fdate, {days: -1});
        state.searches.date.start = billDate;
        state.searches.date.end = billDate;

        const deptList = responsePrepare.tHoteldpt['t-hoteldpt'];
        const allDept = [] as any;

        for (let i = 0; i<deptList.length; i++) {
            const datarow = deptList[i];
            const deptnum = deptList[i]['num'];
            const mindept = state.dataPrepare['minDept'];
            const maxdept = state.dataPrepare['maxDept'];

            if (deptnum >= mindept) {
              if (deptnum == maxdept) {
                  allDept.push(datarow);
                  break;
              } else {
                  allDept.push(datarow);
              }
            } 
        }      
        state.dataPrepare['tHoteldpt']['t-hoteldpt'] = allDept;
        state.searches.fromDept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
        state.searches.toDept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
        state.searches.deptList = state.searches.fromDept; 

        for (let i = 0; i<state.searches.fromDept.length; i++) {
          const currFromDept = state.dataPrepare['fromDept'];
          if (currFromDept == state.searches.fromDept[i]['value']) {
            state.searches.fromDeptVal = state.searches.fromDept[i];
            break;
          }
        }

        for (let i = 0; i<state.searches.toDept.length; i++) {
          const currToDept = state.dataPrepare['toDept'];
          if (currToDept == state.searches.toDept[i]['value']) {
            state.searches.toDeptVal = state.searches.toDept[i];
            break;
          }
        }
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

    const onDialog = (val, flagSave) => {
      if (!val) {
        state.dataSelected = {};
      }

      if (!val && flagSave) {       
        const state2 = {
          date: state.searches.date,
          gname: state.searches.gname,
          fromDeptVal: state.searches['fromDeptVal'],
          toDeptVal: state.searches['toDeptVal']
        // eslint-disable-next-line @typescript-eslint/ban-types
        } as {};

        state.isFetching = true;
       
        async function asyncCall() {
          const [dataResponse] = await Promise.all([
            $api.outlet.getOUTableList('complimentReportList', {
              pvILanguage: 1, 
              gname: state.searches.display['value'] == 0 ? " " : state2['gname']['value'], 
              sorttype: state.searches.optionSortType, 
              fromDept: state2['fromDeptVal']['value'], 
              toDept: state2['toDeptVal']['value'], 
              fromDate: date.formatDate(state2['date']['start'], 'MM/DD/YYYY'), 
              toDate: date.formatDate(state2['date']['end'], 'MM/DD/YYYY'), 
              doubleCurrency: state.dataPrepare['doubleCurrency'], 
              exchgRate: state.dataPrepare['exchgRate'], 
              billdate: date.formatDate(state.dataPrepare['billdate'], 'MM/DD/YYYY'), 
              miDetail1: false, 
              smDisp1: true, 
              foreignNr: state.dataPrepare['foreignNr'], 
              artnr: " ",
            }),
          ]);

          if (dataResponse) {
            const data = dataResponse || [];
            const okFlag = data['outputOkFlag'];
            if (!okFlag ) {
              Notify.create({
                message: 'Failed when retrive data, please try again',
                color: 'red',
              });
              state.isFetching = false;
              return false;
            }
            state.build = [];
            charts = data.cList['c-list'];                 
              
            for (let i=0; i<charts.length; i++) {
              charts[i]["dbilldate"] = charts[i]["datum"],
              charts[i]["datum"] = date.formatDate(charts[i]["datum"], 'DD/MM/YYYY');
              // charts[i]["amount"] = this.formatterMoney(dataTable[i]["amount"]);
              charts[i]["p-artnr"] = charts[i]["dbilldate"] != null ? charts[i]["p-artnr"] : ""; 
              charts[i]["rechnr"] = charts[i]["dbilldate"] != null ? charts[i]["rechnr"] : " ";
              charts[i]["detailed"] = charts[i]["dbilldate"] != null ? charts[i]["detailed"] : " ";
              charts[i]['detailed'] = (charts[i]["dbilldate"] != null) && (charts[i]['detailed'] == true) ? 'YES' : 'NO'; 
            }
            state.build = charts;
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
      state.dialog = val;
    };

    const onRowClick = (_, dataRow) => {
        state.dataSelected = dataRow;
    };

    const showDialog = (dataRow) => {
      state.dataSelected = dataRow;
      onDialog(true, false);
    };

    const onSearch = (state2) => {
      state.isFetching = true;
       
      async function asyncCall() {
        const [dataResponse] = await Promise.all([
          $api.outlet.getOUTableList('complimentReportList', {
            pvILanguage: 1, 
            gname: state2.display['value'] == 0 ? " " : state2.gname['value'], 
            sorttype: state2.optionSortType, 
            fromDept: state2.fromDeptVal['value'], 
            toDept: state2.toDeptVal['value'], 
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'), 
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'), 
            doubleCurrency: state.dataPrepare['doubleCurrency'], 
            exchgRate: state.dataPrepare['exchgRate'], 
            billdate: date.formatDate(state.dataPrepare['billdate'], 'MM/DD/YYYY'), 
            miDetail1: false, 
            smDisp1: true, 
            foreignNr: state.dataPrepare['foreignNr'], 
            artnr: " ",
          }),
        ]);

        if (dataResponse) {
         const data = dataResponse || [];
          const okFlag = data['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
          state.isFetching = false;
          return false;
          }
          state.build = [];
          charts = data.cList['c-list']; 
                  
          for (let i=0; i<charts.length; i++) {
            charts[i]["dbilldate"] = charts[i]["datum"],
            charts[i]["datum"] = date.formatDate(charts[i]["datum"], 'DD/MM/YYYY');
            // charts[i]["amount"] = this.formatterMoney(dataTable[i]["amount"]);
            charts[i]["p-artnr"] = charts[i]["dbilldate"] != null ? charts[i]["p-artnr"] : ""; 
            charts[i]["rechnr"] = charts[i]["dbilldate"] != null ? charts[i]["rechnr"] : " ";
            charts[i]["detailed"] = charts[i]["dbilldate"] != null ? charts[i]["detailed"] : " ";
            charts[i]['detailed'] = (charts[i]["dbilldate"] != null) && (charts[i]['detailed'] == true) ? 'YES' : 'NO'; 
          }
          state.build = charts;
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
    };

    function doPrint() {
      if (state.build.length !== 0) {  
        PrintJs(state.build, tableHeaders, 'Report Compliment Report');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      onRowClick,
      onDialog,
      showDialog,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint
    };
  },
  components: {
    searchComplimentReport: () => import('./components/SearchComplimentReport.vue'),
    dialogComplimentReportEdit: () => import('./components/DialogComplimentReportEdit.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
