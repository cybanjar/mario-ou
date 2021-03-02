<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletUserTransaction :searches="searches" @onSearch="onSearch" />
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
        row-key="name"
        separator="cell"
        :rows-per-page-options="[10, 13, 16]"
        :pagination.sync="pagination"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { mapOU4Label } from '~/app/helpers/mapSelectItems.helpers';
import { date, Notify } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;

    let charts = [] as any;

    const state = reactive({
      isFetching: true,
      build: [],
      dataPrepare:{},
      searches: {
        userList: [],
        date: {end: new Date() , start: new Date()},
      },
    });

    const tableHeaders = [
        {
            label: "Date",
            field: "datum",
            name: "datum",
            sortable: false,
            align: "left"
        },{
            label: "Table Number", 
            field: "tabelno",
            name: "tabelno",
            sortable: false,
            align: "left"
        }, {
            label: "Bill Number", 
            field: "billno",
            name: "billno",
            sortable: false,
            align: "left"
        }, {
            label: "Article Number", 
            field: "artno",
            name: "artno",
            sortable: false,
            align: "left"
        }, {
            label: "Description", 
            field: "descr",
            name: "descr",
            sortable: false,
            align: "left"
            },{
            label: "Quantity", 
            field: "qty",
            name: "qty",
            sortable: false,
            align: "right"
        }, {
            label: "Amount", 
            field: "amount",
            name: "amount",
            sortable: false,
            align: "right"
        },  {
            label: "Department", 
            field: "depart",
            name: "depart",
            sortable: false,
            align: "left"
        }, {
            label: "Time", 
            field: "zeit",
            name: "zeit",
            sortable: false,
            align: "left"
        },  {
            label: "Posting ID", 
            field: "id",
            name: "id",
            sortable: false,
            align: "left"
        }, {
            label: "Payment ID", 
            field: "tb",
            name: "tb",
            sortable: false,
            align: "left"
        } 
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('restUsrJournalPrepare', {}),
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
        state.searches.date.start = new Date(state.dataPrepare['fromDate']);
        state.searches.date.end = new Date(state.dataPrepare['toDate']);          
        
        const [dataUser] = await Promise.all([
          $api.outlet.getCommonOutletUserList('loadHUser', {
              currDept: "01",
              kname: " "
          }),
        ]);

        if (dataUser) {
          const responseUser = dataUser || [];
          const dataSearch = [] as any;      

          okFlag = responseUser['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }

          for (let i=0; i<responseUser.tKellner['t-kellner'].length; i++) {
            const datarowuser = responseUser.tKellner['t-kellner'][i];
            const dept = datarowuser['departement'];

            for (let x=0; x<responseUser.tHoteldpt['t-hoteldpt'].length; x++) {
              const datarowdpt = responseUser.tHoteldpt['t-hoteldpt'][x];
              const deptnum = datarowdpt.num;
              const deptname = datarowdpt.depart;
              
              if (dept == deptnum) {
                datarowuser['deptname'] = deptname;
                break;
              }
            }
            dataSearch.push(datarowuser);
          }
          state.searches.userList = dataSearch;
          state.searches.userList = mapOU4Label(state.searches.userList, 'kellner-nr', 'departement', 'deptname', 'kellner-nr', 'kellnername');
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
          $api.outlet.getOUTableList('restUsrJournalList', {
            usrInit: state2.userID.value,
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            sumFlag: state2.showAllUser,
            currDept: state2.userID.label.split("-")[0].trim(),
            priceDecimal: state2.priceDecimal,
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
          charts = data.restJourList['rest-jour-list'];
          
          for (let i = 0; i<charts.length; i++) {
            charts[i]["datum"] = charts[i]["datum"] == null ? "" : date.formatDate(charts[i]["datum"], "DD/MM/YYYY");
            charts[i]["billno"] = charts[i]["datum"] == "" ? "" : charts[i]["billno"]
            charts[i]["artno"] = charts[i]["datum"] == "" ? "" : charts[i]["artno"]
            // charts[i]["amount"] = this.formatterMoney(charts[i]["amount"]);
            charts[i]["amount"] =(charts[i]["amount"]);
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
        PrintJs(state.build, tableHeaders, 'Report Outlet User Transaction');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint
    };
  },
  components: {
    searchOutletUserTransaction: () => import('./components/SearchOutletUserTransaction.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
