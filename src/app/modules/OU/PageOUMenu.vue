<template>
    <div class="q-pa-sm">
        <div class="dialog__restaurant">
          <div class="row">
            <div class="col-md-8">
              <h5 class="q-ml-lg">{{ restaurant }}
                <span @click="onDialogTablePlan(true)" class="float-right bg-primary rounded-borders q-py-sm q-px-md cursor-pointer"> 
                  <q-icon color="white" name="mdi-table-furniture" >
                    <q-tooltip>
                      Select Table
                    </q-tooltip>
                  </q-icon>
                </span>
                <span @click="onDialogCashierTransfer(true)" class="q-mx-sm float-right bg-primary rounded-borders q-py-sm q-px-md cursor-pointer"> 
                  <q-icon color="white" name="mdi-table-account" >
                    <q-tooltip>
                      Cashier Transfer
                    </q-tooltip>
                  </q-icon>
                </span>

                <span @click="onDialogCloseBill(true)" class="float-right bg-primary rounded-borders q-py-sm q-px-md cursor-pointer"> 
                  <q-icon color="white" name="mdi-account-cash" >
                    <q-tooltip>
                      Close Bill
                    </q-tooltip>
                  </q-icon>
                </span>
                <span @click="onDialogChangeOutlet(true)" class="q-mr-sm float-right bg-primary rounded-borders q-py-sm q-px-md cursor-pointer"> 
                  <q-icon color="white" name="mdi-account-convert" >
                    <q-tooltip>
                      Change Outlet
                    </q-tooltip>
                  </q-icon>
                </span>

              </h5>
              <div class="q-gutter-y-md">                
                <div class="row q-ml-xs items-start q-gutter-md q-mb-md scroll overflow" style="height: 250px">
                  <template v-for="datarow in dataFilteredSubGroup">
                    <q-card flat bordered class="my-card" 
                      style="width:240px" 
                      :key="datarow['zknr']" 
                      @click="onClickSubGroup(datarow)">
                      <q-card-section :class="(datarow['selected']) ? 'bg-cyan text-white':'bg-white text-black'">
                        {{datarow['bezeich']}}
                      </q-card-section>
                    </q-card>
                  </template>
                </div>                  
              </div>

              <div>
                <q-card class="q-ml-md searching-restaurant">
                  <div class="row justify-between items-center">
                    <div class="col-4 ">
                      <strong :style="{ fontSize: '22px' }">MENU</strong>
                    </div>
                    <div class="col-4">
                      <q-input
                        dark
                        dense
                        standout
                        v-model="text"
                        data-layout="compact" 
                        ref="searcharticle"
                        input-class="text-left"
                        class="q-ml-md"
                        @input="onChangeSearchInput(text)"
                        @focus="showKeyboardSearch"
                      >
                        <template v-slot:append>
                          <q-icon v-if="text === ''" name="mdi-magnify" />
                          <q-icon
                            v-else
                            name="mdi-window-close"
                            class="cursor-pointer"
                            @click="text = ''"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card>
                <div class="q-pa-md row items-start scroll overflow" style="height: 250px">
                  <template v-for="datarow in dataFilteredArticle">
                    <q-card flat bordered
                      class="my-card q-mr-md q-mb-md" 
                      style="width:240px" 
                      :key="datarow['artnr']"
                      @click="onClickArticle(datarow)">
                      <q-card-section>
                        {{datarow['bezeich']}}
                      </q-card-section>
                    </q-card>
                  </template>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <h5 style="visibility: hidden;">Bill Number</h5>
              <div class="q-ml-lg q-gutter-y-md">
                <q-tabs
                  v-model="tabbill"
                  class="text-blue"
                  align="left"
                  :breakpoint="0"
                >
                  <q-tab class="tabcalc" name="calc" icon="mdi-calculator" />
                  <q-tab name="collage" icon="mdi-collage">
                    <q-tooltip>
                      More Options
                    </q-tooltip>
                  </q-tab>
                </q-tabs>

                <q-tab-panels v-model="tabbill" animated>
                  <q-tab-panel class="q-pa-none" name="calc">
                    <SInput v-model="qty" label-text="QTY" data-layout="numeric" ref="qtyRoomBox" @focus="showKeyboardQty"/>

                    <div class="row items-start">
                      <q-card class="numpad">
                        <q-card-section>
                          <vue-touch-keyboard
                            id="keyboard"
                            :options="options" 
                            layout="numeric"
                            :input="input" />
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel class="q-pa-none" name="collage">
                    <div
                      class="card-collage q-ma-none row items-start q-gutter-sm q-pa-sm"
                    >
                      <q-card @click="onClickTableTransfer" flat bordered>
                        <q-card-section>                          
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/TableTransfer.svg"
                          >
                          <q-tooltip>
                            Table Transfer
                          </q-tooltip>
                          </q-img>                          
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickStandingMode = true" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/StandingMode.svg"
                          >
                          <q-tooltip>
                            Standing Mode
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickDialogSelectOrderTaker()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/SelectOrderTakers.svg"
                          >
                          <q-tooltip>
                            Select Order Taker
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="flagOrderTakerDisable ? null : onClickDialogChangeUser()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/ChangeUser.svg"
                          >
                          <q-tooltip>
                            Change User
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickDiscount()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/Discount.svg"
                          >
                          <q-tooltip>
                            Discount
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/PrintOrderChecker.svg"
                          >
                          <q-tooltip>
                            Print Order Checker
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/rePrintBill1.svg"
                          >
                          <q-tooltip>
                            Reprint Bill
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickPrintBill = true" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/BillPrint.svg"
                          >
                          <q-tooltip>
                            Bill Print
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>

              <!-- Bill Number -->
              <q-card class="bill-number q-pa-md q-ml-lg q-mt-lg">
                <div class="row text-white">
                  <div class="col-md-4">
                    <h6 class="text-weight-bolder">{{dataTable.rechnr}} - {{dataTable.belegung}}</h6>
                  </div>
                  <div class="col-md-4">
                    <p>
                      <span class="text-weight-bolder">{{dataTable.bezeich}}</span> <br />
                      <span class="text-grey-7">D-001201</span><br />
                      {{dataTable.bilname}}
                    </p>
                  </div>
                  <div class="col-md-4 items-bottom">
                    <p class="text-weight-think text-grey-7">{{dataTable.timeOpened}}</p>
                  </div>
                </div>
                <q-separator />
                <q-tabs
                  v-model="tabbillnumber"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator >
                  <q-tab name="neworder" label="New Order" />
                  <q-tab name="ordered" label="Ordered" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tabbillnumber" animated>
                  <q-tab-panel class="q-pa-none" name="neworder">
                    <div class="bg-grey-10 text-white">
                      <q-list dark>
                        <template v-for="datarow in dataNewOrder">
                          <q-item clickable v-ripple :key="datarow['position']" @click="onClickNewOrder(datarow)" >
                            <q-item-section avatar top>
                              <q-item-label class="q-mt-sm"
                                ><strong>{{datarow['qty']}}</strong></q-item-label>
                            </q-item-section>

                            <q-item-section top>
                              <q-item-label lines="1">
                                <span class="text-weight-medium">{{datarow['bezeich']}}</span>
                              </q-item-label>
                              <q-item-label caption lines="1">
                                {{datarow['remark']}}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                              <div class="text-grey-3 q-gutter-xs">
                                <q-btn size="12px" flat dense :label="datarow['epreis1']" />
                              </div>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-list>
                      <div class="row q-gutter-md">
                        <div class="col">
                          <q-btn
                            :disable="dataNewOrder.length === 0"
                            color="primary"
                            rounded
                            class="full-width"
                            label="CONFIRM"
                            @click="confirmNewOrder()"
                          />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel class="q-pa-none" name="ordered">
                    <div class="bg-grey-10 text-white">
                      <q-list dark>
                        <template v-for="datarow in dataOrdered">
                          <q-item clickable v-ripple :key="datarow['position']">
                           <q-item-section avatar top>
                            <q-item-label class="q-mt-sm"><strong>{{datarow['qty']}}</strong></q-item-label>
                          </q-item-section>

                          <q-item-section top>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">{{datarow['bezeich']}}</span>
                            </q-item-label>
                            <q-item-label caption lines="1">
                              {{datarow['remark']}}
                            </q-item-label>
                          </q-item-section>

                          <q-item-section top side>
                            <div class="text-grey-3 q-gutter-xs">
                              <q-btn size="14px" flat dense :label="datarow['epreis'] + ' x ' + datarow['anzahl']" />
                              <q-btn size="12px" flat dense round icon="mdi-dots-vertical" >
                                <q-menu>
                                  <q-list style="min-width: 100px;">
                                    <q-item clickable @click="onSplitItem(datarow)" v-close-popup>
                                      <q-item-section>
                                        Split Item
                                      </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup>
                                      <q-item-section>Void Item</q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-menu>
                              </q-btn>
                            </div>
                          </q-item-section>
                           
                          </q-item>
                        </template>

                        <q-item>
                          <q-item-section class="text-grey-7"
                            >Sub Total</q-item-section>
                          <q-item-section avatar>
                            <q-item-label class="text-grey-5">
                              Rp. 0
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <!-- <q-item>
                          <q-item-section class="text-grey-7"
                            >Service</q-item-section
                          >
                          <q-item-section avatar>
                            <q-item-label class="text-grey-5">
                              Rp. 0
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section class="text-grey-7"
                            >Tax</q-item-section
                          >
                          <q-item-section avatar>
                            <q-item-label class="text-grey-5">
                              Rp. 3.000
                            </q-item-label>
                          </q-item-section>
                        </q-item> -->
                        <q-item>
                          <q-item-section class="text-white"
                            >Total</q-item-section
                          >
                          <q-item-section avatar>
                            <q-item-label class="text-white">
                              {{dataTable['saldo']}}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <div class="row q-gutter-sm">
                        <div class="col">
                          <q-btn
                            outline
                            color="primary"
                            class="full-width"
                            label="SPLIT BILL"
                            @click="onClickSplitBill()"
                          />
                        </div>
                        <div class="col">
                          <q-btn
                            color="primary"
                            class="full-width"
                            label="PAY BILL"
                            @click="onClickPayment()"
                          />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </div>
          </div>
        </div>

        <dialogSelectOrderTakers 
          :dialogSelectOrderTaker="dialogSelectOrderTaker" 
          :dataSelectedOrderTaker="dataSelectedOrderTaker" 
          @onDialogMenuOrderTaker="onDialogMenuOrderTaker"/>

        <dialogNewOrder
          :dialogEditNewOrder="dialogEditNewOrder"
          :dataSelected="dataSelectedNewOrder"
          @onDialogEditNewOrder="onDialogEditNewOrder"
          @onDialogCancelEditNewOrder="onDialogCancelEditNewOrder"
          @onRemoveNewOrder="onRemoveNewOrder"/>

        <dialogSplitItem
          :dialogSplitItem="dialogSplitItem"
          :dataSelectedSplitItem="dataSelected"
          @onDialogSplitItem="onDialogSplitItem"/>

        <dialogPayment
          :dialogPayment="dialogPayment"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          @onDialogPayment="onDialogPayment" />

        <dialogSplitBill
          :showDialogSplitBill="showDialogSplitBill"
          :dataSelectedSplitBill="dataSelected"
          @onDialogSplitBill="onDialogSplitBill"/>

        <dialogDiscountBill 
          :showDialogDiscountBill="showDialogDiscountBill"
          :dataTable="dataTable"
          @onDialogDiscountBill="onDialogDiscountBill" />

        <!-- Confirm Table Transfer -->
        <q-dialog v-model="showConfirmationDialog" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirm</q-toolbar-title>
            </q-toolbar>

            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-md-2">
                  <q-avatar icon="mdi-help" color="negative" text-color="white" />
                </div>
                <div class="col-md-10">                  
                  <p class="q-ml-md">Make sure you no others transactin with Bill: <br>
                  Do you want to continue?</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" color="primary" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onDialogTransferTable(true)" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Dialog Standing Mode -->
        <q-dialog v-model="onClickStandingMode" persistent>
          <q-card style="max-width: 1500px;width:300px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Information</q-toolbar-title>
            </q-toolbar>

            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-md-2">
                  <q-avatar icon="mdi-information" color="info" text-color="white" />
                </div>
                <div class="col-md-10">                  
                  <p class="q-pl-lg q-my-sm">Standing table not define</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn unelevated label="Ok" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <!-- Dialog Print Bill -->
        <q-dialog v-model="onClickPrintBill" persistent>
          <q-card style="max-width: 1500px;width:350px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Question</q-toolbar-title>
            </q-toolbar>

            <q-card-section>
              <div class="row">
                <div class="col-md-2">
                  <q-avatar icon="mdi-help" color="info" text-color="white" />
                </div>
                <div class="col-md-10">                  
                  <p class="q-ml-md q-mt-sm">Print the bill?</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" color="primary" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <dialogTransferTable 
          :showDialogTransferTable="showDialogTransferTable"
          :dataTable="dataTable"
          @onDialogTransferTable="onDialogTransferTable" />

        <dialogChangeUser 
          :showDialogChangeUser="showDialogChangeUser"
          @onDialogChangeUser="onDialogChangeUser" />

        <dialogTablePlan
          :showDialogTablePlan="showDialogTablePlan"
          @onDialogTablePlan="onDialogTablePlan"
          @onResultTablePlan="onResultTablePlan"/>

        <dialogInputPrice
          :showDialogInputPrice="showDialogInputPrice"
          @onDialogInputPrice="onDialogInputPrice"/>

        <dialogInputMultiple          
          :showDialogInputMultiple="showDialogInputMultiple"
          @onDialogInputMultiple="onDialogInputMultiple"/>

        <dialogSelectMenuItem 
          :showDialogSelectMenuItem="showDialogSelectMenuItem"
          @onDialogSelectMenuItem="onDialogSelectMenuItem"/>
        
        <dialogInputDescription
          :showDialogInputDescription="showDialogInputDescription"
          @onDialogInputDescription="onDialogInputDescription"/>

        <dialogInputPassword
          :showDialogInputPassword="showDialogInputPassword"
          :pass="pass"
          @onDialogInputPassword="onDialogInputPassword"/>

        <dialogCashierTransfer
          :showDialogCashierTransfer="showDialogCashierTransfer"
          :dataSelectedCashierTransfer="dataSelected"
          @onDialogCashierTransfer="onDialogCashierTransfer"/>
        
        <dialogCloseBill
          :showDialogCloseBill="showDialogCloseBill"
          @onDialogCloseBill="onDialogCloseBill" />

        <dialogChangeOutlet
          :showDialogChangeOutlet="showDialogChangeOutlet"
          :dataSelectedChangeOutlet="dataSelected"
          @onDialogChangeOutlet="onDialogChangeOutlet" />

        <vue-touch-keyboard 
            id="keyboardbottom"
            :options="options" 
            v-if="keyboardVisible" 
            layout="compact" 
            :accept="hideKeyboard" 
            :next="hideKeyboard"
            :input="inputbottom"
            :close="hideKeyboard" />

          <!-- <div>
            <q-circular-progress
              indeterminate
              size="100px"
              color="cyan"
              class="progressDialog" />
          </div> -->
    </div>
</template>

<script lang="ts">
import VueTouchKeyboard from 'vue-touch-keyboard';
// import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';

Vue.use(VueTouchKeyboard);
// Vue.use(style);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);

import { defineComponent, computed, watch, reactive, toRefs, ref, onMounted, } from '@vue/composition-api';
import { date, Notify, Cookies } from 'quasar';
import Vue from 'vue';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  dialog: boolean;
  title: string;
  input: null;
  inputbottom: null
  dialogSelectOrderTaker: boolean,
  dataSelectedOrderTaker: null,
  dataSubGroup: [],
  dataArticle: [],
  dataFilteredSubGroup: any,
  dataFilteredArticle: any,
  dataNewOrder: any,
  dataOrdered:any,
  dataSelectedNewOrder: null
  dialogEditNewOrder: boolean,
  dataTable: {},
  dialogSplitItem: boolean,
  dataSelected: {},
  dialogPayment: boolean,
  showDialogSplitBill: boolean,
  showDialogDiscountBill: boolean,
  showDialogTransferTable: boolean,
  showConfirmationDialog: boolean,
  onClickStandingMode: boolean,
  showDialogChangeUser: boolean,
  onClickPrintBill: boolean,
  currDept: any,
  showDialogTablePlan: boolean;
  dataPrepare: {},
  options: {},
  qty: any,
  keyboardVisible: boolean,
  text: string,
  showDialogInputPrice: boolean,
  dataValidationSelectArticle: {},
  tempDataRowSelectedArticle: {},
  showDialogInputMultiple: boolean,
  showDialogSelectMenuItem: boolean,
  showDialogInputDescription: boolean,
  showDialogInputPassword: boolean, 
  pass: string;
  flagOrderTakerDisable: boolean;
  flagFirstLoad: any;
  showDialogCashierTransfer: boolean,
  showDialogChangeOutlet: boolean,
  showDialogCloseBill: boolean,
  currentState: string;
}
export default defineComponent({
  setup(_, {root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      dialog: false,
      title: 'Menu',
      input: null,
      inputbottom: null,
      dialogSelectOrderTaker: false,
      dataSelectedOrderTaker: null,
      dataSubGroup: [],
      dataArticle: [],
      dataFilteredSubGroup: [] as any,
      dataFilteredArticle: [] as any,
      dataNewOrder: [] as any,
      dataOrdered: [] as any,
      dataSelectedNewOrder: null,
      dialogEditNewOrder: false,
      dataTable: {},
      dialogSplitItem: false,
      dataSelected: {},
      dialogPayment: false,
      showDialogSplitBill: false,
      showDialogDiscountBill: false,
      showDialogTransferTable: false,
      showConfirmationDialog: false,
      onClickStandingMode: false,
      showDialogChangeUser: false,
      onClickPrintBill: false,
      currDept: 1,
      showDialogTablePlan: false,
      dataPrepare: {},
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      qty: 1,
      keyboardVisible: false,
      text: '',
      showDialogInputPrice: false,
      dataValidationSelectArticle: {},
      tempDataRowSelectedArticle: {},
      showDialogInputMultiple: false,
      showDialogSelectMenuItem: false,
      showDialogInputDescription: false,
      showDialogInputPassword: false,
      pass: "",
      flagOrderTakerDisable: false,
      flagFirstLoad: 0,
      showDialogCashierTransfer: false,
      showDialogChangeOutlet: false,
      showDialogCloseBill: false,
      currentState: "",
    });

    onMounted(async () => { 
      state.isLoading = true;

      //const ouStore = {'Ou': true };
      // store.state['ou'] = ouStore;
      // sessionStorage.setItem('OU_isFisrtLoad', 'true');
      // 0 true || 1 false
      // let isFirstLoad = "0" as any;

      // let ouFirstLoad = Cookies.get('OU_isFisrtLoad'); 

      state.flagFirstLoad = Cookies.get('OU_isFisrtLoad');

      if (state.flagFirstLoad == undefined) {
        state.flagFirstLoad = Cookies.set('OU_isFisrtLoad', "0") as any;
      }

      // if (state.flagFirstLoad == 0) {
      //   state.flagFirstLoad = 1;
      //   // ouFirstLoad = Cookies.set('OU_isFisrtLoad', "0") as any;
      //   // // isFirstLoad = "0"
      // } 

      // const test = Cookies.get('OU_isFisrtLoad');
      // Cookies.remove('OU_isFisrtLoad');
      // console.log(test,"git");
      
      // const flagFirstLoad = store;
      // const flagFirstLoad = Cookies.get("OU_isFisrtLoad");

      console.log('flagFirstLoad', state.flagFirstLoad);

      setTimeout(() => {
        getHTParam(4, 60);
      }, 1000);
    });

    // onDestroy : 
    window.onbeforeunload = function(){
      Cookies.remove('OU_isFisrtLoad');
      state.flagFirstLoad = Cookies.get('OU_isFisrtLoad');
      console.log("refresh, delete ou cookies");
    }

    // OnClick listener Event
    const onClickSubGroup = (datarow) => {
      for (let i = 0; i<state.dataFilteredSubGroup.length; i++) {
        const zknr = datarow['zknr'];
        const dataRow = state.dataFilteredSubGroup[i];

        state.dataFilteredSubGroup[i]['selected'] = (zknr == dataRow['zknr']) ? true : false;
      }

      state.dataFilteredArticle = [];
      for (let i = 0; i<state.dataArticle.length; i++) {
        const dataRow = state.dataArticle[i];
        const zknr = datarow['zknr'];

        if (dataRow['zwkum'] === zknr) {
          state.dataFilteredArticle.push(dataRow);
        }
      }
    } 

    const onClickArticle = (datarows) => {
      if (state.qty == 0) {
        Notify.create({
          type: "warning",
          message: 'Quantity cannot be 0',
        });
      } else {
        getHBLineSelectItem(datarows);
      }
    }

    const onClickNewOrder = (datarow) => {
      state.dataSelectedNewOrder = datarow;
      // console.log('datarow : ', datarow);
      onDialogEditNewOrder(true, null);
    }

    const onSplitItem = (datarow) => {
      state.dataSelected = datarow;
      console.log("split item");
      onDialogSplitItem(true, datarow);
    }

    const onClickPayment = () => {
      if (state.dataTable.hasOwnProperty('dataThBill')) {
        if (state.dataTable['dataThBill'].length == 0) {
          Notify.create({
            message: 'No bill found',
              type: 'warning',
            });
            return false;
        } else if (state.dataTable['tischnr'] == 0) {
          Notify.create({
            message: 'No table selected, select table first',
              type: 'warning',
            });
            onDialogTablePlan(true);
            return false;
        } else {
          onDialogPayment(true);
        }
      } else {
        Notify.create({
          message: 'No bill found and no table selected',
          type: 'warning',
        });
        return false;
      }
    }

    const onClickSplitBill = () => {
      onDialogSplitBill(true);
    }

    const confirmNewOrder = () => {
      state.dataOrdered = state.dataNewOrder;
      state.dataNewOrder = [];
    }

    const onClickDiscount = () => {
      zuggriff(79,2,"checkOpenDiscount");
    }
   
    const onClickTableTransfer = () => {
      console.log("On Click Table Transfer");
      getRestInvCheckSaldo();
    }

    const onClickDialogSelectOrderTaker = () => {
      onDialogSelectOrderTaker(true);
      
    }

    const onClickDialogChangeUser = () => {
      console.log(" On Click Dialog Change User");
      onDialogChangeUser(true);      
    }


    // Dialog Listener
    const onDialogSelectOrderTaker = (val) => {
      if(!val) {
        state.dataSelectedOrderTaker = null;
      }
      state.dialogSelectOrderTaker = val;
    }

    const onDialogMenuOrderTaker = (val, val2) => {
      state.dialogSelectOrderTaker = val;
      state.dataSelectedOrderTaker = val2;
      
      if (!val) {
        // zuggriff(19, 2);
        // checkBill();
      }
    }

    const onDialogCancelEditNewOrder = () => {
      state.dialogEditNewOrder = false;
    }

    const onDialogEditNewOrder = (val, datarow) => {
      state.dialogEditNewOrder = val;

      if (!val) {
        for (let i = 0; i<state.dataNewOrder.length; i++) {
          const position = datarow['position'];

          if (i === position) {
            state.dataNewOrder[i] = datarow;
            break;
          }
        }

        for(let i = 0; i<state.dataNewOrder.length; i++) {
          state.dataNewOrder[i]['position'] = i;
        } 
      }
    }

    const onDialogSplitItem = (val, datarow) => {
      if (!val) {
        state.dataSelected = {};
      }
      state.dialogSplitItem = val;
    }

    const onRemoveNewOrder = (val, datarow) => {
      state.dialogEditNewOrder = val;

      if(!val) {
        for (let i = 0; i<state.dataNewOrder.length; i++) {
          const position = datarow['position'];

          if (i === position) {
            state.dataNewOrder.splice(i, 1);            
            break;
          }
        }

        for(let i = 0; i<state.dataNewOrder.length; i++) {
          state.dataNewOrder[i]['position'] = i;
        } 
        console.log(state.dataNewOrder);
      }

    }

    const onDialogPayment = (val) => {
      state.dialogPayment = val;
    }

    const onDialogSplitBill = (val) => {
      state.showDialogSplitBill = val;
    }

    const onDialogDiscountBill = (val) => {
      state.showDialogDiscountBill=val;
    }

    const onDialogTransferTable = (val) => {
      state.showDialogTransferTable=val;
    }

    const onDialogChangeUser = (val) => {
      state.showDialogChangeUser=val;
    }

    const onDialogTablePlan = (val) => {
      state.showDialogTablePlan = val;
    }

    const onDialogInputPrice = (val, result) => {
      state.showDialogInputPrice = val;

      if (!state.showDialogInputPrice && result != null) {
        if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['bezaendern']) {
          state.dataValidationSelectArticle['tempPrice'] = result;
          onDialogInputDescription(true, "");
        } else {
          state.tempDataRowSelectedArticle['epreis1'] = result;
          initDataClickMenu();
        }
      }
    }

    const onDialogInputMultiple = (val, result) => {
      state.showDialogInputMultiple = val;

      if (!state.showDialogInputMultiple && result != null) {
        // state.tempDataRowSelectedArticle['epreis1'] = result;

        console.log('result', state.tempDataRowSelectedArticle);
        const epreis1 = state.tempDataRowSelectedArticle['epreis1'];
        let epreis = (epreis1 * result);
        state.tempDataRowSelectedArticle['epreis1'] = epreis;
        state.tempDataRowSelectedArticle['bezeich'] = result + " " + state.tempDataRowSelectedArticle['bezeich'];
        
        if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['epreis1'] == 0
              && state.dataValidationSelectArticle['responseSelectItem2']['param172'] != "") {
          onDialogInputPassword(true, "");
        } else {
          initDataClickMenu();
        }
      }
    }

    const onDialogSelectMenuItem = (val, result) => {
      state.showDialogSelectMenuItem = val;

      if (!state.showDialogSelectMenuItem && result != null) {

      }
    }

    const onDialogInputDescription = (val, result) => {
      state.showDialogInputDescription = val;

      if (!state.showDialogInputDescription && result != null) {
        if (state.dataValidationSelectArticle['tempPrice'] != null) {
            state.tempDataRowSelectedArticle['epreis1'] = state.dataValidationSelectArticle['tempPrice'];
        }
        state.tempDataRowSelectedArticle['bezeich'] = result;

        if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['epreis1'] == 0 
            && state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['param172'] != "") {
          onDialogInputPassword(true, "");
        } else {
          initDataClickMenu();
        }
      }
    }

    const onDialogInputPassword = (val, result) => {
      state.showDialogInputPassword = val;

      if (!state.showDialogInputPassword && result != null) {
        if (result == "123") {
          initDataClickMenu();
        }
      }
    }
    


    // HTTP Request and Response
    const zuggriff = (arrayNr, expectedNr, flagCheck) => {
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

          // console.log('responseZuggrif : ' + flagCheck, responseZuggrif);
          // console.log('state.dataTable', state.dataTable);
          zuggrifval = responseZuggrif['zugriff'];

          if (zuggrifval == "true") {
            if (flagCheck == "getPrepare") {
              getSubgroup();
            } else if (flagCheck == "checkOpenDiscount") {
              state.isLoading = false;

              if (state.dataTable.hasOwnProperty('dataThBill')) {
                if (state.dataTable['dataThBill'] != 0 && state.dataTable['saldo'] != 0) {
                  onDialogDiscountBill(true);
                } else {
                  Notify.create({
                    message: 'Bill not found or saldo already balance',
                    type: 'warning',
                  });
                  state.isLoading = false;
                  return false;
                }
              } else {
                  Notify.create({
                    message: 'Bill not found',
                    type: 'warning',
                  });
              }
            }
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

    const getAddKitchpr = () => {}

    const getSubgroup = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataSubgroup] = await Promise.all([
          $api.outlet.getOUPrepare('hblinePrepare', {
            userInit : dataStoreLogin['userInit'],
            dept : 1,
            currRechnr : 0,
          }),
        ]);

        if (dataSubgroup) {
          const responseSubGroup = dataSubgroup || [];
          const okFlag = responseSubGroup['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.dataSubGroup = [];
          state.dataFilteredSubGroup = [];
          {
            let tempDataSubGroup = responseSubGroup['grpList']['grp-list'];
            for (let i = 0; i<tempDataSubGroup.length; i++) {
              tempDataSubGroup[i]['selected'] = i === 0 ? true : false;
            }
            state.dataSubGroup = tempDataSubGroup;

            state.dataPrepare['billdate'] = tempDataSubGroup['billdate'];
          }

          if (state.dataSubGroup.length != 0) {
            getArticle();       
          }
          state.isLoading = false;
          console.log("response subgr", responseSubGroup);
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

    const getArticle = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataArticle] = await Promise.all([
          $api.outlet.getOUPrepare('restInvRunHelp', {
            kprTime : 0,
            kprRecid : 0,
            billDate : '',
            tischnr: state.dataTable['tischnr'],
            currDept: state.currDept
          }),
        ]);

        if (dataArticle) {
          const responseGetArticle = dataArticle || [];
          const okFlag = responseGetArticle['outputOkFlag'];

          console.log('responseGetArticle : ', responseGetArticle);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (responseGetArticle['flCode'] === 1) {
             Notify.create({
              message: 'Please check, Kitchen Printer Program might not be running',
              type: 'warning'
            });
          }

          state.dataArticle = [];
          state.dataFilteredArticle = [];
          state.dataArticle = responseGetArticle['tHArtikel1']['t-h-artikel1'];
          // state.dataArticle.sort(compare);
          state.dataArticle.sort(function(a, b) { return (a['bezeich'] > b['bezeich']) ? 1 : ((b['bezeich'] > a['bezeich']) ? -1 : 0);} );
          {
            state.dataFilteredSubGroup = state.dataSubGroup;

            let initZknr;
            for (let i = 0; i<state.dataFilteredSubGroup.length; i++) {
              if (i === 0) {
                initZknr = state.dataFilteredSubGroup[i]['zknr'];
                break;
              }
            }

            for (let i = 0; i<state.dataArticle.length; i++) {
              const dataRow = state.dataArticle[i];

              if (dataRow['zwkum'] === initZknr) {
                state.dataFilteredArticle.push(dataRow);
              }
            }
          }
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

    const checkBill = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataCheckBill] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCheckBill', {
            caseType : 1,
            tischnr : state.dataTable['tischnr'],
            currDept: state.currDept
          })
        ]);

         if (dataCheckBill) {
          const responseCheckBill = dataCheckBill || [];
          const okFlag = responseCheckBill['outputOkFlag'];

          console.log('responseCheckBill : ', responseCheckBill);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          const dataThBill = responseCheckBill['tHBill']['t-h-bill'];
          for (let i = 0; i<dataThBill.length; i++) {
            if (dataThBill[i]['rechnr'] == state.dataTable['rechnr']) {
              state.dataPrepare['objCheckBill'] = dataThBill[i];
              break;
            }
          }

          state.dataTable['dataThBill'] = dataThBill;
          getBillLine();
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
    
    const getHTParam = (caseType, inp) => {
      state.isLoading = true;

      async function asyncCall() {
        const [gethtparam] = await Promise.all([
          $api.outlet.getCommonOutletUserList('getHTParam0', {
            caseType : caseType,
            inpParam: inp
          })
        ]);

        if (gethtparam) {
          const responseHTParam = gethtparam || [];
          const okFlag = responseHTParam['outputOkFlag'];

          console.log('responseHTParam : ', responseHTParam);
          getPrepare(responseHTParam['fint']);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
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

    const getPrepare = (currPrinter) => {
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPrepare', {
            pvlLanguage: 1,
            currDept : state.currDept,
            currPrinter : currPrinter,
            userInitStr: dataStoreLogin['userInit'],
            transdate: "",
          })
        ]);
        
        console.log('Menu dataPrepare : ', dataPrepare);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          state.dataPrepare = responsePrepare;
          const okFlag = responsePrepare['outputOkFlag'];
          const msgStr = responsePrepare['msgStr'];
          responsePrepare['currDept'] = state.currDept;

          console.log('responsePrepare : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (msgStr != "") {
            Notify.create({
              message: msgStr,
              color: 'red',
            });
            // Uncoment below on production : 
            // state.isLoading = false;
            // return false;
          }

            // true menu order taker dapat di klik/ enable visca versa
          if (responsePrepare['miOrdertaker'] == 'true') {
            state.flagOrderTakerDisable = false
          } else {
            state.flagOrderTakerDisable = true
          }

          if (responsePrepare['doubleCurrency'] == "true") {
            //
          }

          if (responsePrepare['flCode'] == 1) {
            
          } else {
            const bTitle = "abc;def";
            var strBtitle = bTitle.split(";");
            responsePrepare['btitleMicrosFlag'] = strBtitle[1];
            responsePrepare['btitleTitle'] = strBtitle[0];
            console.log(responsePrepare);

            zuggriff(19, 2, "getPrepare");

            if (state.flagFirstLoad == undefined) {
              onDialogTablePlan(true);
            }
            // onDialogTablePlan(true);
          }
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
    }

    const getBillLine = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataBillLine] = await Promise.all([
          $api.outlet.getOUPrepare('restInvDispBillLine', {
            doubleCurrency : false,
            rechnr: state.dataTable['rechnr'],
            currDept: state.currDept,
            availTHBill: true,
          })
        ]);

         if (dataBillLine) {
          const responseGetBillLine = dataBillLine || [];
          const okFlag = responseGetBillLine['outputOkFlag'];

          console.log('responseGetBillLine : ', responseGetBillLine);

          state.dataOrdered = responseGetBillLine['tHBillLine']['t-h-bill-line'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          onDialogMenuOrderTaker(true, null);
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

    const getHBLineSelectItem = (datarows) => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataSelectItem] = await Promise.all([
          $api.outlet.getOUPrepare('hblineSelectItem ', {
            pvILanguage : 1,
            dept : state.currDept,
            helpFlag: true,
            artListArtnr: datarows['artnr'],
          })
        ]);

         if (dataSelectItem) {
          const responseSelectItem = dataSelectItem || [];
          const okFlag = responseSelectItem['outputOkFlag'];

          console.log('responseSelectItem : ', responseSelectItem);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.dataValidationSelectArticle['responseSelectItem'] = responseSelectItem;

          getHBLineGetPrice(datarows);
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

    const getHBLineGetPrice = (datarows) => {
      async function asyncCall() {
        const [dataGetPrice] = await Promise.all([
          $api.outlet.getOUPrepare('hblineGetPrice ', {
            pvILanguage : 1,
            dept : state.currDept,
            artListArtnr: datarows['artnr'],
          })
        ]);

        if (dataGetPrice) {
          const responseGetPrice = dataGetPrice || [];
          const okFlag = responseGetPrice['outputOkFlag'];

          console.log('responseGetPrice : ', responseGetPrice);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.dataValidationSelectArticle['responseGetPrice'] = responseGetPrice;
          getHBLineSelectItem2(datarows);
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

    const getHBLineSelectItem1 = (datarows) => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataSelectItem] = await Promise.all([
          $api.outlet.getOUPrepare('hblineSelectItem1 ', {
            dept : state.currDept,
            billdate: state.dataPrepare['billdate'],
            currRechnr: state.dataTable['rechnr'],
          })
        ]);

        if (dataSelectItem) {
          const responseSelectItem = dataSelectItem || [];
          const okFlag = responseSelectItem['outputOkFlag'];

          console.log('responseSelectItem1 : ', responseSelectItem);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.dataValidationSelectArticle['responseSelectItem1'] = responseSelectItem;
          readDataClickPerArticle(datarows);
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

    const getRestInvCheckSaldo = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCheckSaldo ', {
            dept : state.currDept,
            rechnr: state.dataTable['rechnr'],
            saldo: state.dataTable['saldo'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          getRestInvGetSaldo();
          state.isLoading = true;
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

    const getRestInvGetSaldo = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvGetSaldo ', {
            dept : state.currDept,
            rechnr: state.dataTable['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('response get saldo: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.dataTable['saldo'] = response['amount'];

          if (state.dataTable['saldo'] == 0) {
            Notify.create({
              message: 'Bill not found or balance already 0',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else {
            state.showConfirmationDialog = true;
          }
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

    const getHBLineSelectItem2 = (datarows) => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataSelectItem] = await Promise.all([
          $api.outlet.getOUPrepare('hblineSelectItem2 ', {
            dept : state.currDept,
            artListArtnr: datarows['artnr'],         
          })
        ]);

        if (dataSelectItem) {
          const responseSelectItem = dataSelectItem || [];
          const okFlag = responseSelectItem['outputOkFlag'];

          console.log('responseSelectItem2 : ', responseSelectItem);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.dataValidationSelectArticle['responseSelectItem2'] = responseSelectItem;
          getHBLineSelectItem1(datarows);
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

    const readDataClickPerArticle = (datarows) => {
      state.tempDataRowSelectedArticle = {
          'abbuchung' : datarows['abbuchung'],
          'activeflag' : datarows['activeflag'],
          'aenderwunsch' : datarows['aenderwunsch'],
          'artart' : datarows['artart'],
          'artnr' : datarows['artnr'],
          'artnrfront' : datarows['artnrfront'],
          'artnrlager' : datarows['artnrlager'],
          'artnrrezept' : datarows['artnrrezept'],
          'autosaldo': datarows['autosaldo'],
          'betriebsnr': datarows['betriebsnr'],
          'bezaendern': datarows['bezaendern'],
          'bezeich': datarows['bezeich'],
          'bondruckernr': datarows['bondruckernr'],
          'departement': datarows['departement'],
          'e-gueltig': datarows['e-gueltig'],
          'endkum': datarows['endkum'],
          'epreis1': datarows['epreis1'],
          'epreis2': datarows['epreis2'],
          'gang': datarows['gang'],
          'lagernr': datarows['lagernr'],
          'mwst-code': datarows['mwst-code'],
          'position': state.dataNewOrder.length,
          'prozent': datarows['prozent'],
          'rec-id': datarows['rec-id'],
          's-gueltig': datarows['s-gueltig'],
          'service-code': datarows['service-code'],
          'qty': state.qty,
          'remark': "",
          'zwkum': datarows['zwkum'],
          'dataremark': [],
          'customRemark': ""
      };

      state.dataValidationSelectArticle['tempPrice'] = null;
      state.pass = state.dataValidationSelectArticle['responseSelectItem2']['param172'];
      
      console.log("dataValidationSelectArticle : ", state.dataValidationSelectArticle);

      if (state.dataValidationSelectArticle['responseGetPrice']['err'] == "true") {
        onDialogInputPrice(true, 0);
        return false;
      }

      if (state.dataValidationSelectArticle['responseGetPrice']['err1'] == "true") {
        onDialogInputMultiple(true, 0);
        return false;
      }

      if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['betriebsnr'] != 0) {
        onDialogSelectMenuItem(true, null);
        return false;
      }

      if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['bezaendern']) {
        onDialogInputDescription(true, "");
        return false;
      }

      initDataClickMenu();
    }

    const initDataClickMenu = () => {
      state.dataNewOrder.push({
          'abbuchung' : state.tempDataRowSelectedArticle['abbuchung'],
          'activeflag' : state.tempDataRowSelectedArticle['activeflag'],
          'aenderwunsch' : state.tempDataRowSelectedArticle['aenderwunsch'],
          'artart' : state.tempDataRowSelectedArticle['artart'],
          'artnr' : state.tempDataRowSelectedArticle['artnr'],
          'artnrfront' : state.tempDataRowSelectedArticle['artnrfront'],
          'artnrlager' : state.tempDataRowSelectedArticle['artnrlager'],
          'artnrrezept' : state.tempDataRowSelectedArticle['artnrrezept'],
          'autosaldo': state.tempDataRowSelectedArticle['autosaldo'],
          'betriebsnr': state.tempDataRowSelectedArticle['betriebsnr'],
          'bezaendern': state.tempDataRowSelectedArticle['bezaendern'],
          'bezeich': state.tempDataRowSelectedArticle['bezeich'],
          'bondruckernr': state.tempDataRowSelectedArticle['bondruckernr'],
          'departement': state.tempDataRowSelectedArticle['departement'],
          'e-gueltig': state.tempDataRowSelectedArticle['e-gueltig'],
          'endkum': state.tempDataRowSelectedArticle['endkum'],
          'epreis1': state.tempDataRowSelectedArticle['epreis1'],
          'epreis2': state.tempDataRowSelectedArticle['epreis2'],
          'gang': state.tempDataRowSelectedArticle['gang'],
          'lagernr': state.tempDataRowSelectedArticle['lagernr'],
          'mwst-code': state.tempDataRowSelectedArticle['mwst-code'],
          'position': state.dataNewOrder.length,
          'prozent': state.tempDataRowSelectedArticle['prozent'],
          'rec-id': state.tempDataRowSelectedArticle['rec-id'],
          's-gueltig': state.tempDataRowSelectedArticle['s-gueltig'],
          'service-code': state.tempDataRowSelectedArticle['service-code'],
          'qty': state.qty,
          'remark': "",
          'zwkum': state.tempDataRowSelectedArticle['zwkum'],
          'dataremark': [],
          'customRemark': ""
      });
      state.qty = 1;
      state.tempDataRowSelectedArticle = {};
      console.log('New Order List : ', state.dataNewOrder);
    }


    // Delegate Listener
    const onResultTablePlan = (result) => {
      console.log('result table plan: ', result);
      state.dataTable = result;
      checkBill();
    }

    // Private Utils 
    function compare(a, b) {
      if (a['bezeich'] < b['bezeich'] ){
        return -1;
      }
      if ( a['bezeich'] > b['bezeich'] ){
        return 1;
      }
      return 0;
    }

    const showKeyboardSearch = (e) => {
      if (e.target.localName == "input") {
        state.inputbottom = e.target; 
      } 

      if (!state.keyboardVisible) {
        state.keyboardVisible = true;
      }       
    }

    const showKeyboardQty = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
    }

    const hideKeyboard = () => {
      state.keyboardVisible = false;
    }

    const onChangeSearchInput = (input) => {
      state.dataFilteredArticle = [];

      if (state.text.length > 0) {
        for(let i = 0; i<state.dataArticle.length; i++) {
          const datarow = state.dataArticle[i];
          const bezeich = state.dataArticle[i]['bezeich'] as string;

          if (bezeich.toLocaleLowerCase().includes(state.text.toLocaleLowerCase())) {
            state.dataFilteredArticle.push(datarow);
          }
        }
      } else {
        state.dataFilteredArticle = state.dataArticle;
      }
    }

    const onClickCashierTransfer = () => {
      onDialogSplitBill(true);
    }

    const onDialogCashierTransfer = (val) => {
      state.showDialogCashierTransfer = val;
    }

    const onClickCloseBill = () => {
      onDialogCloseBill(true);
    }

    const onDialogCloseBill = (val) => {
      state.showDialogCloseBill = val;
    }

    const onClickChangeOutlet = () => {
      onDialogChangeOutlet(true, '');
    }

    const onDialogChangeOutlet = (val, flag) => {
      state.showDialogChangeOutlet = val;
      if(!val && flag == 'ok') {
        onDialogTablePlan(true);
      }
    }

    return {
      dataStoreLogin,
      ...toRefs(state),
      tab: 'variant',
      tabbill: 'calc',
      tabbillnumber: 'neworder',
      lorem: 'Wastern Flavor',
      dense: false,
      restaurant: 'Resto Barokah',
      zuggriff,
      checkBill,
      getArticle,
      getSubgroup,
      onClickSubGroup,
      onClickArticle,
      onClickNewOrder,
      onSplitItem,
      onDialogSelectOrderTaker,
      onDialogMenuOrderTaker,
      onDialogEditNewOrder,
      onDialogCancelEditNewOrder,
      onRemoveNewOrder,
      onDialogSplitItem,
      onDialogSplitBill,
      confirmNewOrder,
      onDialogPayment, 
      onClickPayment,
      onClickSplitBill,
      onClickDiscount,
      onDialogDiscountBill,
      onClickTableTransfer,
      onDialogTransferTable,
      onClickDialogSelectOrderTaker,
      onClickDialogChangeUser,
      onDialogChangeUser,
      onDialogTablePlan,
      onResultTablePlan,
      getHTParam,
      getPrepare,
      getBillLine,
      showKeyboardSearch,
      showKeyboardQty,
      hideKeyboard,
      onChangeSearchInput,
      getHBLineSelectItem,
      getHBLineGetPrice,
      onDialogInputPrice,
      onDialogInputMultiple,
      onDialogSelectMenuItem,
      onDialogInputDescription,
      onDialogInputPassword,
      onDialogCashierTransfer,
      onClickCashierTransfer,
      onClickCloseBill,
      onDialogCloseBill,
      onClickChangeOutlet,
      onDialogChangeOutlet,
    };
  },
  components: {
    dialogSelectOrderTakers: () => import('./components/outlet_menu/DialogSelectOrderTaker.vue'),
    dialogNewOrder:() => import('./components/outlet_menu/DialogEditNewOrder.vue'),
    dialogSplitItem:() => import('./components/outlet_menu/DialogSplitItem.vue'),
    dialogPayment:() => import('./components/outlet_menu/payment/DialogPayment.vue'),
    dialogSplitBill:() => import('./components/outlet_menu/DialogSplitBill.vue'),
    dialogDiscountBill:() => import('./components/outlet_menu/DialogDiscountBill.vue'),
    dialogTransferTable:() => import('./components/outlet_menu/DialogTransferTable.vue'),
    dialogChangeUser:() => import('././components/outlet_menu/DialogChangeUser.vue'),
    dialogTablePlan:()=> import('./components/outlet_menu/table/DialogTablePlan.vue'),
    dialogInputPrice:()=> import('./components/outlet_menu/components_article/DialogInputPrice.vue'),
    dialogInputMultiple:()=> import('./components/outlet_menu/components_article/DialogInputMultiple.vue'),
    dialogSelectMenuItem:()=>import('./components/outlet_menu/components_article/DialogSelectMenuItem.vue'),
    dialogInputDescription:()=>import('./components/outlet_menu/components_article/DialogInputDescription.vue'),
    dialogInputPassword:()=>import('./components/outlet_menu/components_article/DialogInputPassword.vue'),
    dialogCashierTransfer:() => import('./components/outlet_menu/DialogCashierTransfer.vue'),
    dialogCloseBill:() => import('./components/outlet_menu/DialogCloseBill.vue'),
    dialogChangeOutlet:() => import('./components/outlet_menu/DialogChangeOutlet.vue'),
  },
});
</script>

<style lang="scss">
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



