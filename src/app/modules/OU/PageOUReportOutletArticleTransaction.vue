<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchOutletArticleTransaction :searches="searches" @getDataArticle="getDataArticle" @onSearch="onSearch" />
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
                    <q-item-section>Detail</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-td>
        </template>
    </STable>
    
    <dialogOutletArticleTransactionDetail :dialog="dialog" @onDialog="onDialog" :data-selected="dataSelected" />

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { mapOU3Label } from '~/app/helpers/mapSelectItems.helpers';
import { date, Notify } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

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
        date: {start: new Date(), end: new Date()},
        deptList: [],
        fromDept: [],
        fromDeptVal: null,
        toDept: [],
        toDeptVal: null,
        fromArt: [],
        toArt: [],
        fromArtVal: null,
        toArtVal: null,
        odTaker: [],
        odTakerVal: null,
        optionSortType: '0',
        isSearchFetching: true,
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
            label: "Table Number", 
            field: "tabelno",
            sortable: false,
            align: "left",
        }, {
            label: "Bill Number", 
            field: "billno",
            sortable: false,
            align: "left",
        }, {
            label: "Article Number", 
            field: "artno",
            sortable: false,
            align: "left",
        }, {
            label: "Description", 
            field: "descr",
            sortable: false,
            align: "left",
        }, {
            label: "Department", 
            field: "depart",
            sortable: false,
            align: "left",
        }, {
            label: "Quantity", 
            field: "qty",
            sortable: false,
            align: "right",
            format: (val) => (val == 0) ? '' : formatThousands(val),
        },  {
            label: "Amount", 
            field: "amount",
            sortable: false,
            align: "right",
            format: (val) => (val == 0) ? '' : formatThousands(val),
        }, {
            label: "Time", 
            field: "zeit",
            sortable: false,
            align: "left",
        }, {
            label: "Posting ID", 
            field: "id",
            sortable: false,
            align: "left",
        }, {
            label: "Guest Name", 
            field: "gname",
            sortable: false,
            align: "left",
        }, { 
            name: 'actions',
            field: 'actions' 
        },
    ];

    const getDataArticle = (isFromArt) => {
      state.searches.isSearchFetching = true;  

      async function asyncCall() {
        const [dataHotel] = await Promise.all([
          $api.outlet.getCommonOutletUserList('loadHArtikel', {
            caseType: 3,
            dept: isFromArt ? state.searches.fromDeptVal!['value'] : state.searches.toDeptVal!['value'], 
            artType: " "
          }),
        ]);

        if (dataHotel) {
          const responseDataArt = dataHotel || [];
          const okFlag = responseDataArt['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }

          const artList = responseDataArt.tHArtikel['t-h-artikel'];
          
          const fromArtList = [] as any;
          const toArtList = [] as any;

          for (let i = 0; i<artList.length; i++) {
            const dataRow = artList[i];
            const deptNr = dataRow['departement'];

            if (isFromArt) {
              if (state.searches.fromDeptVal!['value'] == deptNr) {
                fromArtList.push(dataRow);
              } 
            } else {
              if (state.searches.toDeptVal!['value'] == deptNr) {
                toArtList.push(dataRow);
              }
            }
          }

          state.dataPrepare['tHArtikel'] = artList;
          if (isFromArt) {
            state.searches.fromArt = mapOU3Label(fromArtList, 'artnr', 'artnr', 'departement', 'bezeich');
            state.searches.fromArtVal = state.searches.fromArt.length != 0 ? state.searches.fromArt[0] : null;          
          } else {
            state.searches.toArt = mapOU3Label(toArtList, 'artnr', 'artnr', 'departement', 'bezeich');
            state.searches.toArtVal = state.searches.toArt.length != 0 ? state.searches.toArt[state.searches.toArt.length - 1] : null;
          }
          state.isFetching = false;   
          state.searches.isSearchFetching = false;     
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

    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('restJournalPrepare', {}),
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

        const fdate = new Date(responsePrepare.fromDate);
        const tdate = new Date(responsePrepare.toDate);
        state.searches.date.start = fdate;
        state.searches.date.end = tdate;

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
        getDataArticle(true);
        getDataArticle(false);
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
      if(!val) {
        state.dataSelected = {};
      }
      state.dialog = val;
    };

    const onRowClick = (_, dataRow) => {
        state.dataPrepare = dataRow;
    };

    const showDialog = (dataRow) => {
      state.dataSelected = dataRow;
      onDialog(true);
    };

    const onSearch = (state2) => {
      state.isFetching = true;
        
      async function asyncCall() {
        const [dataResponse] = await Promise.all([
          $api.outlet.getOUTableList('restJournalList', {
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            fromDept: state2.fromDeptVal.value,
            toDept: state2.toDeptVal.value,
            fromArt: state2.fromArtVal != null ? state2.fromArtVal.value : " ",
            toArt: state2.toArtVal != null ? state2.toArtVal.value : " ",
            sorttype: state2.optionSortType,
            longDigit: state.dataPrepare['longDigit'],
            odTaker: state2.orderTakerVal != null ? state2.orderTakerVal.value : " "
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
          charts = data.journalArtList['journal-art-list'];
              
          for (let i=0; i<charts.length; i++) {
            charts[i]["dbilldate"] = charts[i]["datum"],
            charts[i]["datum"] = date.formatDate(charts[i]["datum"], 'DD/MM/YYYY');
            // charts[i]["amount"] = this.formatterMoney(dataTable[i]["amount"]);
            charts[i]["artno"] = charts[i]["dbilldate"] != null ? charts[i]["artno"] : ""; 
            charts[i]["billno"] = charts[i]["dbilldate"] != null ? charts[i]["billno"] : " ";
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
        PrintJs(state.build, tableHeaders, 'Report Outlet Article Transaction');
      }
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      onRowClick,
      getDataArticle,
      onDialog,
      showDialog,
      pagination: {
        rowsPerPage: 10,
      },
      doPrint
    };
  },
  components: {
    searchOutletArticleTransaction: () => import('./components/SearchOutletArticleTransaction.vue'),
    dialogOutletArticleTransactionDetail: () => import('./components/DialogOutletArticleTransactionDetail.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
