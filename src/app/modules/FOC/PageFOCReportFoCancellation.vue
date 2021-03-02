<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
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

        <div>
          <q-checkbox
            v-model="inputParams.foreignFlag"
            label="In Foreign Amount"
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
import { ResTableHeaders } from './tables/Report/reportFoCancellation.table';
import { setupCalendar, DatePicker } from 'v-calendar';
import {PrintJs} from '~/app/helpers/PrintJs'

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      departments: [],
      articles: [],
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
        fromDept: {
          label: '0 Front Office',
          value: 0,
        },
        toDept: {
          label: '0 Front Office',
          value: 0,
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
        longDigit: false,
      },
    });

    const onPrint = () => {
      if (state.table.data.length !== 0) {
        PrintJs(state.table.data, ResTableHeaders, 'Fo Cancellation')
      }
    }

    onMounted(async () => {
      state.table.isFetching = false;

      const getPrepared = await $api.frontOfficeCashier.cancelJournPrepare();
      const fdate = new Date(getPrepared.fdate);
      const yesterday = new Date(fdate.getTime() - 24 * 60 * 60 * 1000);

      const setDateBody = {
        start: yesterday,
        end: yesterday,
      };
      const inputParam: any = state.inputParams;
      inputParam.date = setDateBody;
      inputParam.longDigit = getPrepared.longDigit;

      const getDepartments = await $api.frontOfficeCashier.loadHotelDepartment();
      state.departments = getDepartments.map((e) => {
        return {
          label: `${e.num} ${e.depart}`,
          value: e.num,
        };
      });

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

        return `${year}-${month}-${day}`;
      }

      const inputParam: any = state.inputParams;
      const resBody = {
        fromArt: inputParam.fromArt.value ? inputParam.fromArt.value : 1,
        toArt: inputParam.toArt.value ? inputParam.toArt.value : 1,
        fromDate: getFormattedDate(inputParam.date.start),
        toDate: getFormattedDate(inputParam.date.end),
        fromDept: inputParam.fromDept.value ? inputParam.fromDept.value : 0,
        toDept: inputParam.toDept.value ? inputParam.toDept.value : 0,
        foreignFlag: inputParam.foreignFlag,
        longDigit: inputParam.longDigit === 'true',
      };

      const res = await $api.frontOfficeCashier.cancelJournList(resBody);

      res.map((e, i) => {
        e.indexFoc = i;

        if (e.rechnr === 0 && e.artnr === 0) {
          e.rechnr = '';
          e.artnr = '';
        }
      });

      state.table.data = res;
      state.table.isFetching = false;
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
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
      inputParam.longDigit = false;
      state.table.data = [];
    };

    return {
      ResTableHeaders,
      onSearch,
      onResets,
      onPrint,
      ...toRefs(state),
    };
  },
  components: {
    'v-date-picker': DatePicker,
  },
});
</script>
