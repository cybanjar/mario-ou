<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <STable
          dense
          :loading="isLoading"
          :columns="tableHeaders"
          :data="dataDetail"
          separator="cell"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
          hide-bottom>
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
        </STable>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="$emit('onDialog', false)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import {displayTime} from '../utilsOU/utils';
import { date, Notify } from 'quasar';

interface State {
  isLoading: boolean;
  dataDetail: [];
  title: string;
  dataPrepare: [];
}

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    dataSelected: {type: Object, required: true},
  },
  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      dataDetail: [],
      dataPrepare: [],
      title: '',
    });

    const getDataDetailPrepare = (dataSelected) => {
      state.isLoading = true;
      state.dataPrepare = [];

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restJournalListDetail1', {
            hRecid: dataSelected["h-recid"],
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];
          if (!okFlag ) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          if (dataPrepare) {
            const charts = dataPrepare || [] as any;
            state.dataPrepare = charts;

            async function asyncCall() {
              const [dataTable] = await Promise.all([
                $api.outlet.getOUTableList('restJournalListDetail2', {
                  inpRechnr: state.dataPrepare['tRechnr'],
                  dept: state.dataPrepare['tDepartement'],
                  datum: date.formatDate(state.dataPrepare['tBillDatum'], "MM/DD/YYYY")
                }),
              ]);

              if (dataTable) {
                const data = dataTable || [];
                const okFlag = data['outputOkFlag'];
                if (!okFlag ) {data
                  Notify.create({
                    message: 'Failed when retrive data, please try again',
                    color: 'red',
                  });
                  state.isLoading = false;
                  return false;
                }

                state.dataDetail = [];
                const chartsTable = data.tHJournal['t-h-journal'];
                          
                for (let i=0; i<chartsTable.length; i++) {
                  chartsTable[i]["bill-datum"] = date.formatDate(chartsTable[i]["bill-datum"], 'DD/MM/YYYY');
                  chartsTable[i]["zeit"] = displayTime(chartsTable[i]["zeit"]);
                } 
                state.dataDetail = chartsTable;
              } else {
                Notify.create({
                  message: 'Please check your internet connection',
                  color: 'red',
                });
                state.isLoading = false;
                return false;
              }
              state.isLoading = false;
            }
            asyncCall();
          } else {
            state.isLoading = false;
          }
        } else {
          Notify.create({
            message: 'Please check your internet connection',
            color: 'red',
          });
          state.isLoading = false;
          return false;
        }
      }
      asyncCall();
    }

    watch(
      () => props.dialog, (show) => {
        if ((props.dialog) && (props.dataSelected != undefined)) {
          state.title = 'Rest Journal Bill No #' + String(props.dataSelected.billno);
          getDataDetailPrepare(props.dataSelected);
        }
      }
    );

    const dialogModel = computed({        
        get: () => props.dialog,
        set: (val) => {
            emit('onDialog', val);
        },
    });

    const tableHeaders = [
      {
            label: "ArtNo",
            field: "artnr",
            align: "right",
        }, {
            label: "Description", 
            field: "bezeich",
            align: "left",
        }, {
            label: "Qty", 
            field: "anzahl",
            align: "right",
        }, {
            label: "Price", 
            field: "epreis",
            align: "right",
        }, {
            label: "Amount", 
            field: "betrag",
            align: "right",
            },{
            label: "Bill No", 
            field: "rechnr",
            align: "right",
        }, {
            label: "Dept", 
            field: "departement",
            align: "right",
        },  {
            label: "Bill Date", 
            field: "bill-datum",
            align: "left",
        }, {
            label: "Date", 
            field: "sysdate",
            align: "left",
        }, {
            label: "Time", 
            field: "zeit",
            align: "center",
        }
    ];

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      pagination: { page: 1, rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
