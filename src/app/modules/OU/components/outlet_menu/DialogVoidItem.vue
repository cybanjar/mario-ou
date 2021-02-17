<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1000px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <div class="row">
            <div class="col-6">
                <q-card-section>
                    <div class="row">
                        <div class="col-12">
                            <SInput autofocus 
                              type="number" 
                              @change="(v) => { checkQty(qty); }" 
                              v-model="qty" 
                              data-layout="numeric"
                              @focus="showKeyboardBill" 
                              outlined 
                              class="q-mx-xs q-mt-sm" 
                              label-text="Cancelled Quantity"
                              ref="qtyBox"
                              :disable="currQty == 1"/>

                            <vue-touch-keyboard
                                id="keyboard"
                                :options="options" 
                                :layout="layout" 
                                :cancel="hideKeyboard" 
                                :accept="acceptKeyboard" 
                                :next="acceptKeyboard"
                                :input="input"
                                :close="hideKeyboard" />
                        </div>                        
                    </div>
                </q-card-section>
            </div>
            <div class="col-6">
                <q-card-section>
                    <div class="q-ma-sm row q-gutter-xs">
                        <div v-if="cancelExist == 'true'">
                          <STable
                            grid
                            hide-header
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

                            <template v-slot:item="props">
                                <q-card class="q-ma-sm col-md-3" flat bordered :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                                    <q-card-section @click="onRowClick(props.row)" >
                                        <strong>{{ props.row.char1 }}</strong>
                                    </q-card-section>
                                </q-card>
                            </template>
                          </STable>
                        </div>

                        <div v-else>
                          <SInput 
                            v-model="reason" 
                            data-layout="compact"
                            @focus="showKeyboardBottom" 
                            outlined 
                            class="q-mx-xs q-mt-sm" 
                            ref="reasonBox"
                            label-text="Enter cancel reason"/>
                        </div>
                    </div>      
                </q-card-section>
            </div>
        </div>    

        <vue-touch-keyboard 
            id="keyboardbottom"
            :options="optionsBottom" 
            v-if="keyboardVisible" 
            layout="compact" 
            :accept="hideKeyboardBottom" 
            :next="hideKeyboardBottom"
            :input="inputbottom"
            :close="hideKeyboardBottom" />    

        <q-separator />

        <q-card-actions align="right">
          <q-btn unelevated outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialog"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import VueTouchKeyboard from 'vue-touch-keyboard';

Vue.use(VueTouchKeyboard);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);
import Vue from 'vue';

import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify, date } from 'quasar';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: any;
    buttonOkEnable: boolean;
    dataSelected: {},
    dataPayment: {},
  }
  title: string;
  qty: any,
  currQty: any,
  options: {};
  optionsBottom: {};
  input: null;
  inputbottom: null;
  layout: string,
  layoutBottom:  string,
  numpadVisible: boolean,
  keyboardVisible: boolean,
  cancelExist: boolean,
  reason: string,
}

export default defineComponent({
  props: {
    showDialogVoidItem: { type: Boolean, required: true },
    dataSelectedVoidItem: { type: Object, required: true },
    dataTable: { type: Object, required: true },
    dataPrepare: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
        dataSelected: {},
        dataPayment: {},
      },
      title: '',
      qty: 1,
      currQty: 0,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      optionsBottom: {
        useKbEvents: false,
        preventClickEvent: false
      },
      layout: 'numeric',
      layoutBottom: 'compact',
      input: null,
      numpadVisible: false,
      inputbottom: null,
      keyboardVisible: false,
      cancelExist: true,
      reason: '',
    });

    watch(
      () => props.showDialogVoidItem, (showDialogVoidItem) => {
        if (props.showDialogVoidItem) {
          state.data.buttonOkEnable = false;
          state.title = 'Void Item';

          state.currQty = props.dataSelectedVoidItem['anz'];
          state.cancelExist = props.dataPrepare['cancelExist'];

          getRestInvCancelOrder2();

          state.data.dataPayment = props.dataPrepare;

          console.log("On mount void item : ", props.dataSelectedVoidItem);
          console.log('dataPrepare : ', props.dataPrepare);
          console.log('dataTable : ', props.dataTable);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogVoidItem,
        set: (val) => {
            emit('onDialogVoidItem', val, '', null);
        },
    });

    // -- HTTP Request
     const zuggriff = (arrayNr, expectedNr) => {
      let zuggrifval = "false";
      async function asyncCall() {
        const [dataZuggrif] = await Promise.all([
          $api.outlet.getZugriff('checkPermission', {
            arrayNr: arrayNr,
            expectedNr: expectedNr,
            userInit:  dataStoreLogin['userInit']
          }),
        ]);

        if (dataZuggrif) {
          const responseZuggrif = dataZuggrif || [];
          const okFlag = responseZuggrif['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          zuggrifval = responseZuggrif['zugriff'];

          if (zuggrifval == "true") {
            props.dataSelectedVoidItem['prepareArticle']['betrag'] = props.dataSelectedVoidItem['betrag']
            props.dataSelectedVoidItem['prepareArticle']['qty'] = state.qty
            // emit('onDialogVoidItem', false, 'ok', props.dataSelectedVoidItem['prepareArticle']);
            emit('onDialogVoidItem', false, 'ok', state.data.dataPayment);
          } else {
            Notify.create({
              message: responseZuggrif['messStr'],
              color: 'red',
            });
            state.isLoading = false;
            return false;
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

    const getRestInvCancelOrder2 = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCancelOrder2', {
            recIdHArt  : props.dataSelectedVoidItem['rec-id'],
            recIdHbline  : props.dataSelectedVoidItem['rec-id'],
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvCancelOrder2 : ', response);
          state.data.dataPayment = data;

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            return false;
          } 
          getRestInvCalculateAmount(response['cancelFlag']);
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

    const getRestInvCalculateAmount = (cancelFlag) => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCalculateAmount', {
            recId: props.dataSelectedVoidItem['rec-id'],
            doubleCurrency  : props.dataPrepare['doubleCurrency'],
            price : props.dataSelectedVoidItem['pricePrepare'],
            qty: state.qty,
            exchgRate: props.dataPrepare['exchgRate'],
            priceDecimal  : props.dataPrepare['priceDecimal'],
            transdate  : date.formatDate((new Date), 'MM/DD/YY'),
            cancelFlag  : cancelFlag,
            foreignRate  : props.dataPrepare['foreignRate'],
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvCalculateAmount : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            return false;
          } 
          loadQueasy();
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

    const loadQueasy = () => {
      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getZugriff('loadQueasy', {
            caseType: 1,
            qNo : 11,
          }),
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('loadQueasy : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          state.data.dataDetail = response['tQueasy']['t-queasy'];
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
            label: "Name", 
            field: "char1",
            name: "char1",
            align: "center",
      }, 
    ];

    // -- On Click Listener
    const onOkDialog = () => {
      if (props.dataSelectedVoidItem['prepareArticle']['artart'] == 0) {
        zuggriff(19, 2);
      } else {
        zuggriff(20, 2);
      }
    }

    const onCancelDialog = () => {
      state.qty = 1;
      state.currQty = 0;
      state.reason = '';
      emit('onDialogVoidItem', false, '', null);
    }

    const onRowClick = (dataRow) => {
      state.data.dataSelected = dataRow;
      
      let dataTable = [];
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as object;
        datarow['selected'] = false;
        dataTable.push(datarow);
      }        

      const number1 = dataRow['number1'];
      for (let i = 0; i<dataTable.length; i++) {
        const datarow = dataTable[i] as object;
        
        if (number1 === datarow['number1']) {
          datarow['selected'] = true;
          break;
        }
      }
      props.dataSelectedVoidItem['prepareArticle']['cancelStr'] = dataRow['char1'];
      state.data.dataDetail = dataTable;
    }

    const showKeyboardBill = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
    }

    const checkQty = (qty) => {
      console.log(state.qty);
      
      if (state.qty > props.dataSelectedVoidItem['anzahl']) {
        state.qty = 1;
        Notify.create({
          message: 'Maximum allowed quantity is ' + props.dataSelectedVoidItem['anzahl'],
          color: 'red',
        });
      }
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

      if (state.layout == 'numeric') {
        checkQty(state.qty);
      }
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    const showKeyboardBottom = (e) => {
      if (e.target.localName == "input") {
        state.inputbottom = e.target; 
        state.layoutBottom = e.target.dataset.layout;
      } 

      if (!state.keyboardVisible) {
        state.keyboardVisible = true;
      }      
    }

     const hideKeyboardBottom = () => {
      state.keyboardVisible = false;
    }

    const acceptKeyboardBottom = () => {
      hideKeyboardBottom();
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClick,
      onOkDialog,
      onCancelDialog,
      showKeyboardBill,
      checkQty,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      showKeyboardBottom,
      hideKeyboardBottom,
      acceptKeyboardBottom,
      zuggriff,
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

#keyboardbottom {
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

