<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">User</p>
        <q-checkbox
          v-model="inputParams.displayAllUser"
          label="Display All User"
        />
        <q-checkbox
          v-model="inputParams.selectAllUser"
          label="Select All User"
        />
        <SInput
          placeholder="Search Username"
          v-model="inputParams.searchUser"
          @keyup.delete="onDeleteKeyword(inputParams.searchUser)"
          class="q-mt-sm"
        />
        <q-scroll-area class="r-payment-cb-group">
          <div id="checkboxReportPayment">
            <q-option-group
              v-model="inputParams.users"
              :options="users"
              type="checkbox"
              ><q-separator
            /></q-option-group>
          </div>
        </q-scroll-area>

        <q-separator class="q-mb-md q-mt-lg" />

        <v-date-picker
          mode="single"
          v-model="inputParams.date"
          :masks="{ input: ['DD/MM/YYYY'] }"
          :columns="1"
          :popover="{ visibility: 'click' }"
        >
          <SInput
            label-text="Date"
            slot-scope="{ inputProps }"
            placeholder="Select Date"
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

        <p class="q-mb-xs">Shift</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="shifts"
          v-model="inputParams.shift"
          :dense="true"
        />

        <q-checkbox
          v-model="inputParams.indexSummaryOnly"
          label="Index Summary Only"
        />

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
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="onCloseShift">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
      </div>

      <div>
        <STable
          :loading="table.isFetching"
          :columns="ResTableHeaders"
          :data="table.data"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          row-key="indexFoc"
          style="height: 600px;"
        >
        </STable>
      </div>
    </div>
    <DialogReportPaymentJournalByUserClosedShift
      :dialog="dialogReportPaymentJournalByUserClosedShift"
      @onDialogReportPaymentJournalByUserClosedShift="
        onDialogReportPaymentJournalByUserClosedShift
      "
    />
    <DialogReportPaymentJournalByUserClosedShiftConfirm
      :dialog="dialogReportPaymentJournalByUserClosedShiftConfirm"
      :from-date="dialogParams.fromDate"
      :shift="dialogParams.shift"
      @onDialogReportPaymentJournalByUserClosedShiftConfirm="
        onDialogReportPaymentJournalByUserClosedShiftConfirm
      "
    />
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  watch,
} from '@vue/composition-api';
import { ResTableHeaders } from './tables/Report/reportPaymentJournalByUser.table';
import { setupCalendar, DatePicker } from 'v-calendar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      usersMaster: [],
      users: [],
      dialogReportPaymentJournalByUserClosedShift: false,
      dialogReportPaymentJournalByUserClosedShiftConfirm: false,
      shifts: [
        { label: 'All Shift', value: 0 },
        { label: 'Morning Shift', value: 1 },
        { label: 'Afternoon Shift', value: 2 },
        { label: 'Night Shift', value: 3 },
      ],
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 0,
        },
      },
      dialogParams: {
        fromDate: '',
        shift: 0,
      },
      inputParams: {
        displayAllUser: false,
        selectAllUser: false,
        searchUser: '',
        users: [],
        date: null,
        shift: { label: 'All Shift', value: 0 },
        indexSummaryOnly: false,
      },
    });

    const getFormattedDate = (date) => {
      const year = date.getFullYear();
      const month = (1 + date.getMonth()).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return year + '-' + month + '-' + day;
    };

    onMounted(async () => {
      const getPrepared = await $api.frontOfficeCashier.paymentJournalUserList();
      const inputParam: any = state.inputParams;
      const dialogParam: any = state.dialogParams;
      inputParam.date = new Date(getPrepared.fromDate);
      dialogParam.fromDate = getPrepared.fromDate;
      state.table.isFetching = false;
    });

    watch(
      () => state.inputParams.displayAllUser,
      async (status) => {
        const getPrepared = await $api.frontOfficeCashier.paymentJournalUserList();
        await getPrepared.blineList['bline-list'].map((e, i) => {
          getPrepared.blineList['bline-list'][
            i
          ].label = `${getPrepared.blineList['bline-list'][i]['userinit']} ${getPrepared.blineList['bline-list'][i]['name']}`;

          getPrepared.blineList['bline-list'][i].value =
            getPrepared.blineList['bline-list'][i]['userinit'];
        });

        if (!status) {
          const getUsers = await getPrepared.blineList['bline-list'].filter(
            (e) => e.flag === 1
          );
          state.users = getUsers;
          state.usersMaster = getUsers;
        } else {
          state.users = getPrepared.blineList['bline-list'];
          state.usersMaster = getPrepared.blineList['bline-list'];
        }
      }
    );

    watch(
      () => state.inputParams.selectAllUser,
      async (status) => {
        if (status) {
          const inputParam: any = state.inputParams;
          const selectedUsers: any = [];
          state.users.map((e: any) => {
            selectedUsers.push(e.value);
          });
          inputParam.users = selectedUsers;
          inputParam.usersMaster = selectedUsers;
        } else {
          state.inputParams.users = [];
        }
      }
    );

    watch(
      () => state.inputParams.searchUser,
      async (status) => {
        if (status.length === 0) {
          state.users = state.usersMaster;
        } else {
          const res = state.users.filter((e: any) =>
            e.name.toLowerCase().includes(status.toLowerCase())
          );
          state.users = res;
        }
      }
    );

    const onDeleteKeyword = (keyword) => {
      const res = state.usersMaster.filter((e: any) =>
        e.name.toLowerCase().includes(keyword.toLowerCase())
      );
      state.users = res;
    };

    const onSearch = async () => {
      state.table.isFetching = true;

      const inputParam: any = state.inputParams;
      const getUsers = state.usersMaster.filter((e: any) => {
        return inputParam.users.indexOf(e.userinit) !== -1;
      });

      getUsers.map((e: any) => (e.selected = true));

      const resBody = {
        pvILanguage: 0,
        caseType: 2,
        currShift: inputParam.shift.value,
        summaryFlag: inputParam.indexSummaryOnly,
        fromDate: getFormattedDate(inputParam.date),
        blineList: {
          'bline-list': getUsers,
        },
      };

      const res = await $api.frontOfficeCashier.paymentJournalUserList(resBody);
      res.foCashjourList['fo-cashjour-list'].map((e, i) => {
        e.indexFoc = i;

        switch (true) {
          case e.bezeich.trim() === '' && e.dept.trim() === '':
            e.rechnr = '';
            e.artnr = '';
            e['f-amount'] = '';
            e['l-amount'] = '';
          case e.bezeich.trim() === 'Sub Total' ||
            e.dept.trim() === 'Sub Total' ||
            e.bezeich.trim() === 'Grand TOTAL' ||
            e.bezeich.trim() === 'SUMMARY OF CASH PAYMENT:' ||
            e.bezeich.trim() === 'TOTAL' ||
            e.bezeich.trim() === 'SUMMARY OF PAYMENT:' ||
            e.bezeich.includes('User:'):
            e.rechnr = '';
            e.artnr = '';
            e['f-amount'] = e['f-amount'] === 0 ? '' : e['f-amount'];
            e['l-amount'] = e['l-amount'] === 0 ? '' : e['l-amount'];
          case e.bezeich.trim() === 'Visa' ||
            e.bezeich.trim() === 'Master' ||
            e.bezeich.trim() === 'Maestro' ||
            e.bezeich.trim() === 'JCB' ||
            e.bezeich.trim() === 'BCA Card' ||
            e.bezeich.trim() === 'American Express' ||
            e.bezeich.trim() === 'Debit BCA' ||
            e.bezeich.trim() === 'OVO' ||
            e.bezeich.trim() === 'Company Ledger' ||
            e.bezeich.trim() === 'Travel Agent Ledger' ||
            e.bezeich.trim() === 'Ledger Testing' ||
            e.bezeich.trim() === 'Cash Settlement' ||
            e.bezeich.trim() === 'Cash Deposit' ||
            e.bezeich.trim() === 'Cash Deposit Refund' ||
            e.bezeich.trim() === 'Cash USD' ||
            e.bezeich.trim() === 'Money Exchange SGD' ||
            e.bezeich.trim() === 'Money Exchange AUD':
            e.rechnr = '';
            e.artnr = '';
            e['f-amount'] = '';
        }
      });

      state.table.data = res.foCashjourList['fo-cashjour-list'];
      state.table.isFetching = false;
    };

    const onDialogReportPaymentJournalByUserClosedShiftConfirm = (
      dialogBody
    ) => {
      state.dialogReportPaymentJournalByUserClosedShiftConfirm =
        dialogBody.dialog;
    };

    const onDialogReportPaymentJournalByUserClosedShift = async (
      dialogBody
    ) => {
      state.dialogReportPaymentJournalByUserClosedShift = dialogBody.dialog;

      const checkPermissionBody = {
        userInit: '52',
        arrayNr: 8,
        expectedNr: 2,
      };
      const checkPermission = await $api.frontOfficeCashier.checkPermission(
        checkPermissionBody
      );

      if (
        dialogBody.shift !== null &&
        dialogBody.shift !== undefined &&
        checkPermission.zugriff === 'true'
      ) {
        state.dialogParams.shift = dialogBody.shift.value;
        const confirmBody = {
          dialog: true,
        };
        onDialogReportPaymentJournalByUserClosedShiftConfirm(confirmBody);
      }
    };

    const onCloseShift = () => {
      const dialogBody = {
        dialog: true,
      };
      onDialogReportPaymentJournalByUserClosedShift(dialogBody);
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.displayAllUser = false;
      inputParam.selectAllUser = false;
      inputParam.date = null;
      inputParam.shift = null;
      inputParam.indexSummaryOnly = false;
      state.table.data = [];
    };

    return {
      ResTableHeaders,
      onSearch,
      onResets,
      onDeleteKeyword,
      onCloseShift,
      onDialogReportPaymentJournalByUserClosedShift,
      onDialogReportPaymentJournalByUserClosedShiftConfirm,
      ...toRefs(state),
    };
  },
  components: {
    'v-date-picker': DatePicker,
    DialogReportPaymentJournalByUserClosedShift: () =>
      import(
        './components/Dialog/Report/DialogReportPaymentJournalByUserClosedShift.vue'
      ),
    DialogReportPaymentJournalByUserClosedShiftConfirm: () =>
      import(
        './components/Dialog/Report/DialogReportPaymentJournalByUserClosedShiftConfirm.vue'
      ),
  },
});
</script>

<style lang="scss">
#checkboxReportPayment .q-checkbox {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  width: 100%;
}
.r-payment-cb-group {
  border: 1px solid rgba(0, 0, 0, 0.12);
  height: 200px;
  border-radius: 4px;
}
</style>
