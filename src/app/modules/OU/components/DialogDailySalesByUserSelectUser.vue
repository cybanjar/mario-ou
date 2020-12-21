<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="width: 500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <!-- <q-card-section style="max-height: 50vh" class="scroll"> -->
        <q-card-section>
          <STable
            dense
            :loading="isLoading"
            :columns="tableHeaders"
            :data="data.dataDetail"
            row-key="name"
            separator="cell"
            :rows-per-page-options="[10, 13, 16]"
            :pagination.sync="pagination">
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-black':'bg-white text-black'">
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  @click="onRowClick(props.row)">
                    {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </STable>

          <q-checkbox v-model="data.checkSummaryAllCash" v-on:click.native="onCheckSummaryAllCashier" label="Summary All Cashiers" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialogSelectUser" />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser" :disable="(data.dataSelected != null || data.checkSummaryAllCash) ? false : true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <dialogShift 
      :showDialogShift="showDialogShift" 
      :searches="searches" 
      :dataPrepare="dataPrepare" 
      :dataFromDialogUser="data" 
      @onDialogSelectShift="onDialogSelectShift" 
      @assignDataTable="assignDataTable"
      @closeDialogSelectUser="closeDialogSelectUser"/>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';

interface State {
  isLoading: boolean;
  data: {
    checkSummaryAllCash: boolean;
    dataDetail: [];
    dataSelected: null;
  }
  title: string;
  showDialogShift: boolean;
}

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    searches: {type: Object, required: true},
    dataPrepare: {type: Object, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        checkSummaryAllCash: false,
        dataDetail: [],
        dataSelected: null,
      },
      title: '',
      showDialogShift: false,
    });

    const initDataUser = (dataPrepare) => {
      const currDept = dataPrepare['currDept'];
      const dataTable = [] as any;

      for (let i = 0; i<dataPrepare['usr1']['usr1'].length; i++) {
        const dataRow = dataPrepare['usr1']['usr1'][i];
        const department = dataRow['departement'];

        dataRow['selected'] = false;

        if (currDept == department) {
          dataRow['deptname'] = dataPrepare['deptName'];
          dataTable.push(dataRow);
        }
      }
      state.data.dataDetail = dataTable;
    }

    watch(
      () => props.show, (show) => {
        if ((props.show) && (props.searches != undefined)) {
          state.title = 'Select users';
          initDataUser(props.dataPrepare);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.show,
        set: (val) => {
            emit('onDialog', val);
        },
    });

    const onCheckSummaryAllCashier = () => {
      if (state.data.checkSummaryAllCash) {
        const dataTable = [] as any;
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const datarow = state.data.dataDetail[i] as {};          
          datarow['selected'] = true;
          dataTable.push(datarow);
        }
        state.data.dataDetail = [];
        state.data.dataDetail = dataTable;
      } else {
        const dataTable = [] as any;
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const datarow = state.data.dataDetail[i] as {};          
          datarow['selected'] = false;
          dataTable.push(datarow);
        }
        state.data.dataDetail = [];
        state.data.dataDetail = dataTable;

        state.data.dataSelected = null;
      }
    }

    const onRowClick = (dataRow) => {
      if (!state.data.checkSummaryAllCash) {
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const datarow = state.data.dataDetail[i] as {};
          datarow['selected'] = false;
        }

        const dataTable = [] as any;
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const datarow = state.data.dataDetail[i] as {};          
          if (state.data.dataDetail[i]['rec-id'] == dataRow['rec-id']) {
            datarow['selected'] = true;
          }
          dataTable.push(datarow);
        }
        state.data.dataDetail = [];
        state.data.dataDetail = dataTable;

        dataRow['selected'] = true;
        state.data.dataSelected = dataRow;
      }
    }

    const tableHeaders = [
      {
            label: "Department",
            field: "deptname",
            name: "deptname",
            align: "left",
            format: val => `${val}`
        },{
            label: "User Name", 
            field: "kellnername",
            name: "kellnername",
            align: "left",
        },
    ];

    // -- 
    const closeDialogSelectUser = () => {
      state.data.dataSelected = null;
      state.data.checkSummaryAllCash = false;
    }
    
    const onDialogSelectShift = (val) => {
      state.showDialogShift = val;
    }

    const onOkDialogSelectUser = () => {
      if (state.data.dataSelected != null || state.data.checkSummaryAllCash) {
        emit('onDialog', false);
        onDialogSelectShift(true);
      } 
    }

    const onCancelDialogSelectUser = () => {
      closeDialogSelectUser();
      emit('onDialog', false);
    }

    const assignDataTable = (state2) => {
      closeDialogSelectUser();
      emit('assignDataTable', state2);
    }

    return {
      dialogModel,
      ...toRefs(state),
      assignDataTable,
      tableHeaders,
      onRowClick,
      onCheckSummaryAllCashier,
      onDialogSelectShift,
      onOkDialogSelectUser,
      onCancelDialogSelectUser,
      closeDialogSelectUser,
      pagination: { rowsPerPage: 10 },
    };
  },
  components: { dialogShift: () => import('./DialogDailySalesByUserSelectShift.vue') },
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
