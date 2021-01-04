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

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    dataPrepare : {};
    discountValue: any;
    discountPercent: any;
    discountBalance: any;
    discountAmount: any;
  },
  layout: string;
  input: null;
  title: string;
  options: {};
  numpadVisible: boolean,
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

      },
      title: '',
      layout: 'numeric',
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      numpadVisible: false,
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
          // state.data.discountBalance
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

          // const objTHBill = responsePrepare['tHBill']['t-h-bill'][0];
          // state.title = "Discount Bill Number " + objTHBill['rechnr'] + " - " + "Table " + objTHBill['tischnr'];
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
      state.data.dataDetail = [];
      emit('onDialogDiscountBill', false);
    }

    const onClickItem = (datarow) => {
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        if (datarow['position'] == i) {
          let datarow = state.data.dataDetail[i] as object;
          datarow['selected'] = !datarow['selected'];
          break;
        }
      }
      const tempData = state.data.dataDetail;
      state.data.dataDetail = [];
      state.data.dataDetail = tempData;
      console.log('state.data.dataDetail', state.data.dataDetail);      
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

