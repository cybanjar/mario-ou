<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <v-date-picker
          mode="range"
          v-model="inputParams.date"
          :masks="{ input: ['DD/MM/YYYY'] }"
          :columns="2"
          :popover="{ visibility: 'click' }"
        >
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="From - Until"
            readonly
            v-bind="inputProps"
            clearable
            @clear="date = null"
          >
            <template v-slot:append>
              <q-icon name="mdi-event" />
            </template>
          </SInput>
        </v-date-picker>

        <div>
          <q-checkbox
            v-model="inputParams.showDayUseOnly"
            label="Show Day Use Only"
          />
        </div>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-my-md full-width"
          @click="onSearch"
        />
      </div>
    </q-drawer>
    <div class="q-ma-md">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="onResets">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round>
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" @click="onPrint"/>
        </q-btn>
      </div>

      <div>
        <STable
          :loading="table.isFetching"
          :columns="ResTableHeaders"
          :data="table.data"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          :selected.sync="selected"
          row-key="indexFoc"
          :class="table.data.length > 0 && 'selected-row-foc'"
          @row-click="onRowClick"
        >
        </STable>
      </div>
    </div>
    <DialogReportTodayDepartedGuest
      :dialog="dialogReportTodayDepartedGuest"
      :guest-bill="guestBill"
      :selected-data="selectedData"
      :is-master-bill="isMasterBill"
      @onDialogReportTodayDepartedGuest="onDialogReportTodayDepartedGuest"
    />
    <DialogReportTodayDepartedMaster
      :dialog="dialogReportTodayDepartedMaster"
      :master-bill="masterBill"
      @onDialogReportTodayDepartedMaster="onDialogReportTodayDepartedMaster"
    />
    <DialogReportTodayDepartedDetail
      :dialog="dialogReportTodayDepartedDetail"
      :detail-bill="detailBill"
      @onDialogReportTodayDepartedDetail="onDialogReportTodayDepartedDetail"
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
} from '@vue/composition-api';
import { ResTableHeaders } from './tables/Report/reportTodayDepartedGuest.table';
import { setupCalendar, DatePicker } from 'v-calendar';
import { ResTableLists } from './models/Report/reportTodayDepartedGuest.model';
import {PrintJs} from '~/app/helpers/PrintJs'

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      dialogReportTodayDepartedGuest: false,
      dialogReportTodayDepartedMaster: false,
      dialogReportTodayDepartedDetail: false,
      guestBill: [],
      selectedData: {},
      isMasterBill: false,
      masterBill: [],
      detailBill: [],
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParams: {
        date: {
          start: null,
          end: null,
        },
        priceDecimal: 0,
        showDayUseOnly: false,
      },
    });

    const getFormattedDate = (date) => {
      const year = date.getFullYear();
      const month = (1 + date.getMonth()).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    onMounted(async () => {
      state.table.isFetching = false;

      const getPrepared = await $api.frontOfficeCashier.todayCOGuestPrepare();
      const setDateBody = {
        start: new Date(getPrepared.frDate),
        end: new Date(getPrepared.frDate),
      };

      const inputParam: any = state.inputParams;
      inputParam.date = setDateBody;
      inputParam.priceDecimal = getPrepared.priceDecimal;
    });

    const onSearch = async () => {
      state.table.isFetching = true;

      const inputParam: any = state.inputParams;
      let resBody;
      resBody = {
        caseType: 1,
        pvILanguage: 1,
        frDate: getFormattedDate(inputParam.date.start),
        toDate: getFormattedDate(inputParam.date.end),
        priceDecimal: inputParam.priceDecimal,
      };

      let res;
      res = await $api.frontOfficeCashier.todayCOGuestNoDU(resBody);

      if (inputParam.showDayUseOnly) {
        resBody = {
          caseType: 2,
          pvILanguage: 1,
          clList: {
            ['cl-list']: res,
          },
        };
        res = await $api.frontOfficeCashier.todayCOGuestDUOnly(resBody);
      }

      res.map((e, i) => {
        e.indexFoc = i;
      });

      state.table.data = res;
      state.table.isFetching = false;
    };

    const onDialogReportTodayDepartedDetail = (items) => {
      state.dialogReportTodayDepartedDetail = items.dialog;

      let dialogBody;
      if (items.status === 'show detail') {
        dialogBody = {
          dialog: false,
          payload: [],
          status: 'hide master',
        };
      } else {
        dialogBody = {
          dialog: true,
          payload: [],
          status: 'hide detail and show master',
        };
      }

      onDialogReportTodayDepartedMaster(dialogBody); // eslint-disable-line
    };

    const onDialogReportTodayDepartedMaster = (items) => {
      state.dialogReportTodayDepartedMaster = items.dialog;

      let dialogBody;
      if (
        items.status === 'show master' ||
        items.status === 'hide detail and show master'
      ) {
        state.masterBill = items.payload;
        dialogBody = {
          dialog: false,
          payload: [],
          status: 'hide guest',
        };
        onDialogReportTodayDepartedGuest(dialogBody); // eslint-disable-line
      } else if (items.status === 'show detail and hide master') {
        state.detailBill = items.payload;
        dialogBody = {
          dialog: true,
          payload: items.payload,
          status: 'show detail',
        };

        onDialogReportTodayDepartedDetail(dialogBody); // eslint-disable-line
      } else if (items.status === 'hide master and show guest') {
        dialogBody = {
          dialog: true,
          payload: [],
          status: 'show guest',
        };
        onDialogReportTodayDepartedGuest(dialogBody); // eslint-disable-line
      }
    };

    const onDialogReportTodayDepartedGuest = (items) => {
      state.dialogReportTodayDepartedGuest = items.dialog;

      if (items.status === 'hide guest and show master') {
        const dialogBody = {
          dialog: true,
          payload: items.payload,
          status: 'show master',
        };

        onDialogReportTodayDepartedMaster(dialogBody);
      }
    };

    const selected = ref<ResTableLists[]>([]);

    const onRowClick = async (_, row: ResTableLists) => {
      state.table.isFetching = true;

      const getState: any = state;
      getState.selectedData = row;
      selected.value = [row];

      const getReadBillBody = {
        caseType: 2,
        billNo: 0,
        resNo: row.resnr,
        reslinNo: 0,
        actFlag: 0,
      };

      const getReadBill = await $api.frontOfficeCashier.getReadBill(
        getReadBillBody
      );

      getReadBill.tBill['t-bill'].length > 0
        ? (state.isMasterBill = true)
        : (state.isMasterBill = false);

      const readBillLineBody = {
        caseType: 2,
        rechNo: row.rechnr,
        artNo: 0,
      };

      const readBillLine = await $api.frontOfficeCashier.readBillLine(
        readBillLineBody
      );

      if (readBillLine['tBillLine']['t-bill-line'].length > 0) {
        readBillLine['tBillLine']['t-bill-line'].map((e, i) => {
          e.indexFoc = i;
        });
      }

      state.guestBill = readBillLine['tBillLine']['t-bill-line'];

      const dialogBody = {
        dialog: true,
        payload: readBillLine['tBillLine']['t-bill-line'],
        status: 'show guest',
      };

      onDialogReportTodayDepartedGuest(dialogBody);
      state.table.isFetching = false;
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.date = {
        start: null,
        end: null,
      };
      inputParam.showDayUseOnly = false;
      state.table.data = [];
    };

    const onPrint = () => {
      if (state.table.data.length !== 0) {
        PrintJs(state.table.data, ResTableHeaders, 'Today Departed Guest')
      }
    }

    return {
      ResTableHeaders,
      onSearch,
      selected,
      onRowClick,
      onDialogReportTodayDepartedGuest,
      onDialogReportTodayDepartedMaster,
      onDialogReportTodayDepartedDetail,
      onResets,
      onPrint,
      ...toRefs(state),
    };
  },
  components: {
    'v-date-picker': DatePicker,
    DialogReportTodayDepartedGuest: () =>
      import('./components/Dialog/Report/DialogReportTodayDepartedGuest.vue'),
    DialogReportTodayDepartedMaster: () =>
      import('./components/Dialog/Report/DialogReportTodayDepartedMaster.vue'),
    DialogReportTodayDepartedDetail: () =>
      import('./components/Dialog/Report/DialogReportTodayDepartedDetail.vue'),
  },
});
</script>

<style lang="scss">
.selected-row-foc {
  tbody tr.selected td {
    background: #1485cb !important;
    color: #fff;
  }
}
</style>
