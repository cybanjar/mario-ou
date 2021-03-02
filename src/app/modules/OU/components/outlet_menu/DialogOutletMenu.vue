<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialogModel"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white text-black">
        <q-header elevated>
          <q-toolbar class="bg-secondary justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
              viewBox="0 0 50 50"
              width="44"
              height="44"
              class="q-ml-md"
            >
              <path fill="none" d="M0 0h50v50H0z" />
              <g fill="#fefefe">
                <path
                  d="M35 15v4h7c3 0 3 4 0 4h-7v12h5v-8h5c6-1 6-12-1-12h-9zM6 15l4 14 4-14h6l-7 20H7L0 15zM21 15h5v8h7v5h-7v7h-5z"
                />
              </g>
            </svg>

            <div class="text-weight-bold">
              {{ user.htlName }} - {{ user.htlCity }}
            </div>
            <div>
              <q-btn
                flat
                :label="user.userName"
                icon="mdi-account"
                style="text-transform: none"
              >
              </q-btn>
            </div>
          </q-toolbar>
        </q-header>
        <div class="dialog__restaurant q-mt-lg">
          <div class="row">
            <div class="col-md-8">
              <h5 class="q-ml-lg">{{ restaurant }}</h5>
              <div class="q-gutter-y-md">
                <q-tabs
                  v-model="tab"
                  inline-label
                  class="text-blue q-ml-lg"
                  align="left"
                  :breakpoint="0"
                >
                  <q-tab name="variant" icon="mdi-food-variant" label="All" />
                  <q-tab name="food" icon="mdi-noodles" label="Food" />
                  <q-tab name="beverange" icon="mdi-coffee" label="Beverange" />
                  <q-tab name="foodva" icon="mdi-food" label="Other" />
                </q-tabs>

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="variant">
                    <div
                      class="row items-start q-gutter-md scroll overflow"
                      style="height: 250px"
                    >
                      <template v-for="datarow in dataFilteredSubGroup">
                        <q-card
                          class="my-card"
                          style="width: 250px"
                          :key="datarow['zknr']"
                          @click="onClickSubGroup(datarow)"
                        >
                          <q-card-section
                            :class="
                              datarow['selected']
                                ? 'bg-cyan text-white'
                                : 'bg-white text-black'
                            "
                          >
                            {{ datarow['bezeich'] }}
                          </q-card-section>
                        </q-card>
                      </template>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="food">
                    <div class="q-pa-md row items-start q-gutter-sm">
                      <q-card class="my-card">
                        <q-card-section>
                          {{ lorem }}
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="beverange">
                    <div class="q-pa-md row items-start q-gutter-md">
                      <q-card class="my-card">
                        <q-card-section>
                          {{ lorem }}
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="foodva">
                    <div class="q-pa-md row items-start q-gutter-md">
                      <q-card class="my-card">
                        <q-card-section>
                          {{ lorem }}
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>

              <div>
                <q-card class="q-ml-md searching-restaurant">
                  <div class="row justify-between">
                    <div class="col-4 items-center">
                      <strong :style="{ fontSize: '22px' }">MENU</strong>
                    </div>
                    <div class="col-4">
                      <q-input
                        dark
                        dense
                        standout
                        v-model="text"
                        input-class="text-left"
                        class="q-ml-md"
                      >
                        <template #append>
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
                <div class="q-pa-md row items-start q-gutter-md">
                  <template v-for="datarow in dataFilteredArticle">
                    <q-card
                      class="my-card"
                      style="width: 250px"
                      :key="datarow['artnr']"
                      @click="onClickArticle(datarow)"
                    >
                      <q-card-section>
                        {{ datarow['bezeich'] }}
                      </q-card-section>
                    </q-card>
                  </template>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <h5 style="visibility: hidden">Bill Number</h5>
              <div class="q-ml-lg q-gutter-y-md">
                <q-tabs
                  v-model="tabbill"
                  class="text-blue"
                  align="left"
                  :breakpoint="0"
                >
                  <q-tab class="tabcalc" name="calc" icon="mdi-calculator" />
                  <q-tab name="collage" icon="mdi-collage" />
                </q-tabs>

                <q-tab-panels v-model="tabbill" animated>
                  <q-tab-panel class="q-pa-none" name="calc">
                    <div class="row items-start">
                      <q-card class="numpad">
                        <q-card-section>
                          <vue-touch-keyboard
                            id="keyboard"
                            :layout="layout"
                            :input="input"
                          />
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel class="q-pa-none" name="collage">
                    <div
                      class="card-collage q-ma-none row items-start q-gutter-sm q-pa-sm"
                    >
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/TableTransfer.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/StandingMode.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/SelectOrderTakers.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/ChangeUser.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/Discount.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/PrintOrderChecker.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/rePrintBill1.svg"
                          />
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <img
                            class="img-collage"
                            src="../../../../icons/OU/collage/BillPrint.svg"
                          />
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
                    <h6 class="text-weight-bolder">
                      {{ dataTable['rechnr'] }} - {{ dataTable['belegung'] }}
                    </h6>
                  </div>
                  <div class="col-md-4">
                    <p>
                      <span class="text-weight-bolder">{{
                        dataTable['bezeich']
                      }}</span>
                      <br />
                      <span class="text-grey-7">D-001201</span><br />
                      {{ dataTable['bilname'] }}
                    </p>
                  </div>
                  <div class="col-md-4 items-bottom">
                    <p class="text-weight-think text-grey-7">
                      {{ dataTable['timeOpened'] }}
                    </p>
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
                  narrow-indicator
                >
                  <q-tab name="neworder" label="New Order" />
                  <q-tab name="ordered" label="Ordered" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tabbillnumber" animated>
                  <q-tab-panel class="q-pa-none" name="neworder">
                    <div class="bg-grey-10 text-white">
                      <q-list dark bordered>
                        <template v-for="datarow in dataNewOrder">
                          <q-item
                            clickable
                            v-ripple
                            :key="datarow['position']"
                            @click="onClickNewOrder(datarow)"
                          >
                            <q-item-section avatar top>
                              <q-item-label class="q-mt-sm"
                                ><strong>{{
                                  datarow['qty']
                                }}</strong></q-item-label
                              >
                            </q-item-section>

                            <q-item-section top>
                              <q-item-label lines="1">
                                <span class="text-weight-medium">{{
                                  datarow['bezeich']
                                }}</span>
                              </q-item-label>
                              <q-item-label caption lines="1">
                                {{ datarow['remark'] }}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                              <div class="text-grey-3 q-gutter-xs">
                                <q-btn
                                  size="12px"
                                  flat
                                  dense
                                  :label="'Rp.' + datarow['epreis1']"
                                />
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
                      <q-list dark bordered>
                        <template v-for="datarow in dataOrdered">
                          <q-item clickable v-ripple :key="datarow['position']">
                            <q-item-section avatar top>
                              <q-item-label class="q-mt-sm"
                                ><strong>{{
                                  datarow['qty']
                                }}</strong></q-item-label
                              >
                            </q-item-section>

                            <q-item-section top>
                              <q-item-label lines="1">
                                <span class="text-weight-medium">{{
                                  datarow['bezeich']
                                }}</span>
                              </q-item-label>
                              <q-item-label caption lines="1">
                                {{ datarow['remark'] }}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                              <div class="text-grey-3 q-gutter-xs">
                                <q-btn size="14px" flat dense label="12.000" />
                                <q-btn
                                  size="12px"
                                  flat
                                  dense
                                  round
                                  icon="mdi-dots-vertical"
                                >
                                  <q-menu>
                                    <q-list style="min-width: 100px">
                                      <q-item
                                        clickable
                                        @click="onSplitItem(datarow)"
                                        v-close-popup
                                      >
                                        <q-item-section>
                                          Split Item
                                        </q-item-section>
                                      </q-item>

                                      <q-item clickable v-close-popup>
                                        <q-item-section
                                          >Void Item</q-item-section
                                        >
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
                            >Sub Total</q-item-section
                          >
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
                              Rp. 0
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
          :dialog-select-order-taker="dialogSelectOrderTaker"
          :data-selected-order-taker="dataSelectedOrderTaker"
          @onDialogMenuOrderTaker="onDialogMenuOrderTaker"
        />

        <dialogNewOrder
          :dialog-edit-new-order="dialogEditNewOrder"
          :data-selected="dataSelectedNewOrder"
          @onDialogEditNewOrder="onDialogEditNewOrder"
          @onDialogCancelEditNewOrder="onDialogCancelEditNewOrder"
          @onRemoveNewOrder="onRemoveNewOrder"
        />

        <dialogSplitItem
          :dialog-split-item="dialogSplitItem"
          :data-selected-split-item="dataSelected"
          @onDialogSplitItem="onDialogSplitItem"
        />

        <dialogPayment
          :dialog-payment="dialogPayment"
          @onDialogPayment="onDialogPayment"
        />

        <dialogSplitBill
          :show-dialog-split-bill="showDialogSplitBill"
          :data-selected="dataSelected"
          @onDialogSplitBill="onDialogSplitBill"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import VueTouchKeyboard from 'vue-touch-keyboard';

Vue.use(VueTouchKeyboard);
Vue.component('VueTouchKeyboard', VueTouchKeyboard.components);

import {
  defineComponent,
  computed,
  watch,
  reactive,
  toRefs,
  ref,
  onMounted,
} from '@vue/composition-api';
import { date, Notify } from 'quasar';
import Vue from 'vue';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  dialog: boolean;
  title: string;
  layout: string;
  input: null;
  dialogSelectOrderTaker: boolean;
  dataSelectedOrderTaker: null;
  dataSubGroup: [];
  dataArticle: [];
  dataFilteredSubGroup: any;
  dataFilteredArticle: any;
  dataNewOrder: any;
  dataOrdered: any;
  dataSelectedNewOrder: null;
  dialogEditNewOrder: boolean;
  dataTable: null;
  dialogSplitItem: boolean;
  dataSelected: null;
  dialogPayment: boolean;
  showDialogSplitBill: boolean;
}
export default defineComponent({
  props: {
    dialogOpenMenu: { type: Boolean, required: true },
    dataTableSelected: { type: null, required: true },
  },
  setup(props, { emit, root: { $api, $root } }) {
    const user = store.state.auth.user || ({} as any);

    const state = reactive<State>({
      isLoading: false,
      dialog: false,
      title: 'Menu',
      layout: 'numeric',
      input: null,
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
      dataTable: null,
      dialogSplitItem: false,
      dataSelected: null,
      dialogPayment: false,
      showDialogSplitBill: false,
    });

    // OnClick listener
    const onClickSubGroup = (datarow) => {
      for (let i = 0; i < state.dataFilteredSubGroup.length; i++) {
        const zknr = datarow['zknr'];
        const dataRow = state.dataFilteredSubGroup[i];

        state.dataFilteredSubGroup[i]['selected'] =
          zknr == dataRow['zknr'] ? true : false;
      }

      state.dataFilteredArticle = [];
      for (let i = 0; i < state.dataArticle.length; i++) {
        const dataRow = state.dataArticle[i];
        const zknr = datarow['zknr'];

        if (dataRow['zwkum'] === zknr) {
          state.dataFilteredArticle.push(dataRow);
        }
      }
    };

    const onClickArticle = (datarows) => {
      console.log('datarow click : ', datarows);
      // data['qty'] = 1;
      // data['position'] = state.dataNewOrder.length;
      // datarow['position'] = state.dataNewOrder.length;
      state.dataNewOrder.push({
        abbuchung: datarows['abbuchung'],
        activeflag: datarows['activeflag'],
        aenderwunsch: datarows['aenderwunsch'],
        artart: datarows['artart'],
        artnr: datarows['artnr'],
        artnrfront: datarows['artnrfront'],
        artnrlager: datarows['artnrlager'],
        artnrrezept: datarows['artnrrezept'],
        autosaldo: datarows['autosaldo'],
        betriebsnr: datarows['betriebsnr'],
        bezaendern: datarows['bezaendern'],
        bezeich: datarows['bezeich'],
        bondruckernr: datarows['bondruckernr'],
        departement: datarows['departement'],
        'e-gueltig': datarows['e-gueltig'],
        endkum: datarows['endkum'],
        epreis1: datarows['epreis1'],
        epreis2: datarows['epreis2'],
        gang: datarows['gang'],
        lagernr: datarows['lagernr'],
        'mwst-code': datarows['mwst-code'],
        position: state.dataNewOrder.length,
        prozent: datarows['prozent'],
        'rec-id': datarows['rec-id'],
        's-gueltig': datarows['s-gueltig'],
        'service-code': datarows['service-code'],
        qty: 1,
        remark: '',
        zwkum: datarows['zwkum'],
      });

      // for(let i = 0; i<state.dataNewOrder.length; i++) {
      //   state.dataNewOrder[i]['position'] = i;
      // }
      console.log('New Order List : ', state.dataNewOrder);
    };

    const onClickNewOrder = (datarow) => {
      state.dataSelectedNewOrder = datarow;
      console.log('datarow : ', datarow);
      onDialogEditNewOrder(true, null);
    };

    const onSplitItem = (datarow) => {
      state.dataSelected = datarow;
      console.log('split item');
      onDialogSplitItem(true, datarow);
    };

    const onClickPayment = () => {
      onDialogPayment(true);
    };

    const onClickSplitBill = () => {
      onDialogSplitBill(true);
    };

    watch(
      () => props.dialogOpenMenu,
      (show) => {
        if (props.dialogOpenMenu) {
          state.dataTable = props.dataTableSelected;
          console.log(
            'Menu Open , props.dataTableSelected : ',
            props.dataTableSelected
          );
          zuggriff(19, 2);
          // zugriff first check here
        }
      }
    );

    const dialogModel = computed({
      get: () => props.dialogOpenMenu,
      set: (val) => {
        emit('onDialogMenu', val);
      },
    });

    const onDialogSelectOrderTaker = (val) => {
      if (!val) {
        state.dataSelectedOrderTaker = null;
      }
      state.dialogSelectOrderTaker = val;
    };

    const onDialogMenuOrderTaker = (val, val2) => {
      state.dialogSelectOrderTaker = val;
      state.dataSelectedOrderTaker = val2;
      if (!val) {
        checkBill();
      }
    };

    const onDialogCancelEditNewOrder = () => {
      state.dialogEditNewOrder = false;
    };

    const onDialogEditNewOrder = (val, datarow) => {
      state.dialogEditNewOrder = val;

      console.log(state.dataNewOrder);

      if (!val) {
        console.log('datarow : ', datarow);

        for (let i = 0; i < state.dataNewOrder.length; i++) {
          const position = datarow['position'];

          if (i === position) {
            state.dataNewOrder[i] = datarow;
            break;
          }
        }

        for (let i = 0; i < state.dataNewOrder.length; i++) {
          state.dataNewOrder[i]['position'] = i;
        }
      }
    };

    const onDialogSplitItem = (val, datarow) => {
      if (!val) {
        state.dataSelected = null;
      }
      state.dialogSplitItem = val;
    };

    const onRemoveNewOrder = (val, datarow) => {
      state.dialogEditNewOrder = val;

      if (!val) {
        for (let i = 0; i < state.dataNewOrder.length; i++) {
          const position = datarow['position'];

          if (i === position) {
            state.dataNewOrder.splice(i, 1);
            break;
          }
        }

        for (let i = 0; i < state.dataNewOrder.length; i++) {
          state.dataNewOrder[i]['position'] = i;
        }
        console.log(state.dataNewOrder);
      }
    };

    const onDialogPayment = (val) => {
      state.dialogPayment = val;
    };

    const onDialogSplitBill = (val) => {
      state.showDialogSplitBill = val;
    };

    // HTTP Request and Response

    const zuggriff = (arrayNr, expectedNr) => {
      let zuggrifval = false;
      async function asyncCall() {
        const [dataZuggrif] = await Promise.all([
          $api.outlet.getZugriff('checkPermission', {
            arrayNr: 'arrayNr',
            expectedNr: 'expectedNr',
            userInit: '01',
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
          console.log('Response : ', responseZuggrif);
          zuggrifval = responseZuggrif['zugriff'];

          if (zuggrifval) {
            state.isLoading = false;
            onDialogMenuOrderTaker(true, null);
          } else {
            Notify.create({
              message: 'No permission ',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
        }
        return zuggrifval;
      }
      asyncCall();
    };

    const getSubgroup = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataSubgroup] = await Promise.all([
          $api.outlet.getOUPrepare('hblinePrepare', {
            userInit: '1',
            dept: 1,
            currRechnr: 0,
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
            for (let i = 0; i < tempDataSubGroup.length; i++) {
              tempDataSubGroup[i]['selected'] = i === 0 ? true : false;
            }
            state.dataSubGroup = tempDataSubGroup;
          }

          if (state.dataSubGroup.length != 0) {
            getArticle();
          }
          state.isLoading = false;
        }
      }
      asyncCall();
    };

    const checkBill = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataCheckBill] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCheckBill', {
            caseType: 1,
            tischnr: state.dataTable['tischnr'],
            currDept: 1,
          }),
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
          getSubgroup();
        }
      }
      asyncCall();
    };

    const getArticle = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataArticle] = await Promise.all([
          $api.outlet.getOUPrepare('restInvRunHelp', {
            kprTime: 0,
            kprRecid: 0,
            billDate: '',
            tischnr: state.dataTable['tischnr'],
            currDept: 1,
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

          if (responseGetArticle['flCode'] === 0) {
            Notify.create({
              message:
                'Please check, Kitchen Printer Program might not be running',
              type: 'warning',
            });
          }

          state.dataArticle = [];
          state.dataFilteredArticle = [];
          state.dataArticle = responseGetArticle['tHArtikel1']['t-h-artikel1'];
          // state.dataArticle.sort(compare);
          state.dataArticle.sort(function (a, b) {
            return a['bezeich'] > b['bezeich']
              ? 1
              : b['bezeich'] > a['bezeich']
              ? -1
              : 0;
          });
          {
            state.dataFilteredSubGroup = state.dataSubGroup;

            let initZknr;
            for (let i = 0; i < state.dataFilteredSubGroup.length; i++) {
              if (i === 0) {
                initZknr = state.dataFilteredSubGroup[i]['zknr'];
                break;
              }
            }

            for (let i = 0; i < state.dataArticle.length; i++) {
              const dataRow = state.dataArticle[i];

              if (dataRow['zwkum'] === initZknr) {
                state.dataFilteredArticle.push(dataRow);
              }
            }
          }
          state.isLoading = false;
        }
      }
      asyncCall();
    };

    const confirmNewOrder = () => {
      state.dataOrdered = state.dataNewOrder;
      state.dataNewOrder = [];
    };

    function compare(a, b) {
      if (a['bezeich'] < b['bezeich']) {
        return -1;
      }
      if (a['bezeich'] > b['bezeich']) {
        return 1;
      }
      return 0;
    }

    return {
      dialogModel,
      user,
      ...toRefs(state),
      tab: 'variant',
      tabbill: 'calc',
      tabbillnumber: 'neworder',
      lorem: 'Wastern Flavor',
      text: '',
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
    };
  },
  components: {
    dialogSelectOrderTakers: () => import('./DialogSelectOrderTaker.vue'),
    dialogNewOrder: () => import('./DialogEditNewOrder.vue'),
    dialogSplitItem: () => import('./DialogSplitItem.vue'),
    dialogPayment: () => import('./payment/DialogPayment.vue'),
    dialogSplitBill: () => import('./DialogSplitBill.vue'),
  },
});
</script>
