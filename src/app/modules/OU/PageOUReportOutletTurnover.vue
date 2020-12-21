<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletTurnOver :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <STable
        :loading="isFetching"
        dense
        :data="build"
        :columns="tableHeaders"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { date, Notify } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts = [] as any;

    const state = reactive({
      isFetching: true,
      build: [],
      dataPrepare:{},
      searches: {
        deptList: [],
        fromDeptVal: null,
        fromDept: [],
        toDeptVal: null,
        toDept: [],
        date: (new Date()),
        incNotSoldItems: (false),
        incLaundryDrugstore : (false)

      },
    });

    const tableHeaders = [
        {
            label: "ArtNo",
            field: "artno",
            sortable: false,
            align: "right",
            width: 120,
            divider: true
        },{
            label: "Description", 
            field: "descr",
            sortable: false,
            align: "left",
            width: 200,
            divider: true
        }, {
            label: "Day Nett", 
            field: "day-net",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        }, {
            label: "Day Gross", 
            field: "day-gros",
            sortable: false,
            align: "right",
            width: 150, 
            divider: true
        },{
            label: "%", 
            field: "day-proz",
            sortable: false,
            align: "right",
            width: 150, 
            divider: true
        }, {
            label: "Todate Nett", 
            field: "todate-net",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        },{
            label: "Todate Gross", 
            field: "todate-gros",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        }, {
            label: "%", 
            field: "todate-proz",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        },  {
            label: "MTD Qty", 
            field: "mqty",
            sortable: false,
            align: "right",
        }
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('turnoverByDeptPrepare', {}),
      ]);

      if (data) {
        responsePrepare = data || [];
        const okFlag = responsePrepare['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
        }
        state.dataPrepare = responsePrepare;   

        const todate = new Date(responsePrepare.toDate);
        state.searches.date = todate;
        
        const deptList = state.dataPrepare['tHoteldpt']['t-hoteldpt'];
        const fromDept = [] as any;

        for (let i = 0; i<deptList.length; i++) {
            const datarow = deptList[i];
            const deptnum = deptList[i]['num'];
            const mindept = state.dataPrepare['fromDept'];
            const maxdept = state.dataPrepare['toDept'];

            if (deptnum >= mindept) {
              if (deptnum == maxdept) {
                  fromDept.push(datarow);
                  break;
              } else {
                  fromDept.push(datarow);
              }
            } 
        }      
        state.dataPrepare['tHoteldpt']['t-hoteldpt'] = fromDept;
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

    const onSearch = (state2) => {
      state.isFetching = true;
        
      async function asyncCall() {
        const [dataResponse] = await Promise.all([
          $api.outlet.getOUTableList('turnoverByDeptList', {
            fromDate: date.formatDate(state2.date, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date, 'MM/DD/YYYY'),
            ldryFlag: state2.incLaundryDrugstore,
            ldry: state.dataPrepare['ldry'],
            dstore: state.dataPrepare['dstore'],
            fromDept: state2.fromDeptVal.value,
            toDept: state2.toDeptVal.value,
            detailed: state2.incNotSoldItems,
            longDigit: state.dataPrepare['longDigit'],            
          }),
        ]);

        if (dataResponse) {
          const data  = dataResponse || [];
          const okFlag = data ['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }
          state.build = [];
          charts = data.turnReportlist['turn-reportlist'];

          for (let i=0; i<charts.length; i++) {
            charts[i]["artno"] = charts[i]["artno"] == "0" ? "" : charts[i]["artno"]; 
            charts[i]["day-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["day-gros"]);
            charts[i]["day-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["day-net"]);
            charts[i]["day-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["day-proz"]);
            charts[i]["todate-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["todate-gros"]);
            charts[i]["todate-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["todate-proz"]);
            charts[i]["todate-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["todate-net"]);
            charts[i]["mqty"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : charts[i]["mqty"];

            // charts[i]["day-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["day-gros"]);
            // charts[i]["day-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["day-net"]);
            // charts[i]["day-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["day-proz"]);
            // charts[i]["todate-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["todate-gros"]);
            // charts[i]["todate-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["todate-proz"]);
            // charts[i]["todate-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["todate-net"]);
            // charts[i]["mqty"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : charts[i]["mqty"];
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

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    searchOutletTurnOver: () => import('./components/SearchOutletTurnOver.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
