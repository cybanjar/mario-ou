<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:550px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col q-mr-md">
                <SInput outlined label-text="Discount (%)" v-model="data.discountPercent" :data-layout="layout" ref="discountPercent" @focus="showKeyboard" @input="onChangeDiscount()" />
            </div>

            <div class="col">
              <SInput outlined  label-text="Voucher" :disable="true" readonly/>
            </div>
          </div>

          <div class="q-gutter-sm">
            <q-checkbox v-model="data.checkBoxSelection" val="1" label="All Food" />
            <q-checkbox v-model="data.checkBoxSelection" val="2" label="All Beverage" />
            <q-checkbox v-model="data.checkBoxSelection" val="3" label="All Other" />
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <q-list bordered padding>
                <template v-for="datarow in data.dataDetail">
                  <q-item :class="(datarow.selected)?'bg-cyan text-white':'bg-white text-black'" clickable v-ripple :key="datarow['position']" @click="onClickItem(datarow)">
                    <q-item-section side top>
                      <q-checkbox v-model="datarow['selected']"  />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{datarow['bezeich']}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col q-mr-md">
                <SInput outlined label-text="Discount" v-model="data.discountValue" :data-layout="layout" ref="discountValue" @focus="showKeyboard" :disable="true" readonly />
            </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col q-mr-md">
                <SInput outlined label-text="Amount" v-model="data.discountAmount" :data-layout="layout" ref="discountAmount" @focus="showKeyboard" :disable="true" readonly />
            </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col q-mr-md">
                <SInput outlined label-text="Balance" v-model="data.discountBalance" :data-layout="layout" ref="discountBalance" @focus="showKeyboard" :disable="true" readonly />
            </div>
          </div>

          <q-dialog v-model="showDialogComfirmation" persistent>
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
                  <p class="q-ml-md">Select a discount article? <br>
                  Do you want to continue?</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" color="primary" @click="onClickConfirmation('cancel')" />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation('ok')" />
            </q-card-actions>
          </q-card>
        </q-dialog>


          
          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <vue-touch-keyboard
                id="keyboard"
                :layout="layout"
                :options="options" 
                v-if="numpadVisible" 
                :input="input"
                :cancel="hideKeyboard" 
                :accept="acceptKeyboard" 
                :next="acceptKeyboard"
                :close="hideKeyboard" />
            </div>
          </div>
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialogSelectUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import VueTouchKeyboard from "vue-touch-keyboard";
import {formatThousands} from '~/app/helpers/numberFormat.helpers';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    dataPrepare : {};
    discountValue: any;
    discountPercent: any;
    discountBalance: any;
    discountAmount: any;
    dataArticleSelected: {},
    checkBoxSelection: any,
  },
  layout: string;
  input: null;
  title: string;
  options: {};
  numpadVisible: boolean,
  showDialogComfirmation: boolean
}

export default defineComponent({
  props: {
    showDialogDiscountBill: { type: Boolean, required: true },
    dataTable: { type: Object, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        dataPrepare : {},
        discountValue: 0,
        discountPercent: 0,
        discountBalance: 0,
        discountAmount: 0,
        dataArticleSelected: {},
        checkBoxSelection: [],
      },
      title: '',
      layout: 'numeric',
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      numpadVisible: false,
      showDialogComfirmation: false,
    });

    watch(
      () => props.showDialogDiscountBill, (showDialogSplitBill) => {
        if (props.showDialogDiscountBill) {
          state.title = 'Discount ';
          getDisc1Prepare();
        }
      }
    );

    // -- HTTP Request and Read
    const getDisc1Prepare = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('disc1Prepare', {
            room : props.dataTable['rmno'],
            dept : 1,
            tischnr : props.dataTable['tischnr'],
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataPrepare['prepare1'] = responsePrepare;

          const objTHBill = responsePrepare['tHBill']['t-h-bill'][0];
          state.title = "Discount Bill Number " + objTHBill['rechnr'] + " - " + "Table " + objTHBill['tischnr'];

          getDisc1Prepare1();
          console.log("responsePrepare", responsePrepare);
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

    const getDisc1Prepare1 = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('disc1Prepare1', {
            dept : 1,
            tischnr : props.dataTable['tischnr'],
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataPrepare['prepare2'] = responsePrepare;
          state.data.dataDetail = responsePrepare['tHBillLine']['t-h-bill-line'];

          for (let i = 0; i<state.data.dataDetail.length; i++) {
            let datarow = state.data.dataDetail[i] as object;
            datarow['selected'] = false;
            datarow['position'] = i;
          }

          getDisc1GetArticle();

          // const objTHBill = responsePrepare['tHBill']['t-h-bill'][0];
          // state.title = "Discount Bill Number " + objTHBill['rechnr'] + " - " + "Table " + objTHBill['tischnr'];
          console.log("responsePrepare1", responsePrepare);
          console.log("dataDetail : ", state.data.dataDetail);
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

    const getDisc1GetArticle = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('disc1GetArticle', {
            dept : 1,
            discValue: state.data.discountPercent, //discount input manual
            procent: state.data.dataPrepare['prepare1']['procent'],
            bBillart: 0,
            b2Billart: 0
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.data.dataPrepare['prepareArticle'] = responsePrepare;
          for (let i = 0; i<state.data.dataDetail.length; i++) {
            const datarow = state.data.dataDetail[i] as any;
            datarow['selected'] = false;
            datarow['prtflag'] = 0;
          }
          const tempData = state.data.dataDetail;
          state.data.dataDetail = [];
          state.data.dataDetail = tempData;

          console.log("responsePrepareGetArticle", responsePrepare);
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

    const getDisc1CalAmount = (datarow) => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('disc1CalAmount', {
            menuDepartement : 1,
            menuArtnr: datarow['artnr'],
          }),
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];
          const selected = datarow['selected'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          console.log("responseDisc1CalAmount", response);
          console.log('prepare article: ', state.data.dataPrepare['prepareArticle']);

          if (selected && (datarow['artnr'] == state.data.dataPrepare['prepare1']['discArt1'] && 
                datarow['artnr'] == state.data.dataPrepare['prepare1']['discArt2'] && 
                datarow['artnr'] == state.data.dataPrepare['prepare1']['discArt3']) ) {
                Notify.create({
                  message: 'Select a discount article',
                  color: 'red',
                });
                state.isLoading = false;
                return false;
            }  

            state.data.dataPrepare['prepareCalAmount'] = response;
            const discList = state.data.dataPrepare['prepareArticle']['discList']['disc-list'];
            const tArtikel = state.data.dataPrepare['prepareCalAmount']['tArtikel']['t-artikel'];
            const tHArtikel = state.data.dataPrepare['prepareCalAmount']['tHArtikel']['t-h-artikel'];

            // Calculate Discount
            let discount = 0 as any;
            const flagTax = state.data.dataPrepare['prepare2']['p134'];
            const flagService = state.data.dataPrepare['prepare2']['p135'];

            state.data.discountValue = discount.toFixed(2);

            for (let i = 0; i<state.data.dataDetail.length; i++) {
              const datarow = state.data.dataDetail[i];
              const selected = datarow['selected'];

              if (selected && (datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt1'] && 
                  datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt2'] &&
                    datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt3'])) {

                // const tempValue = (datarow['epreis'] * state.data.discountPercent) / 100;
                // const tempValue2 = (tempValue * tHArtikel[0]['service']) / 100;
                // discount = discount + (tempValue + (tHArtikel[0]['service'] * tempValue /100) + tempValue2);

                if (flagTax == "true" || flagService == "true") { 
                  getDataArticle(tHArtikel[0]['artnr']);
                } else {
                  const tempValue = (datarow['epreis'] * state.data.discountPercent) / 100;
                  const tempValue2 = (tempValue * tHArtikel[0]['service']) / 100;
                  discount = discount + (tempValue + (tHArtikel[0]['service'] * tempValue /100) + tempValue2);
      
                  state.data.discountValue = (discount.toFixed(2));

                  console.log('epreis', datarow['epreis']);
                  console.log('val1 : ' , tempValue);
                  console.log('val2 : ' , tempValue2);
                  console.log('discount value : ' , flagTax);          
                }

                // if (flagTax == "true") { // p134
                  
                // } 

                // if (flagService == "true") { // p135

                // } 

              }
            }
            // state.data.discountValue = (discount.toFixed(2));

            // Check Here
            if (discList.length == 0) {
              Notify.create({
                message: 'Discount Article not found for menu item ' + datarow['artnr'] + " " + datarow['bezeich'],
                color: 'red',
              });
            } 

            let flag = false;
            state.data.discountBalance = (state.data.discountAmount - state.data.discountValue).toFixed(2);
            
            // check here
            // for (let i = 0; i<discList.length; i++) {
            //   const umzatI = discList[i]['umsatzart'];
            //   const mwstI = discList[i]['mwst'];
            //   const serviceI = discList[i]['list.service '];

            //   for (let x = 0; x<tArtikel.length; x++) {
            //     const umzatX = tArtikel[x]['umsatzart'];
            //     if (umzatI == umzatX) {
            //       flag = true;
            //       break;
            //     }
            //   }
            // }
            /*else {
              let flag = false;
              // let balance = 0;

              // const tempBalance = state.data.discountAmount - state.data.discountValue;
              state.data.discountBalance = state.data.discountAmount - state.data.discountValue;

              
              // check here
              for (let i = 0; i<discList.length; i++) {
                const umzatI = discList[i]['umsatzart'];
                const mwstI = discList[i]['mwst'];
                const serviceI = discList[i]['list.service '];

                for (let x = 0; x<tArtikel.length; x++) {
                  const umzatX = tArtikel[x]['umsatzart'];
                  if (umzatI == umzatX) {
                    flag = true;
                    break;
                  }
                }

                // if (flag) {
                //   for (let y = 0; y<tHArtikel.length; y++) {
                //     const mwst = tHArtikel[y]['mwst'];
                //     const service = tHArtikel[y]['mwst'];

                //     if (mwstI == mwst && serviceI == service) {
                //       const tempBalance = state.data.discountAmount - state.data.discountValue;
                //       // origAmt  atau "Amount" = balance
                //       // balance atau "balance" = balance + amount atau "Discount".
                //     }
                //   }
                // }
              }*/
              // state.data.discountBalance = balance;
            // }

          // console.log('nettoBetrag : ', nettoBetrag);

            const tempData = state.data.dataDetail;
            state.data.dataDetail = [];
            state.data.dataDetail = tempData;
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

    const getDataArticle = (artnr) => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataArticle] = await Promise.all([
          $api.outlet.getCommonOutletUserList('readHArtikel', {
            caseType : "1",
            artNo : artnr,
            dept : "1",
            aName : "",
            artart : "0",
            betriebsNo : "0",
            actFlag : "true",
          }),
        ]);

        if (dataArticle) {
          const responseArticle = dataArticle || [];
          const okFlag = responseArticle['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          getDataTaxService(responseArticle['tArtikel']['t-artikel'][0]['artnrfront']);
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

    const getDataTaxService = (artnrfront) => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataTaxService] = await Promise.all([
          $api.outlet.getOUPrepare('calcServtaxes', {
            iCase : "1",
            inpArtNo : artnrfront,
            inpDeptNo : "1",
            inpDate : ""
          }),
        ]);

        if (dataTaxService) {
          const responseTaxService = dataTaxService || [];
          const okFlag = responseTaxService['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

            const discList = state.data.dataPrepare['prepareArticle']['discList']['disc-list'];
            const tArtikel = state.data.dataPrepare['prepareCalAmount']['tArtikel']['t-artikel'];
            const tHArtikel = state.data.dataPrepare['prepareCalAmount']['tHArtikel']['t-h-artikel'];

            let discount = 0 as any;
            const flagTax = state.data.dataPrepare['prepare2']['p134'];
            const flagService = state.data.dataPrepare['prepare2']['p135'];

             for (let i = 0; i<state.data.dataDetail.length; i++) {
              const datarow = state.data.dataDetail[i];
              const selected = datarow['selected'];

              if (selected && (datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt1'] && 
                  datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt2'] &&
                  datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt3'])) {

                  const tempValue = ((datarow['epreis'] * state.data.discountPercent) / 100);
                  const tempValue2 = ((tempValue * tHArtikel[0]['service']) / 100);
                  discount = discount + ((tempValue * 0.1 )+ (tHArtikel[0]['service'] * tempValue /100) + tempValue2);
      
                  state.data.discountValue = (discount.toFixed(2));

                  console.log('epreis', datarow['epreis']);
                  console.log('val1 : ' , tempValue);
                  console.log('val2 : ' , tempValue2);
                  console.log('discount value : ' , flagTax);       
               
              }
            }


          console.log("responseTaxService", responseTaxService);
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



    const dialogModel = computed({
        get: () => props.showDialogDiscountBill,
        set: (val) => {
            emit('onDialogDiscountBill', val);
        },
    });

    const tableHeadersPrint = [
      {
            label: "name", 
            field: "name",
            name: "name",
            align: "center",
        }, {
            label: "id", 
            field: "id",
            name: "id",
            align: "center",
        },
    ];

    // -- 
    const onOkDialogSelectUser = () => {
    }

    const onCancelDialog = () => {
      state.data.discountValue = 0;
      state.data.discountBalance = 0;
      state.data.discountAmount = 0;
      state.data.discountPercent = 0;
      state.data.dataDetail = [];
      emit('onDialogDiscountBill', false);
    }

    const onClickItem = (datarow) => {
      // console.log('datarow : ', datarow);

      // amount   = ? || rumus / betrag + betrag      v
      // balance  = ? || rumus / amount - discount    x
      // discount = input text || input% * amount     v

      state.data.dataArticleSelected = datarow;
      
      // for (let i = 0; i<state.data.dataDetail.length; i++) {
      //   let datarow = state.data.dataDetail[i] as object;
      //   datarow['selected'] = false;
      //   datarow['prtflag'] = 0;
      // }

      // console.log('artnr : ', datarow['artnr']);
      // console.log('discArt1 : ', state.data.dataPrepare['prepare1']['discArt1']);
      // console.log('discArt2 : ', state.data.dataPrepare['prepare1']['discArt2']);
      // console.log('discArt3 : ', state.data.dataPrepare['prepare1']['discArt3']);

      // console.log('Selected : ', state.data.dataArticleSelected['selected']);

      if (!state.data.dataArticleSelected['selected'] && (state.data.dataArticleSelected['artnr'] == state.data.dataPrepare['prepare1']['discArt1'] || 
          state.data.dataArticleSelected['artnr'] == state.data.dataPrepare['prepare1']['discArt2'] ||
            state.data.dataArticleSelected['artnr'] == state.data.dataPrepare['prepare1']['discArt3'])) {
          state.showDialogComfirmation = true;
      } else if (state.data.dataArticleSelected['selected'] && (state.data.dataArticleSelected['artnr'] == state.data.dataPrepare['prepare1']['discArt1'] ||
          state.data.dataArticleSelected['artnr'] == state.data.dataPrepare['prepare1']['discArt2'] ||
            state.data.dataArticleSelected['artnr'] == state.data.dataPrepare['prepare1']['discArt3'])) {
            
            state.data.dataArticleSelected['selected'] = false;
            datarow['prtflag'] = 0;
            calculateBalanceAndAmount();


            // for (let i = 0; i<state.data.dataDetail.length; i++) {
            //   let datarow = state.data.dataDetail[i] as object;
            //   datarow['selected'] = false;
            //   datarow['prtflag'] = 0;
            // }
      } else {
        // Assign data selected
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          if (state.data.dataArticleSelected['position'] == i) {
            let datarow = state.data.dataDetail[i] as object;
            datarow['selected'] = !datarow['selected'];
            datarow['prtflag'] = 1;
            break;
          }
        }
        calculateBalanceAndAmount();
      }
    }

    const onClickConfirmation = (flag) => {
      if (flag == "ok") {
        // Assign data selected
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          const datarow = state.data.dataDetail[i] as any;

          if (datarow['position'] == i) {
            state.data.dataArticleSelected['selected'] = true;
            state.data.dataArticleSelected['prtflag'] = 1;

            datarow[i] = state.data.dataArticleSelected;
            break;
          }
        }
        calculateBalanceAndAmount();
        state.showDialogComfirmation = false;
      } else {
        for (let i = 0; i<state.data.dataDetail.length; i++) {
          let datarow = state.data.dataDetail[i] as object;
          if (datarow['position'] == i) {
            datarow['selected'] = false;
            datarow['prtflag'] = 0;

            state.data.dataArticleSelected = {};
            break
          }
        }
        calculateBalanceAndAmount();
        state.showDialogComfirmation = false;
      }
    }

    // Calculate Balance, Discount, Amount
    const calculateBalanceAndAmount = () => {
      let amount = 0;
      state.data.discountAmount = amount;

      const procent = state.data.dataPrepare['prepare1']['procent'];

      for(let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i];
        const selected = datarow['selected'];

        if (selected) {
          if (datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt1'] &&
              datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt2'] &&
              datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt3']) {            
            amount = amount + datarow['betrag'];
          }
        }
      }
      state.data.discountAmount = (amount).toFixed(2);


      // Calculate Balance
      for(let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i];
        const selected = datarow['selected'];

        if (selected && datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt1'] && 
            datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt2'] &&
              datarow['artnr'] != state.data.dataPrepare['prepare1']['discArt3']) {
          getDisc1CalAmount(datarow); 
          break;
        }
      }
    }


    const onChangeDiscount = () => {
        getDisc1GetArticle();
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
      tableHeadersPrint,
      onOkDialogSelectUser,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      onClickItem,
      onCancelDialog,
      onChangeDiscount,
      getDisc1Prepare,
      getDisc1Prepare1,
      getDisc1CalAmount,
      onClickConfirmation,
      getDataArticle,
      getDataTaxService,
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

