<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchDailySalesByUser :searches="searches" :dataPrepare="dataPrepare" @assignDataTable="assignDataTable" />
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
        :rows-per-page-options="[10, 13, 16]"
        :visible-columns="visibleColumns"
        :pagination.sync="pagination">
    </STable>
    
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { Notify } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;

    const state = reactive({
      isFetching: true,
      build: [],
      dataSelected: {},
      dataPrepare:{},
      visibleColumns: ["rechnr", "belegung", "bezeich0", "bezeich1", "bezeich2", "bezeich3", "bezeich4", "t-service", "t-tax", "t-debit", "p-cash", 
                        "p-cash1", "r-transfer", "c-ledger", "info", "gname"],
      searches: {
        deptList: [],
        dept: [],
        deptVal: null,
        date: {start: new Date(), end: new Date()},
        checkSuppressComp: false,
        checkDiscToFood: false, 
        checkExcludeComp: false,
        showMultiCash: false
      },
    });

    const tableHeaders = [
        {
            label: "Bill Number",
            name: "rechnr",
            field: "rechnr",
            sortable: false,
            align: "left",
        },{
            label: "Pax", 
            name: "belegung",
            field: "belegung",
            sortable: false,
            align: "left",
        }, {
            label: "", 
            name: "bezeich0",
            field: "bezeich0",
            sortable: false,
            align: "left",
        }, {
            label: "", 
            name: "bezeich1",
            field: "bezeich1",
            sortable: false,
            align: "left",
        },{
            label: "", 
            name: "bezeich2",
            field: "bezeich2",
            sortable: false,
            align: "left",
        },  {
            label: "", 
            name: "bezeich3",
            field: "bezeich3",
            sortable: false,
            align: "left",
        }, {
            label: "", 
            name: "bezeich4",
            field: "bezeich4",
            sortable: false,
            align: "left",
        },{
            label: "Service", 
            name: "t-service",
            field: "t-service",
            sortable: false,
            align: "right",
        },{
            label: "Tax", 
            name: "t-tax",
            field: "t-tax",
            sortable: false,
            align: "right",
        }, {
            label: "Total", 
            name: "t-debit",
            field: "t-debit",
            sortable: false,
            align: "right",
        },{
            label: "Cash", 
            name: "p-cash",
            field: "p-cash",
            sortable: false,
            align: "right",
        },{
            label: "Currency", 
            name: "p-curr",
            field: "p-curr",
            sortable: false,
            align: "right",
        },{
            label: "Cash", 
            name: "p-cash1",
            field: "p-cash1",
            sortable: false,
            align: "right",
        },{
            label: "Transfer", 
            name: "r-transfer",
            field: "r-transfer",
            sortable: false,
            align: "right",
        },{
            label: "Card / City Ledger", 
            name: "c-ledger",
            field: "c-ledger",
            sortable: false,
            align: "right",
        },{
            label: "Info", 
            name: "info",
            field: "info",
            sortable: false,
            align: "left",
        },{
            label: "Guest Name", 
            name: "gname",
            field: "gname",
            sortable: false,
            align: "left",
        },
    ];

    onMounted(async () => {        
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('dailySalesReportP2Prepare', {}),
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
          return false;
        }

        const fdate = new Date(responsePrepare.fromDate);
        const tdate = new Date(responsePrepare.toDate);
        state.searches.date.start = fdate;
        state.searches.date.end = tdate;

        const deptList = responsePrepare.htlDept['htl-dept'];

        state.searches.dept = mapOU(deptList, 'dptnr', 'bezeich');
        state.searches.deptList = state.searches.dept; 

        for (let i = 0; i<state.searches.dept.length; i++) {
          const currFromDept = state.dataPrepare['currDept'];
          if (currFromDept == state.searches.dept[i]['value']) {
            state.searches.deptVal = state.searches.dept[i];
            break;
          }
        }

        tableHeaders[2]['label'] = state.dataPrepare['bezeich'][0];
        tableHeaders[3]['label'] = state.dataPrepare['bezeich'][1];
        tableHeaders[4]['label'] = state.dataPrepare['bezeich'][2];
        tableHeaders[5]['label'] = state.dataPrepare['bezeich'][3];
        tableHeaders[6]['label'] = state.dataPrepare['bezeich'][4];
        tableHeaders[10]['label'] = tableHeaders[10]['label'] + " " + state.dataPrepare['currLocal'];
        tableHeaders[12]['label'] = tableHeaders[12]['label'] + " " + state.dataPrepare['currForeign'];
      } else {
        Notify.create({
          message: 'Please check your internet connection',
          color: 'red',
        });
        return false;
      }
      state.isFetching = false;
    });  

    const assignDataTable = (state2) => {
      const data = state2['0'];

      if (data == null) {
        Notify.create({
          message: 'Please check your internet connection',
          color: 'red',
        });
        return false;
      }

      const okFlag = data['outputOkFlag'];
      if (!okFlag) {
        Notify.create({
          message: 'Failed when retrive data, please try again',
          color: 'red',
        });
        return false;
      }

      if (state.searches.showMultiCash) { 
        state.visibleColumns.splice(11, 0, "p-curr");
        tableHeaders[12]['label'] = "MultiCash";
      } else {
        if (state.visibleColumns[11] == "p-curr") {
          const col = [] as any;
          for (let i = 0; i<state.visibleColumns.length; i++) {
            if (state.visibleColumns[i] != "p-curr") {
              col.push(state.visibleColumns[i]);
            }
          }
          state.visibleColumns = col;
          tableHeaders[12]['label'] = "Cash " + state.dataPrepare['currForeign'];
        }
      }

      state.build = [];
      const dataTurnover = data['turnover']['turnover'];
      for (let i = 0; i<dataTurnover.length; i++) {
        dataTurnover[i]['bezeich0'] = dataTurnover[i]['betrag'][0];
        dataTurnover[i]['bezeich1'] = dataTurnover[i]['betrag'][1];
        dataTurnover[i]['bezeich2'] = dataTurnover[i]['betrag'][2];
        dataTurnover[i]['bezeich3'] = dataTurnover[i]['betrag'][3];
        dataTurnover[i]['bezeich4'] = dataTurnover[i]['betrag'][4];
      }
      state.build = dataTurnover;
    };

    function doPrint() {
      if (state.build.length !== 0) {  
        PrintJs(state.build, tableHeaders, 'Report Daily Sales By User');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      assignDataTable,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint,
    };
  },
  components: {
    searchDailySalesByUser: () => import('./components/SearchDailySalesByUser.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
