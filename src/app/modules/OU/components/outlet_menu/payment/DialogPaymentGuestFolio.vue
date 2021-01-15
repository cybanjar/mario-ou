<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card style="max-width: 1500px;width:650px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section class="q-ma-none">
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-space />
            </div>

            <div class="col">
              <SInput v-model="data.balance" outlined  label-text="Balance" :disable="true" readonly/>
            </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-space />
            </div>

            <div class="col">
              <SInput outlined v-model="data.room" label-text="Room" @change="(v) => { getReturnZinr(data.zinr); }" data-layout="numeric" ref="paymentRoom" @focus="showKeyboard"/>
            </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-space />
            </div>

            <div class="col">
              <SInput outlined v-model="data.remark" label-text="Remark" :disable="true" readonly/>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-sm">
            <STable
              hide-bottom
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.dataDetail"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
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
                    @click="onRowClickTable(props.row)">
                      {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </STable>
          </div>

          <vue-touch-keyboard 
            id="keyboard"
            :options="options" 
            v-if="numpadVisible" 
            :layout="layout" 
            :cancel="hideKeyboard" 
            :accept="acceptKeyboard" 
            :next="acceptKeyboard"
            :input="input"
            :close="hideKeyboard" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog" />
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
    dataResponse: {};
    buttonOkEnable: boolean;
    balance: any;
    room: string;
    remark: string;
    dataSelected: {};
  }
  title: string;
  options: {};
  input: null;
  layout: string,
  numpadVisible: boolean,
}

export default defineComponent({
  props: {
    showPaymentGuestFolio: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    selectedPrint: { type: Object, required: true }, 
    dataTable: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataResponse: {},
        buttonOkEnable: false,
        balance: 0,
        room: '',
        remark: '',
        dataSelected: {},
      },
      title: '',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: 'numeric',
      input: null,
      numpadVisible: false,
    });

    watch(
      () => props.showPaymentGuestFolio, (showPaymentGuestFolio) => {
        if (props.showPaymentGuestFolio) {
          state.data.buttonOkEnable = false;
          state.title = 'Guest Folio Payment';
          state.data.balance = props.dataTable['dataTable']['saldo']
          getPrepare();
          console.log('data table : ', props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentGuestFolio,
        set: (val) => {
            emit('onDialogPaymentGuestFolio', val, null);
        },
    });

    // -- HTTP Request method
    const getPrepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rzinrPrepare ', {
            pvILanguage: 1,
            dept:props.dataTable['dataPrepare']['currDept'],
            zinr: ' ',
            hResnr: 0,
            hReslinnr:0,
            balance: props.dataTable['dataTable']['saldo'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response rzinrPrepare: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataResponse = response;

          let dataTable = response['q1List']['q1-list'];
          // for (let i = 0; i<dataTable.length; i++) {
          //   const datarow = dataTable[i] as {};
          //   datarow['pos'] = i;
          //   dataTable.push(datarow);
          // }
          
          state.data.dataDetail = dataTable.slice();
          state.isLoading = false;
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

    const getReturnZinr = () => {
      state.isLoading = true;

      console.log({
        pvILanguage: 0,
        dept:props.dataTable['dataPrepare']['currDept'],
        room: state.data.room,
        caseType: 1,
        deptMbar: state.data.dataResponse['deptMbar'],
        deptLdry: state.data.dataResponse['deptLdry'],
      })

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('rzinrPrepare ', {
            pvILanguage: 1,
            dept:props.dataTable['dataPrepare']['currDept'],
            room: state.data.room,
            caseType: 1,
            deptMbar: state.data.dataResponse['deptMbar'],
            deptLdry: state.data.dataResponse['deptLdry'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response return: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          let dataTable = response['q1List']['q1-list'];
          // for (let i = 0; i<dataTable.length; i++) {
          //   const datarow = dataTable[i] as {};
          //   datarow['pos'] = i;
          //   dataTable.push(datarow);
          // }
          
          state.data.dataDetail = dataTable;
          state.isLoading = false;
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
    

    const tableHeaders = [
      {
            label: "RmNo", 
            field: "zinr",
            name: "zinr",
            align: "left",
        }, {
            label: "No", 
            field: "billnr",
            name: "billnr",
            align: "right",
        },{
            label: "Guest Name", 
            field: "g-name",
            name: "g-name",
            align: "left",
        },{
            label: "Arrival", 
            field: "ankunft",
            name: "ankunft",
            align: "left",
        },{
            label: "Depart", 
            field: "depart",
            name: "depart",
            align: "left",
        },{
            label: "Nation", 
            field: "nation1",
            name: "nation1",
            align: "left",
        },
    ];

    // -- onClick listener 
    const onRowClickTable = (dataRow) => {
     for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};
        if (state.data.dataDetail[i]['resnr'] == dataRow['resnr'] && 
            state.data.dataDetail[i]['billnr'] == dataRow['billnr'] && 
            state.data.dataDetail[i]['zinr'] == dataRow['zinr'] && 
            state.data.dataDetail[i]['reslinnr'] == dataRow['reslinnr']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.dataDetail = [];
      state.data.dataDetail = dataTable;

      dataRow['selected'] = true;
      state.data.dataSelected = dataRow;
      state.data.remark = state.data.dataSelected['bemerk'];
      state.data.room = state.data.dataSelected['zinr'];
      state.data.buttonOkEnable = true;
    }

    const onOkDialog = () => {
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentGuestFolio', false);
    }

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 

      if (!state.numpadVisible) {
        state.numpadVisible = true;
      }      
    }

    const hideKeyboard = () => {
      state.numpadVisible = false;
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClickTable,
      onOkDialog,
      onCancelDialog,
      getReturnZinr,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      pagination: { rowsPerPage: 0 },
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

#keyboard {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 1em;

	background-color: #EEE;
	box-shadow: 0px -3px 10px rgba(black, 0.3);

	border-radius: 10px;
}
</style>

