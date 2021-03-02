<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletLaundryCompliment :searches="searches" @onSearch="onSearch" />
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
        :columns="tableHeaders"
        id="printMe"
        :data="build"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        hide-bottom
        @row-click="onRowClick"
        class="table-accounting-date"
      >
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
    </STable>
    
    <dialogLaundryCompliment :dialog="dialog" @onDialog="onDialog" :data-selected="dataSelected" />

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
        inputDate: {start: new Date(), end: new Date()},
        optionSortType: '2',
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
            label: "Bill Number", 
            field: "rechnr",
            sortable: false,
            align: "right",
        }, {
            label: "Guest Name", 
            field: "name",
            sortable: false,
            align: "left",
        }, {
            label: "Payment Article", 
            field: "p-artnr",
            sortable: false,
            align: "right",
        },{
            label: "Description", 
            field: "bezeich",
            sortable: false,
            align: "left",
        },  {
            label: "Bill Amount", 
            field: "betrag",
            sortable: false,
            align: "right",
        }, {
            label: "Cost of Sales", 
            field: "t-cost",
            sortable: false,
            align: "right",
        }, {
            label: "Department", 
            field: "deptname",
            sortable: false,
            align: "left",
        }, { 
            name: 'actions',
            field: 'actions' 
        },
    ];

    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('loundryCompPrepare', {}),
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
        state.searches.inputDate.start = billDate;
        state.searches.inputDate.end = billDate;
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
        async function asyncCall() {
          const state2 = {
            date: state.searches.inputDate,
            optionSortType: state.searches.optionSortType
          // eslint-disable-next-line @typescript-eslint/ban-types
          } as {};

          const [dataResponse] = await Promise.all([
            $api.outlet.getOUTableList('loundryCompBtnGo', {
              foreignNr: state.dataPrepare['foreignNr'], 
              sorttype: state2['optionSortType'],
              fromDate: date.formatDate(state2['date']['start'], 'MM/DD/YYYY'),
              toDate: date.formatDate(state2['date']['end'], 'MM/DD/YYYY'),
              fromDept: state.dataPrepare['fromDept'],
              toDept: state.dataPrepare['fromDept'],
              billdate: date.formatDate(state.dataPrepare['billdate'], 'MM/DD/YYYY'),
              exchgrate: state.dataPrepare['exchgRate'], 
              doublecurrency: state.dataPrepare['doubleCurrency']
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
          $api.outlet.getOUTableList('loundryCompBtnGo', {
            foreignNr: state.dataPrepare['foreignNr'], 
            sorttype: state2.optionSortType,
            fromDate: date.formatDate(state2.inputDate.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.inputDate.end, 'MM/DD/YYYY'),
            fromDept: state.dataPrepare['fromDept'],
            toDept: state.dataPrepare['fromDept'],
            billdate: date.formatDate(state.dataPrepare['billdate'], 'MM/DD/YYYY'),
            exchgrate: state.dataPrepare['exchgRate'], 
            doublecurrency: state.dataPrepare['doubleCurrency']
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
        PrintJs(state.build, tableHeaders, 'Report Laundry Compliment');
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
    searchOutletLaundryCompliment: () => import('./components/SearchOutletLaundryCompliment.vue'),
    dialogLaundryCompliment: () => import('./components/DialogLaundryComplimentEdit.vue'),
  },
});
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
</style>

