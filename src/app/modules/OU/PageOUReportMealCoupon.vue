<template>
  <div>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <searchMealCoupon @onSearch="onSearch" />
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
import { defineComponent, toRefs, reactive, } from '@vue/composition-api';
import { date, Notify } from 'quasar';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let responsePrepare;
    let charts = [];

    const state = reactive({
      isFetching: false,
      build: [] as any,
    });

    const onSearch = (state2) => {
      state.isFetching = true;
      async function asyncCall() {
        const [dataCouponList] = await Promise.all([
          $api.outlet.getOUTableList('mealCouponList', {
            fromDate: date.formatDate(state2.date.start, 'MM/DD/YYYY'),
            toDate: date.formatDate(state2.date.end, 'MM/DD/YYYY'),
          }),
        ]);

        if (dataCouponList) {
          const data = dataCouponList || [];
          state.build = [];

          const okFlag = data['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isFetching = false;
            return false;
          }
          
          charts = data.mlist['mlist'];
          for (let i = 0; i<charts.length; i++) {
              const dataRow = {};
              const dataItem = charts[i];

              dataRow["resnr"] = dataItem["resnr"];
              dataRow["zinr"] = dataItem["zinr"];
              dataRow["name"] = dataItem["name"];
              dataRow["anzahl"] = dataItem["anzahl"];
              dataRow["ankunft"] = date.formatDate(dataItem["ankunft"], 'DD/MM/YYYY');
              dataRow["abreise"] = date.formatDate(dataItem["abreise"], 'DD/MM/YYYY');
              dataRow["resnr"] = dataItem["resnr"];
              dataRow["used"] = dataItem["verbrauch"][31];

              for (let x = 0; x<32; x++) {
                  dataRow['verbrauch' + (x + 1)] = dataItem['verbrauch'][x];
              }
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

    const tableHeaders = [] as any;
    let j = 1;

    for(let i=0; i<7; i++) {
        if (i == 0) {
            tableHeaders.splice(i, 0, {
                label: "RmNo",
                field: "zinr",
                name: "zinr",
                sortable: false,
                align: "right",              
            }); 
        } else if (i == 1) {
            tableHeaders.splice(i, 0, {
                label: "Guest Name", 
                field: "name",
                name: "name",
                sortable: false,
                align: "left",
            });
        } else if (i == 2) {
            tableHeaders.splice(i, 0, {
                label: "ResNo", 
                field: "resnr",
                name: "resnr",
                sortable: false,
                align: "right",
            });
        } else if (i == 3) {
            tableHeaders.splice(i, 0, {
                label: "Arrival", 
                field: "ankunft",
                name: "ankunft",
                sortable: false,
                align: "left",
            });
        } else if (i == 4) {
            tableHeaders.splice(i, 0, {
                label: "Departure", 
                field: "abreise",
                name: "abreise",
                sortable: false,
                align: "left",
            });
        } else if (i == 5) {
            tableHeaders.splice(i, 0, {
                label: "Used", 
                field: "used",
                name: "used",
                sortable: false,
                align: "right",
            });
        } else {
            for(let x = 6; x<37; x++) {
                tableHeaders.splice(x, 0, {
                    label: (j < 10) ? '0' + j.toString() : j.toString(), 
                    field: "verbrauch"+j,
                    name: "verbrauch"+j,
                    sortable: false,
                    align: "right",
                });
                j++;
            }

        }
    }
    
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
    searchMealCoupon: () => import('./components/SearchMealCoupon.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
</style>
