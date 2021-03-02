<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchSalesActivity :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="addData">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="doPrint">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
      </div>
      <STable
        dense
        :columns="tableHeaders"
        :data="data"
        :rows-per-page-options="[0]"
        :hide-bottom="false"
        class="table-accounting-date"
        flat
        bordered
      >
        <template #header="props">
          <q-tr style="height: 40px" :props="props">
            <q-th
              :props="props"
              v-for="col in props.cols"
              :key="col.name"
              :style="col.style"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr
            :props="props"
            @click="onRowClick(props.row)"
            :class="{
              selected: props.row.selected,
            }"
          >
            <q-td
              :key="col.name"
              :props="props"
              v-for="col in props.cols.filter(
                (x) => !['actions'].includes(x.name)
              )"
            >
              {{ col.value }}
            </q-td>
            <q-td :props="props" key="actions">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu
                  :props="props"
                  auto-close
                  anchor="bottom right"
                  self="top right"
                >
                  <q-list :props="props">
                    <q-item
                      :props="props"
                      @click="onClickEdit"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item
                      :props="props"
                      @click="onClickCloseActivity(props.row)"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Close Activity</q-item-section>
                    </q-item>
                    <q-item
                      @click="deleteDataRow(props.row)"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
    </div>
    <DialogSalesActivity :dialog="dialog" />
    <DialogCloseActivity :closedialog="closedialog" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { mapWithMeal } from '~/app/helpers/mapSelectItems.helpers';
import { date } from 'quasar';
import { tableHeaders } from './tables/SalesActivity.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import moment from 'moment';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      dialog: {
        show: false,
      },
      closedialog: {
        show: false,
        rowdata: [],
      },
      modal: {
        show: false,
      },
      searches: {
        departments: [
          { label: 'Reservation Number', value: 'number' },
          { label: 'Block ID', value: 'id' },
          { label: 'Block Code', value: 'code' },
          { label: 'Date', value: 'date' },
          { label: 'Name', value: 'name' },
          { label: 'Sales', value: 'sales' },
          { label: 'Status', value: 'status' },
          { label: 'Type', value: 'type' },
        ],
      },
    });

    onMounted(() => {
      state.data = [
        {
          datum: 'Call',
          deptname: '08/07/2019',
          rechnr: '16.25',
          pax: '16.25',
          'f-betrag': 'Low',
          'f-cost': 'Balkis,Mrs',
          'b-betrag': 'Adira,PT',
          'b-cost': 'Test',
        },
      ];
    });

    function doPrint() {
      if (state.data.length !== 0) {
        PrintJs(state.data, tableHeaders, 'Meal Coupon');
      }
    }

    const onSearch = (state2) => {
      console.log('halo');
    };

    const addData = () => {
      state.dialog.show = true;
    };

    const onClickEdit = () => {
      state.dialog.show = true;
    };

    const onClickCloseActivity = (x) => {
      state.closedialog.show = true;
      state.closedialog.rowdata = x;
    };

    function my_date(mydate) {
      const dDate = String(moment(mydate, 'DD/MM/YYYY').date()).padStart(
        2,
        '0'
      );
      const dMonth = String(moment(mydate, 'DD/MM/YYYY').month() + 1).padStart(
        2,
        '0'
      );
      const dYear = String(moment(mydate, 'DD/MM/YYYY').year());
      return moment(`${dYear}-${dMonth}-${dDate}`, 'YYYY-MM-DD');
    }

    return {
      ...toRefs(state),
      tableHeaders,
      onSearch,
      doPrint,
      addData,
      onClickCloseActivity,
      onClickEdit,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchSalesActivity: () => import('./components/SearchSalesActivity.vue'),
    DialogSalesActivity: () => import('./components/DialogSalesActivity.vue'),
    DialogCloseActivity: () => import('./components/DialogCloseActivity.vue'),
  },
});
</script>

<style lang="scss" scoped>
h1 {
  background: $primary-grad;
}
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 75vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
tr.selected td {
  background-color: #2d00e2 !important;
  color: #fff;
}
</style>
