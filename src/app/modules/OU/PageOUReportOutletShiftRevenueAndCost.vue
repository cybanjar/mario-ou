<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletShiftRevenueAndCost :searches="searches" @onSearch="onSearch" />
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
import {defineComponent, onMounted, toRefs, reactive} from '@vue/composition-api';
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
        flagPrintIncTotal: (false),
      },
    });

    const tableHeaders = [
        {
            label: "Description",
            field: "bezeich",
            sortable: false,
            align: "left",
            width: 120,
            divider: true
        },{
            label: "Guest", 
            field: "guest",
            sortable: false,
            align: "right",
            width: 200,
            divider: true
        }, {
            label: "Guest Revenue", 
            field: "grev",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        }, {
            label: "Average", 
            field: "gavg",
            sortable: false,
            align: "right",
            width: 150, 
            divider: true
        },{
            label: "(%)", 
            field: "gproz",
            sortable: false,
            align: "right",
            width: 150, 
            divider: true
        }, {
            label: "Guest Cost", 
            field: "gcost",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        },{
            label: "WIG", 
            field: "wig",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        }, {
            label: "WIG Revenue", 
            field: "wrev",
            sortable: false,
            align: "right",
            width: 150,
            divider: true
        },  {
            label: "Average", 
            field: "wavg",
            sortable: false,
            align: "right",
        },  {
            label: "(%)", 
            field: "wproz",
            sortable: false,
            align: "right",
        },  {
            label: "WIG Cost", 
            field: "wcost",
            sortable: false,
            align: "right",
        },  {
            label: "TTL", 
            field: "ttl",
            sortable: false,
            align: "right",
        },  {
            label: "Total Revenue", 
            field: "trev",
            sortable: false,
            align: "right",
        },  {
            label: "Total Cost", 
            field: "tcost",
            sortable: false,
            align: "right",
        }
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('fbSalesReportPrepare', {
          fdept: '1',
          tdept: '1'
        }),
      ]);

      if (data) {
        responsePrepare = data || [];
        let okFlag = responsePrepare['outputOkFlag'];
        if (!okFlag ) {
          Notify.create({
            message: 'Failed when retrive data, please try again',
            color: 'red',
          });
          state.isFetching = false;
          return false;
        }
        state.dataPrepare = responsePrepare;   
        
        const [dataHotel] = await Promise.all([
          $api.outlet.getCommonOutletUserList('loadHotelDepartment', {}),
        ]);

        if (dataHotel) {
          const responseDataHotel = dataHotel || [];
          okFlag = responseDataHotel['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }

          const ciDate = new Date(responsePrepare.ciDate);
          state.searches.date.start = ciDate;
          state.searches.date.end = ciDate;

          const deptList = responseDataHotel.tHoteldpt['t-hoteldpt'];
          state.dataPrepare['tHoteldpt']['t-hoteldpt'] = deptList;
          state.searches.fromDept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
          state.searches.toDept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
          state.searches.deptList = state.searches.fromDept;
          
          const fdptStr = state.dataPrepare['fdptStr'];
          const tdptStr = state.dataPrepare['tdptStr'];

          for(let i = 0; i<state.searches.deptList.length; i++) {
            const depart = deptList[i]['depart'];

            if (depart == fdptStr) {
              state.searches.fromDeptVal = state.searches.deptList[i];
            } 

            if (depart == tdptStr) {
              state.searches.toDeptVal = state.searches.deptList[i];
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
          $api.outlet.getOUTableList('fbSalesReportList', {
            languageCode: '1',
            fdate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            tdate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            fdept: state2.fromDeptVal.value,
            tdept: state2.toDeptVal.value,
            priceDecimal: state.dataPrepare['priceDecimal'],
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
          charts = data['fbSalesbyshift']['fb-salesbyshift'];

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
    searchOutletShiftRevenueAndCost: () => import('./components/SearchOutletShiftRevenueAndCost.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
