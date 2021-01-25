<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:1100px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
            <div class="row">
                <div class="col-4">
                    <SInput outlined v-model="data.num" class="q-mx-xs q-mt-sm" label-text="Outlet Number" :disable="true" readonly/>
                    <SInput outlined v-model="data.name" class="q-mx-xs q-mt-sm" label-text="Name" :disable="true" readonly/>
                </div>
                <div class="col-8">
                  <div class="row">
                    <template v-for="datarow in data.dataDetail">
                      <q-card flat bordered
                        class="col-sm-3 col-sm-4 q-ma-sm"
                        style="width:240px" 
                        :key="datarow['num']"
                        @click="onClickTable(datarow)">
                        <q-card-section :class="(datarow.selected)?'bg-cyan text-white':'bg-white text-black'">
                          {{datarow['depart']}}
                        </q-card-section>
                      </q-card>
                    </template>
                  </div>
                </div>
            </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialog"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';
import { store } from '~/store';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: any;
    buttonOkEnable: boolean;
    dataOutletSelected: {},
    num: any,
    name: string,
  }
  title: string;
}

export default defineComponent({
  props: {
    showDialogChangeOutlet: { type: Boolean, required: true },
    dataSelectedChangeOutlet: { type: Object, required: false },
    dataPrepare: { type: null, required: false },
    dataTable: { type: null, required: false },
    flagActivity: { type: String, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
        dataOutletSelected: {},
        num: 0,
        name: '',
      },
      title: '',
    });

    watch(
      () => props.showDialogChangeOutlet, (showDialogCashierTransfer) => {
        if (props.showDialogChangeOutlet) {
          state.data.buttonOkEnable = false;

          if (props.flagActivity == 'payment') {
            state.title = 'Select Outlet';
            getDataHotel();
          } else if (props.flagActivity == 'changeoutlet') {
            state.title = 'Change Outlet';
            getDataHotel();
          }
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogChangeOutlet,
        set: (val) => {
            emit('onDialogChangeOutlet', val, '');
        },
    });

    const getDataHotel = () => {
      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getCommonOutletUserList('loadHotelDepartment', { }),
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
          state.data.dataDetail = response['tHoteldpt']['t-hoteldpt'];
          state.data.dataDetail[0]['selected'] = true;
          state.data.num = state.data.dataDetail[0]['num'];
          state.data.name = state.data.dataDetail[0]['depart'];
          state.data.dataOutletSelected = state.data.dataDetail[0];
          state.isLoading = false;
        }
      }
      asyncCall();
    }

    const postDept = () => {
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvNewPos', {
            pvlLanguage: '1',
            currWaiter : 1,
            newDept: state.data.num,
            zugriff : true,
            exchgRate: props.dataPrepare['exchgRate'],
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];
          const msgStr = responsePrepare['msgStr'];

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
            state.isLoading = false;
          }
          responsePrepare['currDept'] = state.data.num;
          emit('onDialogChangeOutlet', false, 'ok', responsePrepare);
          state.isLoading = false;
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
            postDept();           
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


    // -- OnClick Listener
    const onClickTable = (dataRow) => {
     for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};
        datarow['selected'] = false;
      }

      const dataTable = [] as any;
      for (let i = 0; i<state.data.dataDetail.length; i++) {
        const datarow = state.data.dataDetail[i] as {};          
        if (state.data.dataDetail[i]['num'] == dataRow['num']) {
          datarow['selected'] = true;
        }
        dataTable.push(datarow);
      }
      state.data.dataDetail = [];
      state.data.dataDetail = dataTable;

      dataRow['selected'] = true;
      state.data.dataOutletSelected = dataRow;
      state.data.num = dataRow['num'];
      state.data.name = dataRow['depart'];

    }

    const onOkDialog = () => {
      if (props.flagActivity == 'payment') {
        emit('onDialogDepartment', false, state.data.dataOutletSelected);
      } else if (props.flagActivity == 'changeoutlet') {
        if (state.data.num > 0) {
          zuggriff(18, 1);
        } else {
          postDept();
        }

      }
    }

    const onCancelDialog = () => {
      if (props.flagActivity == 'payment') {
        state.data.dataOutletSelected = {};
        emit('onDialogDepartment', false, null);
      } else if (props.flagActivity == 'changeoutlet') {
        emit('onDialogChangeOutlet', false, '');
      }
    }


    return {
      dialogModel,
      ...toRefs(state),
      onOkDialog,
      onCancelDialog,
      onClickTable,
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
</style>

