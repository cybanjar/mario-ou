<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchActualAndRecipeCost :searches="searches" @onSearch="onSearch" />
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
import { date, Notify } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;

    let charts = [];

    const state = reactive({
      isFetching: true,
      build: [] as any,
      dataPrepare: {},
      searches: {
        fromDept: [],
        toDept: []
      },
    });

    const tableHeaders = [
        {
            label: "ArtNo",
            field: "artnr",
            sortable: false,
            align: "right",
            width: 120,
            divider: true
        },{
            label: "Description", 
            field: "bezeich",
            sortable: false,
            align: "left",
            width: 200,
            divider: true
        }, {
            label: "Qty-(Actual)", 
            field: "sQty2",
            sortable: false,
            align: "right",
            width: 120,
            divider: true
        }, {
            label: "Qty-(Recipe)", 
            field: "sQty1",
            sortable: false,
            align: "right",
            width: 120, 
            divider: true
        }, {
            label: "Variance", 
            field: "dval",
            sortable: false,
            align: "right",
            width: 120,
            divider: true
            },{
            label: "Amount-(Actual)", 
            field: "val2",
            sortable: false,
            align: "right",
            width: 180,
            divider: true
        }, {
            label: "Amount-(Recipe)", 
            field: "val1",
            sortable: false,
            align: "right",
            width: 180,
            divider: true
        },  {
            label: "Variance", 
            field: "sQty3",
            sortable: false,
            align: "right",
            width: 180,
            divider: true
        }, {
            label: "Unit", 
            field: "munit",
            sortable: false,
            align: "right"
        }
    ];
    
    onMounted(async () => {
      const [data] = await Promise.all([
        $api.outlet.getOUPrepare('fbCostAnalPrepare', {}),
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
        // console.log('fromdate todate not yet assign , on dataPrepare');
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
          $api.outlet.getOUTableList('fbCostAnalList', {
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
            sorttype: state2.sortType,
            inclBf: state2.sortType == 1  && state2.incBeverageFood ? true : false,
            inclFb: state2.sortType == 2 && state2.incBeverageFood ? true : false,
            fEknr: state.dataPrepare['fEknr'],
            bEknr: state.dataPrepare['bEknr'],
            flEknr: state.dataPrepare['fLEknr'],
            blEknr: state.dataPrepare['bLEknr'],
            preisTyp: state.dataPrepare['bevFood'],
            foodBev: state.dataPrepare['foodBev'],
            bevFood: state.dataPrepare['priceType']
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
          charts = data.sList["s-list"];

          for(let i = 0; i<charts.length; i++) {
            const dataRow = {};
            const dataItem = charts[i];

            dataRow["artnr"] = dataItem["artnr"];
            dataRow["bezeich"] = dataItem["bezeich"];
            dataRow["d-qty"] = dataItem["d-qty"];
            dataRow["d-val"] = dataItem["d-val"];
            dataRow["munit"] = dataItem["munit"];
            dataRow["qty1"] = dataItem["qty1"];
            dataRow["qty2"] = dataItem["qty2"];
            dataRow["sQty1"] = dataItem["s-qty1"];
            dataRow["sQty2"] = dataItem["s-qty2"];
            dataRow["sQty3"] = dataItem["s-qty3"];
            dataRow["mcost"] = dataItem["m-cost"];
            dataRow["val1"] = dataItem["val1"];
            dataRow["val2"] = dataItem["val2"];  
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
    searchActualAndRecipeCost: () => import('./components/SearchActualAndRecipeCost.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
