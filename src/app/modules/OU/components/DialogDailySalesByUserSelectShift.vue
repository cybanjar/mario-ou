<template>
    <section>
        <q-dialog v-model="dialogModelSelectShift" persistent>
            <q-card style="width: 500px;">
            <q-toolbar>
                <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
            </q-toolbar>

            <q-card-section>
                <SSelect
                    label-text="Shift"
                    :options="dataDetailShift"
                    v-model="dataSelected">
                    <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-italic text-grey">
                        No data
                        </q-item-section>
                    </q-item>
                    </template>
                </SSelect>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialogSelectShift" />
                <q-btn color="primary" label="OK" @click="onOkDialogSelectShift" />
            </q-card-actions>
            </q-card>
        </q-dialog>
    </section>
</template>

<script lang="ts">
import {defineComponent, computed, reactive, toRefs,} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import { date } from 'quasar';

interface State {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataTable: {};
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataSelected: {};
  dataDetailShift: any
  title: string;
}

export default defineComponent({
  props: {
    showDialogShift: { type: Boolean, required: true },
    searches: {type: Object, required: true},
    dataPrepare: {type: Object, required: true},
    dataFromDialogUser: {type: Object, required: true}
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      dataTable: {},
      dataDetailShift: [
          {
              label: "0 - All",
              value: 0
          }, {
              label: "1 - Morning",
              value: 1
          }, {
              label: "2 - Noon",
              value: 2
          }, {
              label: "3 - Dinner",
              value: 3
          }, {
              label: "4 - Supper",
              value: 4
          }
      ],
      dataSelected: {
          label: "0 - All",
          value: 0
      },
      title: 'Select Shift'
    });

    const assignDataTable = () =>{
      emit('assignDataTable', {...state.dataTable});
    }

    const onOkDialogSelectShift = () => {
        const requestBLineList = [] as any;
        if (props.dataFromDialogUser.checkSummaryAllCash) {
          for (let i = 0; i < props.dataFromDialogUser.dataDetail.length; i++) {
            const dataRow = props.dataFromDialogUser.dataDetail[i];
            const dataRecord = {
              'selected': true,
              'depart' : dataRow.deptname,
              'dept' : dataRow.departement,
              'knr' : dataRow['kellner-nr'],
              'bl-recid' : dataRow['rec-id']
            };
            requestBLineList.push(dataRecord);
          }
        } else {
          const dataRow = props.dataFromDialogUser.dataSelected;
          const dataRecord = {
              'selected': true,
              'depart' : dataRow.deptname,
              'dept' : dataRow.departement,
              'knr' : dataRow['kellner-nr'],
              'bl-recid' : dataRow['rec-id']
            };
            requestBLineList.push(dataRecord);
        }

        const prepare = props.dataPrepare;
        const searches = props.searches;
        const dataDialogUser = props.dataFromDialogUser;

        async function asyncCall() {
          const dataResponse = await Promise.all([
            $api.outlet.getOUDailySalesByUser2List('dailySalesReportP2', {
              'discArt1': prepare['discArt1'], 
              'discArt2': prepare['discArt2'], 
              'discArt3': prepare['discArt3'], 
              'currDept': prepare['currDept'], 
              'allUser': dataDialogUser['checkSummaryAllCash'], 
              'shift': state.dataSelected['value'], 
              'fromDate': date.formatDate(searches['date']['start'], 'MM/DD/YYYY'), 
              'toDate': date.formatDate(searches['date']['end'], 'MM/DD/YYYY'), 
              'artStr': prepare['artStr'], 
              'voucherArt': prepare['voucherArt'], 
              'zeroVatCompli': searches['checkSuppressComp'], 
              'showFbodisc': searches['checkDiscToFood'],
              'excludeCompli': searches['checkExcludeComp'],
              'blineList' : { 'bline-list' : requestBLineList }
            }),
          ]);
          
          state.dataTable = dataResponse;

          emit('onDialogSelectShift', false);
          assignDataTable();
        }
        asyncCall();
    }

    const onCancelDialogSelectShift = () => {
      emit('onDialogSelectShift', false)
      emit('closeDialogSelectUser');
    }

    const dialogModelSelectShift = computed({        
        get: () => props.showDialogShift,
        set: (val) => {
            emit('onDialogSelectShift', val);
        },
    });

    return {
      dialogModelSelectShift,
      ...toRefs(state),
      assignDataTable,
      onOkDialogSelectShift,
      onCancelDialogSelectShift,
      pagination: { rowsPerPage: 10 },
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

