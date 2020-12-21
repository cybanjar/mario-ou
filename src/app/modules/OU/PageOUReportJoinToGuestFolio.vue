<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchJoinToGuestFolio :searches="searches" @onSearch="onSearch" :dataSelected="dataSelected" />
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
    
    <dialogJoinToGuestFolioDetail :dialog="dialog" @onDialog="onDialog" :data-selected="dataSelected" />

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
        dept: []
      },
      dialog: false,
    });

    const tableHeaders = [
        {
            label: "Date",
            field: "date",
            sortable: false,
            align: "left",
        },{
            label: "RmNo", 
            field: "rmno",
            sortable: false,
            align: "left",
        }, {
            label: "Guest Name", 
            field: "gname",
            sortable: false,
            align: "left",
        }, {
            label: "Bill No", 
            field: "rechnr",
            sortable: false,
            align: "right",
        }, {
            label: "Description", 
            field: "bezeich",
            sortable: false,
            align: "left",
            },{
            label: "Amount", 
            field: "saldo",
            sortable: false,
            align: "right",
        }, {
            label: "Foreign Art", 
            field: "foreign",
            sortable: false,
            align: "right",
        },  {
            label: "Time", 
            field: "zeit",
            sortable: false,
            align: "center",
        }, {
            label: "ID", 
            field: "id",
            sortable: false,
            align: "center",
        },  {
            label: "TB", 
            field: "tb",
            sortable: false,
            align: "center",
        }, { 
            name: 'actions',
            field: 'actions' 
        },
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('roomTransferReportPrepare', {}),
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
          
        const deptList = responsePrepare.tHoteldpt['t-hoteldpt'];
        state.dataPrepare['tHoteldpt']['t-hoteldpt'] = deptList;
        state.searches.dept = mapOU(state.dataPrepare['tHoteldpt']['t-hoteldpt'], 'num', 'depart');
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
          $api.outlet.getOUTableList('roomTransferReportList', {
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            currDept: state2.dept.value,
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
          charts = data['roomtransreportlist']['roomtransreportlist'];

          for (let i=0; i<charts.length; i++) {
            charts[i]["dbilldate"] = charts[i]["datum"],
            charts[i]["date"] = date.formatDate(charts[i]["datum"], 'DD/MM/YYYY');
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
    searchJoinToGuestFolio: () => import('./components/SearchJoinToGuestFolio.vue'),
    dialogJoinToGuestFolioDetail: () => import('./components/DialogJoinToGuestFolioDetail.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
