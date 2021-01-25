<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 1000px;">
        <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">Table Reservation Record</q-toolbar-title>
        </q-toolbar>

        <div>
            <q-card-section>
                <SInput v-model="guestname" label-text="Guest Name" name="mdi-magnify" data-layout="compact" ref="guestbox" @focus="showKeyboard" />

                <SInput v-model="phone" label-text="Phone No" data-layout="numeric" ref="phonebox" @focus="showKeyboard" @change="(v) => { onChangeRoom(v); }" />

                <SInput outlined v-model="pax" label-text="Pax" data-layout="compact" ref="paxbox" @focus="showKeyboard"/>

                <SInput outlined v-model="tableno" label-text="Table No" data-layout="numeric" ref="tablebox" @focus="showKeyboard"/>
                
                <SInput outlined v-model="remarks" label-text="Remarks" data-layout="compact" ref="remarkbox" @focus="showKeyboard" type="textarea"/>

                <div class="row q-gutter-xs">
                    <div class="col">
                        <SInput outlined v-model="timefrom" label-text="From" type="time" format24h="true"/>
                    </div>

                    <div class="col">
                        <SInput outlined v-model="timeto" label-text="To" type="time" format24h="true"/>
                    </div>
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
        </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn unelevated outline color="primary" label="Cancel" @click="onCancel()" />
        <q-btn color="primary" label="Ok" @click="onConfirm()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs, ref, onMounted} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
import {displayTime} from '../utilsOU/utils';
import { date, Notify } from 'quasar';
import VueTouchKeyboard from "vue-touch-keyboard";
import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';
import Vue from 'vue';

// import numkeyboard from 'vue-numkeyboard';
// import 'vue-numkeyboard/style.css';

Vue.use(VueTouchKeyboard);
Vue.use(style);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);

// Vue.use(numkeyboard);

interface State {
  isLoading: boolean;
  guestname: string;
  phone: string;
  pax: string,
  tableno: string,
  timefrom: string,
  timeto: string,
  remarks: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataSearchSelected: {},
  numpadVisible: boolean,
  layout: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: {},
  input: null,
}

export default defineComponent({
  props: {
    dialogNewReservation: { type: Boolean, required: true },
    selected: {type: null, required: true},
    dataSelected: {type: null, required: true},
    caseType: {type: String, required: true },
  },
  setup(props, { emit, root: { $api, $root } }) {
    const state = reactive<State>({
        isLoading: false,
        dataSearchSelected: {},
        guestname: '',
        phone: '',
        pax: '',
        tableno: '',
        timefrom: '',
        timeto: '',
        remarks: '',
        numpadVisible: false,
        layout: 'numeric',
        options: {
            useKbEvents: false,
            preventClickEvent: false
        },
        input: null,
    });

    const restDataLoad = (dataSelected) => {
      async function asyncCall() {
        const currDate = new Date(dataSelected['currdate']);
        const date1 = date.addToDate(currDate, {days: -1});

        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('resPlanResdataLoad', {
            caseType: 2,
            vonTisch: dataSelected['tableno'],
            currDate: date.formatDate(date1, 'MM/DD/YYYY'),
            currDept: 1
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          console.log("response : ", responsePrepare);
          // state.dataPrepare = responsePrepare;   

          const okFlag = responsePrepare['outputOkFlag'];
          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          state.pax = responsePrepare['pax'];
          state.tableno = dataSelected['tableno'];
          let time = dataSelected['timestart'];
          state.timefrom = time.slice(0, 2) + ":" + time.slice(2);
          time = dataSelected['timeend'];
          state.timeto = time.slice(0, 2) + ":" + time.slice(2);
          console.log('state', state);
        }
      }
      asyncCall();
    }

    const prepareSaveData = () => {
       async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('resPlanMkresPrepare', {
            sRecid: 0,
            currDept: 1
          }),
        ]);

        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          console.log("response prepare save : ", responsePrepare);
          // state.dataPrepare = responsePrepare;   

          const okFlag = responsePrepare['outputOkFlag'];
          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          async function asyncCall() {
            const [dataPrepare] = await Promise.all([
              $api.outlet.getOUPrepare('resPlanMkresBtnExit44', {
                pvlLanguage: 1,
                movedTisch: state.tableno,
                sRecid: 0,
                currDept: 1,
                currDate: '',
                vonZeit: '',
                bisZeit: '',
                pax: '',
                telefon: '',
                gname: '',
                userInit: '',
                comments: '',
              }),
            ]);

            if (dataPrepare) {
              const responsePrepare = dataPrepare || [];
              console.log("response prepare save : ", responsePrepare);
              // state.dataPrepare = responsePrepare;   

              const okFlag = responsePrepare['outputOkFlag'];
              if (!okFlag) {
                Notify.create({
                  message: 'Failed when retrive data, please try again',
                  color: 'red',
                });
                state.isLoading = false;
                return false;
              }
            }
          }
          asyncCall();
        }
      }
      asyncCall();
    }

    watch(
      () => props.dialogNewReservation, (show) => {
        if ((props.dialogNewReservation) && (props.selected != undefined)) {
          console.log('watch: ', props.dataSelected);
          state.dataSearchSelected = props.dataSelected;
          restDataLoad(props.dataSelected);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogNewReservation,
        set: (val) => {
            emit('onDialogNewReservation', val);
        },
    });

    const onChangeRoom = (v) => {
      console.log("onChangeRoom", v.target.value);
    }

    const onCancel = () => {
      state.input = null;
      state.numpadVisible = false;
      emit('onDialogNewReservation', false);
    }

    const onConfirm = () => {
      state.numpadVisible = false;
      console.log('state', state);
      // convertTime24H(state.timefrom);
      // prepareSaveData();
            
      // emit('onDialogNewReservation', false);
    }
   
    const showKeyboard = (e) => {
      // console.log('e : ', e);
      // console.log("localName : ", e.target.localName);
      // console.log("Input : ", state.input);
      // console.log("this : ", $root);

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

    const convertTime24H = (starttime) => {
      var hours = Number(starttime.match(/^(\d+)/)[1]);
      var minutes = Number(starttime.match(/:(\d+)/)[1]);
      var AMPM = starttime.match(/\s(.*)$/)[1];
      if (AMPM == "pm" && hours < 12) hours = hours + 12;
      if (AMPM == "am" && hours == 12) hours = hours - 12;        
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if (hours < 10) sHours = "0" + sHours;
      if (minutes < 10) sMinutes = "0" + sMinutes;
      return (sHours +':'+sMinutes);
    }

    return {
      dialogModel,
      onCancel,
      onConfirm,
      showKeyboard,
      hideKeyboard,
      acceptKeyboard,
      restDataLoad,
      prepareSaveData,
      onChangeRoom,
      convertTime24H,
      ...toRefs(state),
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
