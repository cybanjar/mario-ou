<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchDrugstoreReport :searches="searches" @onSearch="onSearch" />
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
        :pagination.sync="pagination"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, } from '@vue/composition-api';
import { mapOU } from '~/app/helpers/mapSelectItems.helpers';
import { date, Notify } from 'quasar';
import { PrintJs} from '~/app/helpers/PrintJs';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts = [];

    const state = reactive({
      isFetching: true,
      build: [] as any,
      dataPrepare:{},
      searches: {
        userList: [],
      },
    });

    const tableHeaders = [
        {
          label: "Room Number",
          field: "zinr",
          sortable: false,
          align: "left"
          }, {
          label: "Payment / Guest Name", 
          field: "gname",
          sortable: false,
          align: "left"
          }, {
          label: "", 
          field: "laundry_genttlement",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty1",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "", 
          field: "dry_clean_genttlement",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty2",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          },  {
          label: "", 
          field: "pressing_genttlement",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty3",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          },  {
          label: "", 
          field: "laundry_ladies",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty4",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          },  {
          label: "", 
          field: "dry_clean_ladies",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty5",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "", 
          field: "pressing_laddies",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty6",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          },  {
          label: "Total Amount", 
          field: "totamount",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Quantity", 
          field: "qty7",
          sortable: false,
          align: "right",
          format: (val) => (val == 0) ? '' : formatThousands(val),
          }, {
          label: "Posting ID", 
          field: "id",
          sortable: false,
          align: "left"
    } ];

    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('drugstoreDailyPrepare', {}),
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
        console.log(state.dataPrepare,'test');
        
        state.searches.userList = mapOU(
          state.dataPrepare['userList']['user-list'],
          'usrnr',
          'depart'
        );

        tableHeaders[2]['label'] = state.dataPrepare['bezeich1'];
        tableHeaders[4]['label'] = state.dataPrepare['bezeich2'];
        tableHeaders[6]['label'] = state.dataPrepare['bezeich3'];
        tableHeaders[8]['label'] = state.dataPrepare['bezeich4'];
        tableHeaders[10]['label'] = state.dataPrepare['bezeich5'];
        tableHeaders[13]['label'] = state.dataPrepare['bezeich6'];

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
      state.build = [];
      
      async function asyncCall() {
        const [dataDrugStoreList] = await Promise.all([
          $api.outlet.getOUTableList('drugstoreDailyList', {
            usrInit: state2.userID.value,
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            usrcreated: "no",
            dstoreDept: state.dataPrepare['dstoreDept'],
            allFlag: state2.showAllUser ? "yes" : "no",
            ekumnr: state.dataPrepare['ekumnr'],
            zknr1: state.dataPrepare['zknr1'],
            zknr2: state.dataPrepare['zknr2'],
            zknr3: state.dataPrepare['zknr3'],
            zknr4: state.dataPrepare['zknr4'],
            zknr5: state.dataPrepare['zknr5'],
            zknr6: state.dataPrepare['zknr6'],
          }),
        ]);

        if (dataDrugStoreList) {
          const data = dataDrugStoreList || [];
          const okFlag = data['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }

          charts = data.sList['s-list'];
          for(let i = 0; i<charts.length; i++) {
            const dataRow = {};
            const dataItem = charts[i];

            dataRow["zinr"] = dataItem["zinr"];
            dataRow["gname"] = dataItem["gname"];
            dataRow["qty1"] = dataItem["anzahl"][0];
            dataRow["qty2"] = dataItem["anzahl"][1];
            dataRow["qty3"] = dataItem["anzahl"][2];
            dataRow["qty4"] = dataItem["anzahl"][3];
            dataRow["qty5"] = dataItem["anzahl"][4];
            dataRow["qty6"] = dataItem["anzahl"][5];
            dataRow["qty7"] = dataItem["tanz"];
            dataRow["totamount"] = (dataItem["tamount"]);
            dataRow["id"] = dataItem["userinit"];
            dataRow["laundry_genttlement"] = (dataItem["amount"][0]);
            dataRow["dry_clean_genttlement"] = (dataItem["amount"][1]);
            dataRow["pressing_genttlement"] = (dataItem["amount"][2]);
            dataRow["laundry_ladies"] = (dataItem["amount"][3]);
            dataRow["dry_clean_ladies"] = (dataItem["amount"][4]);
            dataRow["pressing_laddies"] = (dataItem["amount"][5]);
            // dataRow["totamount"] = this.formatterMoney(dataItem["tamount"]);
            // dataRow["id"] = dataItem["userinit"];
            // dataRow["laundry_genttlement"] = this.formatterMoney(dataItem["amount"][0]);
            // dataRow["dry_clean_genttlement"] = this.formatterMoney(dataItem["amount"][1]);
            // dataRow["pressing_genttlement"] = this.formatterMoney(dataItem["amount"][2]);
            // dataRow["laundry_ladies"] = this.formatterMoney(dataItem["amount"][3]);
            // dataRow["dry_clean_ladies"] = this.formatterMoney(dataItem["amount"][4]);
            // dataRow["pressing_laddies"] = this.formatterMoney(dataItem["amount"][5]);
            
            state.build.push(dataRow);
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
      }
      asyncCall();
    };

    function doPrint() {
      if (state.build.length !== 0) {  
        PrintJs(state.build, tableHeaders, 'Report Drug Store');
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
    searchDrugstoreReport: () => import('./components/SearchDrugstoreReport.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
