<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="width: 900px; height:500px;">
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
              style="height:300px;"
              dense
              :loading="isLoading"
              :columns="tableHeaders"
              :data="dataGuest"
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

      <div align="center" justify="center" class="q-gutter-sm mt5">
        <q-radio dense v-model="caseType" val="0" label="Individual" v-on:click.native="onChangeRadio('0')" />
        <q-radio dense v-model="caseType" val="1" label="Company" v-on:click.native="onChangeRadio('1')"/>
        <q-radio dense v-model="caseType" val="2" label="Travel Agent" v-on:click.native="onChangeRadio('2')"/>
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onCancel()" />
        <q-btn color="primary" label="Ok" @click="onConfirm()" />
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
  dataGuest: [],
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataSelected: {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataGuestSelected: {}
  title: string,
  searchStr: string,
  caseType: string,
}
export default defineComponent({
  props: {
    dialogSelectGuest: { type: Boolean, required: true },
    dataGCF: {type: null, required: true},
  },
  setup(props, { emit, root: { $api, $root } }) {
    const state = reactive<State>({
      isLoading: false,
      dataGuest: [],
      dataSelected: {},
      dataGuestSelected: {},
      title: "Select Guest",
      searchStr: "",
      caseType: '0'
    });

    const tableHeaders = [
      {
            label: "Name",
            field: "gname",
            name: "gname",
            align: "left",
            format: val => `${val}`
        },{
            label: "City", 
            field: "wohnort",
            name: "wohnort",
            align: "left",
        }, {
            label: "Guest Number", 
            field: "gastnr",
            name: "gastnr",
            align: "right",
        },
    ];

    const onCancel = () => {
      state.dataGuest = [];
      state.searchStr = "";
      state.caseType = '0';
      emit('onDialogSelectGuest', false);
    }

    const onConfirm = () => {
      getTablePlanBtnGCF();
    }

    const getDataGuestList = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getCommonOutletUserList('getAllGuestList', {
            caseType: 3,
            sorttype: state.caseType,
            fname: ' ',
            lname: '*' + state.searchStr,
          }),
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
            state.dataGuest = [];
            const charts = tempdata.tGuest['t-guest'];

            for (let i=0; i<charts.length; i++) {
              charts[i]["bill-datum"] = date.formatDate(charts[i]["bill-datum"], 'DD/MM/YYYY');
              charts[i]["zeit"] = displayTime(charts[i]["zeit"]);
            } 
            state.dataGuest = charts;
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

    const getTablePlanBtnGCF = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('tablePlanBtnGCF', {
            gastNo: state.dataGuestSelected['gastnr'],
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
            }

            state.dataGuest = [];
            state.searchStr = "";

            state.dataGuestSelected['gname'] = data['gname'];
            state.dataGuestSelected['resnr1'] = data['resnr1'];
            state.dataGuestSelected['remark'] = data['remark'];

            emit('resultGuest', state.dataGuestSelected);
            emit('onDialogSelectGuest', false);
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
      setTimeout(function(){ getDataGuestList(); }, 10);
    }

    const onClickTable = (dataRow) => {
      for (let i = 0; i<state.dataGuest.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const datarow = state.dataGuest[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.dataGuest.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const datarow = state.dataGuest[i] as {};          
        if (state.dataGuest[i]['gastnr'] == dataRow['gastnr']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.dataGuest = [];
      state.dataGuest = dataTable;

      dataRow['selected'] = true;
      state.dataGuestSelected = dataRow;
    }

    const onChangeRadio = (val) => {
      state.searchStr = "";
      state.dataGuest = [];
    }

    watch(
      () => props.dialogSelectGuest, (show) => {
        if ((props.dialogSelectGuest) && (props.dialogSelectGuest != undefined)) {
          state.dataSelected = props.dataGCF;
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogSelectGuest,
        set: (val) => {
            emit('onDialogSelectGuest', val);
        },
    });

    return {
      tableHeaders,
      dialogModel,
      onCancel,
      onConfirm,
      getDataGuestList,
      onChangeSearch,
      onClickTable,
      onChangeRadio,
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
