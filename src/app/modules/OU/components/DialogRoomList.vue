<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 1300px; height:500px;">
      <q-toolbar absolute fixed app>
        <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
      </q-toolbar>

      <div>
        <q-card-section>
            <SInput v-model="searchStr" type="search" @change="(v) => { onChangeSearch(v); }" >
                <template v-slot:append>
                  <q-icon name="mdi-magnify" />
                </template>
            </SInput>

            <STable
              flat
              bordered
              style="height:300px;"
              dense
              :loading="isLoading"
              :columns="tableHeaders"
              :data="filteredDataRoomList"
              separator="cell"
              row-key="name"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination"
              hide-bottom>
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" :class="(props.row.selected)?'bg-blue text-white':'bg-white text-black'">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    @click="onClickTable(props.row)">
                      {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
            </STable>
            
         </q-card-section>
      </div>
      <q-separator />

      <q-card-actions align="right">
        <q-btn outline color="primary" label="Cancel" @click="onCancel()" />
        <q-btn color="primary" label="Ok" @click="onConfirm()" :disable="dataRoomSelected == {} ? true : false" />
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
import Vue from 'vue';

interface State {
  isLoading: boolean;
  dataRoomList: [],
  filteredDataRoomList: [],
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataSelected: {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataRoomSelected: {}
  title: string,
  searchStr: string,
}
export default defineComponent({
  props: {
    dialogSelectRoom: { type: Boolean, required: true },
    dataRoom: {type: null, required: true},
  },
  setup(props, { emit, root: { $api, $root } }) {
    const state = reactive<State>({
      isLoading: false,
      dataRoomList: [],
      filteredDataRoomList: [],
      dataSelected: {},
      dataRoomSelected: {},
      title: "Select Room Number",
      searchStr: "",
    });

    const tableHeaders = [
      {
            label: "RmNo",
            field: "zinr",
            name: "zinr",
            align: "right",
            format: val => `${val}`
        },{
            label: "Guest Name", 
            field: "gname",
            name: "gname",
            align: "left",
        }, {
            label: "Arrival", 
            field: "ankunft",
            name: "ankunft",
            align: "left",
        }, {
            label: "Departure", 
            field: "abreise",
            name: "abreise",
            align: "left",
        }, {
            label: "Nat", 
            field: "nation1",
            name: "nation1",
            align: "left",
        }, 
    ];

    const onCancel = () => {
      state.dataRoomList = [];
      state.filteredDataRoomList = [];
      state.searchStr = "";
      emit('onDialogRoomList', false);
    }

    const onConfirm = () => {
      tablePlanBtnRoom();
    }

    const getDataRoomList = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('tablePlanPGuestPrepare', { }),
        ]);

        if (data) {
          const tempdata = data || [];
          const okFlag = tempdata['outputOkFlag'];
            if (!okFlag ) {
              Notify.create({
                message: 'Failed when retrive data, please try again',
                color: 'red',
              });
              state.isLoading = false;
              return false;
            }
            state.dataRoomList = [];
            state.filteredDataRoomList = [];
            const charts = tempdata.pguestList['pguest-list'];
            state.dataRoomList = charts;
            state.filteredDataRoomList = state.dataRoomList;
            console.log('response : ', tempdata);
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

    const tablePlanBtnRoom = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('tablePlanBtnRoom', {
            resrecid: state.dataRoomSelected['s-recid'],
            pvlLanguage: 1,
          }),
        ]);

        if (data) {
          console.log("data: ", data);

          const tempdata = data || [];
          const okFlag = tempdata['outputOkFlag'];
            if (!okFlag ) {
              Notify.create({
                message: 'Failed when retrive data, please try again',
                color: 'red',
              });
              state.isLoading = false;
              return false;
            } else if (tempdata['msgStr'] != '') {
              Notify.create({
                message: tempdata['msgStr'],
                color: 'red',
              });
              state.isLoading = false;
              return false;
            }

            state.dataRoomList = [];
            state.filteredDataRoomList = [];
            state.searchStr = "";

            state.dataRoomSelected['gname'] = tempdata['gname'];
            state.dataRoomSelected['resnr1'] = tempdata['resnr1'];
            state.dataRoomSelected['remark'] = tempdata['remark'];
            state.dataRoomSelected['resline'] = tempdata['resline'];
            state.dataRoomSelected['saldo'] = tempdata['saldo'];

            emit("resultRoom", state.dataRoomSelected);
            emit('onDialogRoomList', false);

            console.log("state", state);
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
   
    const onChangeSearch = (v) => {
      const strSearch = v.target.value;
      state.filteredDataRoomList = [];
      
      if (strSearch != "") {
        for (let i = 0; i<state.dataRoomList.length; i++) {
          const dataRow = state.dataRoomList[i];
          const value = dataRow['zinr'] as string;

          if (value.includes(strSearch)) {
              state.filteredDataRoomList.push(dataRow);
          }
        }
      } else {
        state.filteredDataRoomList = state.dataRoomList;
      }
      // console.log(state.filteredDataRoomList);
    }

    const onClickTable = (dataRow) => {
      for (let i = 0; i<state.filteredDataRoomList.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const datarow = state.filteredDataRoomList[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.filteredDataRoomList.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const datarow = state.filteredDataRoomList[i] as {};          
        if (state.filteredDataRoomList[i]['s-recid'] == dataRow['s-recid']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.filteredDataRoomList = [];
      state.filteredDataRoomList = dataTable;

      dataRow['selected'] = true;
      state.dataRoomSelected = dataRow;
    }

    watch(
      () => props.dialogSelectRoom, (show) => {
        if ((props.dialogSelectRoom) && (props.dialogSelectRoom != undefined)) {
          state.dataSelected = props.dialogSelectRoom;
          getDataRoomList();
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogSelectRoom,
        set: (val) => {
            emit('onDialogRoomList', val);
        },
    });

    return {
      tableHeaders,
      dialogModel,
      onCancel,
      onConfirm,
      getDataRoomList,
      tablePlanBtnRoom,
      onChangeSearch,
      onClickTable,
      pagination: { page: 1, rowsPerPage: 0 },
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

.q-toolbar {
  background: $primary-grad;
  flex-shrink: 0;

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

.card-actions {
  position: absolute;
  bottom: 0;
  align-items: right;
}

</style>
