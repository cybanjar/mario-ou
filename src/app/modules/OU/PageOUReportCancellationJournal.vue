<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchCancellationJournal :searches="searches" @onSearch="onSearch" :dataSelected="dataSelected" />
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
    
    <dialogCancellationJournalDetail :dialog="dialog" @onDialog="onDialog" :data-selected="dataSelected" />

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
      dataSelected: {},
      dataPrepare:{},
      searches: {
        deptList: [],
        fromDept: [],
        toDept: [],
        date: {start: (new Date()), end: (new Date())},
        fromDeptVal: null,
        toDeptVal: null,
      },
      dialog: false,
    });

    const tableHeaders = [
        {
            label: "Date",
            field: "billdate",
            sortable: false,
            align: "left",
        },{
            label: "TbNo", 
            field: "tbno",
            sortable: false,
            align: "right",
        }, {
            label: "Bill-No", 
            field: "rechnr",
            sortable: false,
            align: "right",
        }, {
            label: "ArtNo", 
            field: "artno",
            sortable: false,
            align: "right",
        }, {
            label: "Description", 
            field: "bezeich",
            sortable: false,
            align: "left",
            },{
            label: "Cancel Reason", 
            field: "cancel",
            sortable: false,
            align: "left",
        }, {
            label: "Qty", 
            field: "qty",
            sortable: false,
            align: "right",
        },  {
            label: "Amount", 
            field: "amount",
            sortable: false,
            align: "right",
        }, {
            label: "Department", 
            field: "depart",
            sortable: false,
            align: "left",
        },  {
            label: "Time", 
            field: "zeit",
            sortable: false,
            align: "center",
        }, {
            label: "Name", 
            field: "cname",
            sortable: false,
            align: "left",
        }, { 
            name: 'actions',
            field: 'actions' 
        },
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('cancelJournPrepare', {}),
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

          const deptList = responseDataHotel.tHoteldpt['t-hoteldpt'];
          const fdate = new Date(responsePrepare.fromDate);
          const tdate = new Date(responsePrepare.toDate);
          state.searches.date.start = fdate;
          state.searches.date.end = tdate;

          state.dataPrepare['tHoteldpt']['t-hoteldpt'] = deptList;
          state.searches.fromDept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
          state.searches.toDept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
          state.searches.deptList = state.searches.fromDept;
          
          const fdptStr = state.dataPrepare['depname1'];
          const tdptStr = state.dataPrepare['depname2'];

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

    const onDialog = (val) => {
      if (!val) {
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
                $api.outlet.getOUTableList('cancelJournList', {
                    fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
                    toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
                    fromDept: state2.fromDeptVal.value,
                    toDept: state2.toDeptVal.value,          
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
              charts = data['cancelJournal']['cancel-journal'];

              for (let i=0; i<charts.length; i++) {
                  charts[i]["dbilldate"] = charts[i]["billdate"],
                  charts[i]["billdate"] = date.formatDate(charts[i]["billdate"], 'DD/MM/YYYY');
                  // charts[i]["amount"] = this.formatterMoney(dataTable[i]["amount"]);
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
      onRowClick,
      onDialog,
      showDialog,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    searchCancellationJournal: () => import('./components/SearchCancellationJournal.vue'),
    dialogCancellationJournalDetail: () => import('./components/DialogCancellationJournalDetail.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
