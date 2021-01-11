<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="width: 500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

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
              <q-tr :props="props" :class="(props.row.selected)?'bg-cyan text-white':'bg-white text-black'">
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
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn unelevated color="primary" outline label="Cancel" @click="onCancelDialogSelectUser" />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialogSelectUser" :disable="!data.buttonOkEnable"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    buttonOkEnable: boolean;
    dataSelected: {},
  }
  title: string;
}

export default defineComponent({
  props: {
    dialogSelectOrderTaker: { type: Boolean, required: true },
    dataSelectedOrderTaker: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
        dataSelected: {}
      },
      title: '',
    });

    const initDataUser = () => {
      state.isLoading = true;
      
      async function asyncCall() {
        const [dataOrderTaker] = await Promise.all([
          $api.outlet.getOUPrepare('getOrderTaker', { }),
        ]);

        if (dataOrderTaker) {
          const responseDataOrderTaker = dataOrderTaker || [];
          const okFlag = responseDataOrderTaker['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.data.dataDetail = [];
          state.data.dataDetail = responseDataOrderTaker['queasyList']['queasy-list'];
          state.isLoading = false;
        }
      }
      asyncCall();
    }

    watch(
      () => props.dialogSelectOrderTaker, (dialogSelectOrderTaker) => {
        if (props.dialogSelectOrderTaker) {
          state.data.dataSelected = props.dataSelectedOrderTaker;
          state.data.buttonOkEnable = false;
          state.title = 'Select Order Taker';
          initDataUser();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogSelectOrderTaker,
        set: (val) => {
            emit('onDialogMenuOrderTaker', val, null);
        },
    });

    const onRowClick = (dataRow) => {
        // console.log(dataRow);

        for (let i = 0; i<state.data.dataDetail.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const datarow = state.data.dataDetail[i] as {};
          datarow['selected'] = false;
        }

        const dataTable = [] as any;
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const datarow = state.data.dataDetail[i] as {};          
          if (state.data.dataDetail[i]['number1'] == dataRow['number1']) {
            datarow['selected'] = true;
          }
          dataTable.push(datarow);
        }
        state.data.dataDetail = [];
        state.data.dataDetail = dataTable;

        dataRow['selected'] = true;
        state.data.dataSelected = dataRow;
        state.data.buttonOkEnable = true;
    }

    const tableHeaders = [
      {
            label: "No",
            field: "number1",
            name: "number1",
            align: "right",
            format: val => `${val}`
        }, {
            label: "ID", 
            field: "char1",
            name: "char1",
            align: "left",
        }, {
            label: "User Name", 
            field: "char2",
            name: "char2",
            align: "left",
        },
    ];

    // -- 
    const closeDialogSelectUser = () => {
      state.data.dataSelected = null;
      state.data.buttonOkEnable = false;
    }

    const onOkDialogSelectUser = () => {
      if (state.data.dataSelected != null) {
        emit('onDialogMenuOrderTaker', false, state.data.dataSelected);
      } 
    }

    const onCancelDialogSelectUser = () => {
      closeDialogSelectUser();
      emit('onDialogMenuOrderTaker', false, null);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onOkDialogSelectUser,
      onCancelDialogSelectUser,
      closeDialogSelectUser,
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

