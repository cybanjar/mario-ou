<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <p class="q-mb-xs">Dispaly</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="displayOptions"
          v-model="inputParams.sortType"
          :dense="true"
        />

        <p class="q-mb-xs">Created ID</p>
        <SSelect
          outlined
          class="q-mb-md"
          :options="users"
          v-model="inputParams.user"
          :dense="true"
        />

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

        <p class="q-mb-xs">From Department</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.fromDept"
          :options="departments"
          :dense="true"
        />

        <p class="q-mb-xs">To Department</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.toDept"
          :options="departments"
          :dense="true"
        />

        <p class="q-mb-xs">From Article</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.fromArt"
          :options="articles"
          :dense="true"
        />

        <p class="q-mb-xs">To Article</p>
        <SSelect
          outlined
          class="q-mb-md"
          v-model="inputParams.toArt"
          :options="articles"
          :dense="true"
        />

        <div>
          <q-checkbox
            v-model="inputParams.foreignFlag"
            label="In Foreign Amount"
          />
          <q-checkbox
            v-model="inputParams.printIncludeGuestName"
            label="Print Include Guest Name"
          />
        </div>

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mb-md full-width"
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
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>

      <div>
        <STable
          :loading="table.isFetching"
          :columns="tableHeaders"
          :data="table.data"
          :rows-per-page-options="[10, 13, 16]"
          :pagination.sync="table.pagination"
          row-key="indexFoc"
        >
        </STable>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@vue/composition-api';
import { tableHeaders } from './tables/reportBookingJournalByUser.table';
import { setupCalendar, DatePicker } from 'v-calendar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      departments: [],
      articles: [],
      users: [],
      displayOptions: [
        { label: 'Exclude Transfer', value: 0 },
        { label: 'Include Transfer', value: 1 },
        { label: 'Transfer Only', value: 2 },
      ],
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParams: {
        sortType: {
          label: 'Include Transfer',
          value: 1,
        },
        user: null,
        date: {
          start: null,
          end: null,
        },
        fromDept: {
          label: '0 Front Office',
          value: 0,
        },
        toDept: {
          value: null,
          label: null,
        },
        fromArt: {
          label: '1 Visa',
          value: 1,
        },
        toArt: {
          value: null,
          label: null,
        },
        foreignFlag: false,
        printIncludeGuestName: true,
        longDigit: false,
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;

      const getPrepared = await $api.frontOfficeCashier.bookJournUserPrepare();
      const setDateBody = {
        start: new Date(getPrepared.fromDate),
        end: new Date(getPrepared.fromDate),
      };
      const setDate: any = state.inputParams;
      setDate.date = setDateBody;

      const getUsers = await $api.frontOfficeCashier.selectSystemUser();
      state.users = getUsers.map((e) => {
        return {
          label: `${e.userinit} ${e.username}`,
          value: e.userinit,
        };
      });

      const setUser: any = state.inputParams;
      setUser.user = {
        value: getUsers[0].userinit,
        label: `${getUsers[0]['userinit']} ${getUsers[0]['username']}`,
      };

      const getDepartments = await $api.frontOfficeCashier.loadHotelDepartment();
      state.departments = getDepartments.map((e) => {
        return {
          label: `${e.num} ${e.depart}`,
          value: e.num,
        };
      });

      const setToDept: any = state.inputParams;
      setToDept.toDept = {
        value: getDepartments.slice(-1)[0].num,
        label: `${getDepartments.slice(-1)[0]['num']} ${
          getDepartments.slice(-1)[0]['depart']
        }`,
      };

      const getArticles = await $api.frontOfficeCashier.loadArtikel();
      state.articles = getArticles.map((e) => {
        return {
          label: `${e.artnr} ${e.bezeich}`,
          value: e.artnr,
        };
      });

      const setToArt: any = state.inputParams;
      setToArt.toArt = {
        value: getArticles.slice(-1)[0].artnr,
        label: `${getArticles.slice(-1)[0]['artnr']} ${
          getArticles.slice(-1)[0]['bezeich']
        }`,
      };
    });

    const onSearch = async () => {
      state.table.isFetching = true;

      function getFormattedDate(date) {
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return day + '/' + month + '/' + year;
      }

      const inputParam: any = state.inputParams;
      const resBody = {
        exclTrans: inputParam.sortType.value === 0 ? true : false,
        inclTrans: inputParam.sortType.value === 1 ? true : false,
        transOnly: inputParam.sortType.value === 2 ? true : false,
        usrInit: inputParam.user.value,
        fromDate: getFormattedDate(inputParam.date.start),
        toDate: getFormattedDate(inputParam.date.end),
        fromDept: inputParam.fromDept.value ? inputParam.fromDept.value : 0,
        toDept: inputParam.toDept.value ? inputParam.toDept.value : 0,
        fromArt: inputParam.fromArt.value ? inputParam.fromArt.value : 1,
        toArt: inputParam.toArt.value ? inputParam.toArt.value : 1,
        foreignFlag: inputParam.foreignFlag,
        printIncludeGuestName: inputParam.printIncludeGuestName,
        longDigit: false,
      };

      const res = await $api.frontOfficeCashier.bookJournUserList(resBody);
      res.map((e, i) => {
        e.indexFoc = i;
      });

      state.table.data = res;
      state.table.isFetching = false;
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.sortType = {
        label: null,
        value: null,
      };
      inputParam.user = null;
      inputParam.date = {
        start: null,
        end: null,
      };
      inputParam.fromDept = {
        label: null,
        value: null,
      };
      inputParam.toDept = {
        value: null,
        label: null,
      };
      inputParam.fromArt = {
        label: null,
        value: null,
      };
      inputParam.toArt = {
        value: null,
        label: null,
      };
      inputParam.foreignFlag = false;
      inputParam.printIncludeGuestName = false;
      inputParam.longDigit = false;
      state.table.data = [];
    };

    return {
      tableHeaders,
      onSearch,
      onResets,
      ...toRefs(state),
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>
