<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
      </q-toolbar>

      <div>
        <q-card-section>
          <SInput v-model="pax" label-text="Pax" name="mdi-magnify" data-layout="numeric" type="number" ref="paxBox" @focus="showKeyboard">
            <!-- <template v-slot:append>
              <q-icon @click="showKeyboard" class="cursor-pointer"/>
            </template> -->
          </SInput>

          <SInput v-model="room" label-text="Room" data-layout="numeric" ref="roomBox" @focus="showKeyboard" @change="(v) => { onChangeRoom(v); }">
            <template v-if="pax != ''" v-slot:append>
              <q-icon @click="openDialogRoomList" name="mdi-magnify" class="cursor-pointer" />
            </template>
          </SInput>

          <SInput outlined v-model="guest" label-text="Guest" data-layout="compact" ref="guestBox" @focus="showKeyboard">
            <template v-if="dataSelected['flagChangeGuest']" v-slot:append>
              <q-icon @click="openDialogSelectGuest" name="mdi-magnify" class="cursor-pointer" />
            </template>
          </SInput>
          
          <div class="row q-gutter-xs">
              <div class="col">
                <SInput outlined v-model="time" label-text="Time" :disable="true" readonly/>
              </div>

              <div class="col">
                <SInput outlined v-model="saldo" label-text="Amount" :disable="true" readonly/>
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

        <!-- <numkeyboard v-model="pax" ok-text="OK" text-align="left"></numkeyboard> -->

        <dialogSelectGuest :dialogSelectGuest="dialogSelectGuest" @resultGuest="resultGuest" @onDialogSelectGuest="onDialogSelectGuest" :dataGCF="dataGCF" />
        <dialogSelectRoom :dialogSelectRoom="dialogSelectRoom" @resultRoom="resultRoom" @onDialogRoomList="onDialogRoomList" :dataRoom="dataRoom" />
        <dialogTableReservation :dialogTableReservation="dialogTableReservation" @onDialogTableReservation="onDialogTableReservation" />
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Reservation" @click="openTableReservation()" v-show="false" />
        <q-btn color="primary" label="Cancel" @click="onCancel()" />
        <q-btn color="primary" label="Ok" @click="onConfirm()" :disable="pax == '0' || pax == '' || pax == undefined"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs, ref, onMounted} from '@vue/composition-api';
import { formatThousands } from '~/app/helpers/numberFormat.helpers';
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
  pax: string;
  title: string;
  room: string,
  guest: string,
  time: string,
  saldo: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataSelected: {},
  numpadVisible: boolean,
  layout: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: {},
  input: null,
  dialogSelectGuest: boolean,
  dataGCF: null,
  dialogSelectRoom: boolean,
  dataRoom: null,
  dialogTableReservation: boolean,
}

export default defineComponent({
  props: {
    dialogOpenTable: { type: Boolean, required: true },
    dataTableSelected: {type: null, required: true},
  },
  setup(props, { emit, root: { $api, $root } }) {
    const state = reactive<State>({
      isLoading: false,
      dataSelected: {},
      pax: '',
      room: '',
      guest: '',
      time: '',
      saldo: 0,
      title: '',
      numpadVisible: false,
      layout: 'numeric',
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      input: null,
      dialogSelectGuest: false,
      dataGCF: null,
      dialogSelectRoom: false,
      dataRoom: null,
      dialogTableReservation: false,
    });

    watch(
      () => props.dialogOpenTable, (show) => {
        if ((props.dialogOpenTable) && (props.dataTableSelected != undefined)) {
          state.title = props.dataTableSelected.bezeich;
          state.dataSelected = props.dataTableSelected;

          if (!("belegung" in props.dataTableSelected)) {
            props.dataTableSelected['belegung'] = ''; 
          }

          state.pax = props.dataTableSelected['belegung'];
          state.room = props.dataTableSelected['rmno'];
          state.guest  = props.dataTableSelected['bilname'];
          state.saldo = props.dataTableSelected['saldo'];

          if (state.dataSelected['rechnr'] != 0) {
            state.time = props.dataTableSelected['timeOpened'];
          } else {
            state.time = '';
          }

          console.log("click : ", state.dataSelected);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogOpenTable,
        set: (val) => {
            emit('onDialog', val);
        },
    });

    const onChangeRoom = (v) => {
      console.log("onChangeRoom", v.target.value);
    }

    const onCancel = () => {
      state.input = null;
      state.numpadVisible = false;
      emit('onDialog', false);
    }

    const onConfirm = () => {
      state.numpadVisible = false;
      
      state.dataSelected['belegung'] = state.pax;
      state.dataSelected['rmno'] = state.room;
      state.dataSelected['bilname'] = state.guest;
      state.dataSelected['saldo'] = state.saldo
      
      emit('onResultOpenTable', state.dataSelected)
      emit('onDialog', false);
    }
    
    const openDialogRoomList = () => {
      state.numpadVisible = false;
      onDialogRoomList(true);
    }

    const onDialogRoomList = (val) => {
      if(!val) {
        state.dataRoom = null;
      }
      state.dialogSelectRoom = val;
    }

    const openDialogSelectGuest = () => {
      state.numpadVisible = false;
      onDialogSelectGuest(true);
    }

    const onDialogSelectGuest = (val) => {
      if(!val) {
        state.dataGCF = null;
      }
      state.dialogSelectGuest = val;
    }

    const openTableReservation = () => {
      state.numpadVisible = false;
      onDialogTableReservation(true);
    }

    const onDialogTableReservation = (val) => {
      state.dialogTableReservation = val;
    }

    const resultGuest = (dataGuest) => {
      state.dataGCF = dataGuest;
      state.guest = state.dataGCF['gname']
    }

    const resultRoom = (dataRoom) => {
      state.dataRoom = dataRoom;
      state.room = state.dataRoom['zinr'];
      state.guest = state.dataRoom['gname'];
      console.log("Room : ", state.dataRoom);
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

      // $root.$nextTick(() => {
        // setTimeout(() => {
        //   $root.$refs.paxBox[0].focus();
        // }, 20)
      // })
    }

    const hideKeyboard = () => {
      state.numpadVisible = false;
    }

    const acceptKeyboard = () => {
      hideKeyboard();
    }

    return {
      dialogModel,
      onCancel,
      onConfirm,
      openDialogRoomList,
      openDialogSelectGuest,
      onDialogSelectGuest,
      showKeyboard,
      hideKeyboard,
      resultGuest,
      resultRoom,
      acceptKeyboard,
      openTableReservation,
      onDialogRoomList,
      onDialogTableReservation,
      onChangeRoom,
      ...toRefs(state),
    };
  },
  components: {
    dialogSelectGuest: () => import('../../DialogGCF.vue'),
    dialogSelectRoom: () => import('../../DialogRoomList.vue'),
    dialogTableReservation: () => import('../../TableReservationPlan.vue'),
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
