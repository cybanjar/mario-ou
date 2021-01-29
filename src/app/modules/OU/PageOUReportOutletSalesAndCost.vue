<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletSalesAndCost :searches="searches" @onSearch="onSearch" />
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
    let charts = [];

    const state = reactive({
      isFetching: true,
      build: [],
      dataPrepare:{},
      searches: {
        deptList: [],
        fromDept: [],
        fromDeptVal: null,
        toDept: [],
        toDeptVal: null,
        date: {start: (new Date()), end: (new Date())},
        categoryList: [{
            'label': 'All',
            'value': 4
        }, {
            'label': 'Beverage',
            'value': 2
        }, {
            'label': 'Other',
            'value': 3
        }, {
            'label': 'Food',
            'value': 1
        }],
        categoryValue : {
            'label': 'All',
            'value': 4
        },
        checkDetailOutletSalesOnly: false,
        checkMiCompli: false,
      }, 
    });

    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('fbSalesCostReportPrepare', {}),
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
        console.log('response Prepare : ', responsePrepare);

        const fdate = new Date(responsePrepare.fromDate);
        const tdate = new Date(responsePrepare.toDate);
        state.searches.date.start = fdate;
        state.searches.date.end = tdate;

        getDataHotel();

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

    const getDataHotel = () => {
        state.isFetching = true;
        
        async function asyncCall() {
            const [dataDept] = await Promise.all([
                $api.outlet.getCommonOutletUserList('loadHotelDepartment', {}),
            ]);

            if (dataDept) {
                const response = dataDept || [];
                const okFlag = response['outputOkFlag'];

                if (!okFlag) {
                    Notify.create({
                        message: 'Failed when retrive data, please try again',
                        color: 'red',
                    });
                    state.isFetching = false;
                    return false;
                }
                state.dataPrepare['dataHotel'] = response; 
                console.log('loadHotelDepartment : ', dataDept);
                const deptList = state.dataPrepare['dataHotel']['tHoteldpt']['t-hoteldpt'];
                const fromDept = [] as any;

                for (let i = 0; i<deptList.length; i++) {
                    const datarow = deptList[i];
                    const deptnum = deptList[i]['num'];
                    const mindept = 1;
                    const maxdept = 14;

                    if (deptnum >= mindept) {
                        if (deptnum == maxdept) {
                            fromDept.push(datarow);
                            break;
                        } else {
                            fromDept.push(datarow);
                        }
                    } 
                }      
                state.dataPrepare['dataHotel']['tHoteldpt']['t-hoteldpt'] = fromDept;
                state.searches.fromDept = mapOU(state.dataPrepare['dataHotel']['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
                state.searches.toDept = mapOU(state.dataPrepare['dataHotel']['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
                state.searches.deptList = state.searches.fromDept; 

                for (let i = 0; i<state.searches.fromDept.length; i++) {
                    if (1 == state.searches.fromDept[i]['value']) {
                        state.searches.fromDeptVal = state.searches.fromDept[i];
                        break;
                    }
                }

                for (let i = 0; i<state.searches.toDept.length; i++) {
                    if (14 == state.searches.toDept[i]['value']) {
                        state.searches.toDeptVal = state.searches.toDept[i];
                        break;
                    }
                }

                state.isFetching = false;
            }
        }
      asyncCall();
    }

    const tableHeaders = [
        {
            label: "Departement",
            field: "departement",
            sortable: false,
            align: "left",
            width: 150,
            divider: true
        },{
            label: "Qty", 
            field: "qty",
            sortable: false,
            align: "right",
            width: 100,
            divider: true
        }, {
            label: "Sales", 
            field: "sales",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        }, {
            label: "Cost", 
            field: "cost",
            sortable: false,
            align: "right",
            width: 150, 
            divider: true
        },{
            label: "Qty ", 
            field: "qty2",
            sortable: false,
            align: "right",
            width: 100, 
            divider: true
        }, {
            label: "Compliment", 
            field: "compliment",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        },{
            label: "Total - Cost", 
            field: "t-cost",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        }, {
            label: "Ratio", 
            field: "ratio",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        },  {
            label: "MTD - Qty", 
            field: "m-qty",
            sortable: false,
            align: "right",
        },  {
            label: "MTD - Sales", 
            field: "m-sales",
            sortable: false,
            align: "right",
        },  {
            label: "Cost", 
            field: "m-cost",
            sortable: false,
            align: "right",
        },  {
            label: "MTD - Qty", 
            field: "m-qty2",
            sortable: false,
            align: "right",
        }, {
            label: "Compliment", 
            field: "compliment2",
            sortable: false,
            align: "right",
        }, {
            label: "Total-Cost", 
            field: "t-cost2",
            sortable: false,
            align: "right",
        }, {
            label: "Ratio", 
            field: "ratio2",
            sortable: false,
            align: "right",
        }
    ];
    
    const onSearch = (state2) => {
      state.isFetching = true;
        
      async function asyncCall() {
        const [dataResponse] = await Promise.all([
          $api.outlet.getOUTableList('fbSalesCostReportList', {
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            fromDept: state2.fromDeptVal.value,
            toDept: state2.toDeptVal.value,
            fact1: 1,  
            shortFlag: true,
            priceDecimal: state.dataPrepare['priceDecimal'],
            sorttype: state2.categoryValue['value'],
            detailed: state2.checkDetailOutletSalesOnly,
            miCompliChecked: state2.checkMiCompli,
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

          console.log('Load Data : ', data);
          
          state.build = [];
          charts = data.outputList['fb-cost-report'];

          // for (let i=0; i<charts.length; i++) {
          //     charts[i]["artno"] = charts[i]["artno"] == "0" ? "" : charts[i]["artno"]; 
          //     charts[i]["day-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["day-gros"]);
          //     charts[i]["day-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["day-net"]);
          //     charts[i]["day-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["day-proz"]);
          //     charts[i]["todate-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["todate-gros"]);
          //     charts[i]["todate-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["todate-proz"]);
          //     charts[i]["todate-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : (charts[i]["todate-net"]);
          //     charts[i]["mqty"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : charts[i]["mqty"];

          //     // charts[i]["day-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["day-gros"]);
          //     // charts[i]["day-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["day-net"]);
         //     // charts[i]["todate-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["todate-proz"]);
         //     // charts[i]["day-proz"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["day-proz"]);
          //     // charts[i]["todate-gros"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["todate-gros"]);
            //     // charts[i]["todate-net"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : this.formatterMoney(charts[i]["todate-net"]);
          //     // charts[i]["mqty"] = (charts[i]["artno"] == "" && charts[i]["descr"] == "") ? "" : charts[i]["mqty"];
          // }
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
      getDataHotel,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    searchOutletSalesAndCost: () => import('./components/SearchOutletSalesAndCost.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
