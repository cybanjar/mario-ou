<template>
  <div id="app">
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <SearchMasterplan :searches="searches" @onSearch="onSearch" />
    </q-drawer>

    <div class="q-pa-lg">
      <div class="q-mb-md">
        <q-btn flat round class="q-mr-lg" @click="addData">
          <img :src="require('~/app/icons/Icon-Add.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Refresh.svg')" height="30" />
        </q-btn>
        <q-btn flat round @click="doPrint" class="q-mr-lg">
          <img :src="require('~/app/icons/Icon-Print.svg')" height="30" />
        </q-btn>
        <!-- <q-btn flat round class="q-mr-lg">
          <img :src="require('~/app/icons/SC/Icon-Checkin.svg')" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <img
            :src="require('~/app/icons/SC/Icon-SalesActivity.svg')"
            height="30"
          />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <q-icon name="mdi-calendar" height="30" />
        </q-btn>
        <q-btn flat round class="q-mr-lg">
          <q-icon name="mdi-note" height="30" />
        </q-btn> -->
      </div>
      <DialogMasterPlan :dialog="dialog" />
      <DialogPlanNotes :plan="plan" />
      <DialogAmendment :amendment="amendment" />
      <DialogEvent :event="event" />
      <q-dialog v-model="modal.show" persistent>
        <q-card style="min-width: 350px">
          <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">
              Master Plan BQ0000015
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <SInput label-text="Reason" v-model="input" />
            <SInput label-text="Comments" v-model="input" />
            <SInputMoney
              label-text="Cancel Penalty"
              v-model.number="duit"
              hide-bottom-space
            ></SInputMoney>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Ok" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
                    <q-item clickable v-ripple @click="onCheckin(props.row)">
                      <q-item-section>Checkin</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>Activity</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="onEvent">
                      <q-item-section>Event</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="onPlan(props.row)">
                      <q-item-section>Plan Note</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="onClickAmendment">
                      <q-item-section>Amendment</q-item-section>
                    </q-item>
                    <q-item
                      @click="onClickCancel(props.row)"
                      clickable
                      v-ripple
                    >
                      <q-item-section>Cancel</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </STable>
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">
              Question
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section class="q-pt-none">
            <div style="margin: 20px">
              Do You Really Want To Checkin This Transaction?
            </div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="No" v-close-popup />
            <q-btn flat label="Yes" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
} from '@vue/composition-api';
import { tableHeaders } from './tables/Masterplan.table';
import { PrintJs } from '~/app/helpers/PrintJs';
import moment from 'moment';

export default defineComponent({
  setup(_, { root: { $api } }) {
    let charts;

    const state = reactive({
      isFetching: true,
      data: [],
      event: {
        show: false,
      },
      dialog: {
        show: false,
        status: [
          { value: 'INQ', label: 'Inquiry Coorporate' },
          { value: 'PRO', label: 'Prospek' },
          { value: 'DEF', label: 'Definite' },
          { value: 'IN1', label: 'Inquiry Individual' },
          { value: 'GUA', label: 'Guaranteed' },
          { value: 'CLS', label: 'Closed' },
          { value: 'CNL', label: 'Cancel' },
          { value: 'ONE', label: 'On Going Event' },
        ],
        sources: [
          { value: 'WEB', label: 'Website' },
          { value: 'WIG', label: 'Walk In Guest' },
          { value: 'OTA', label: 'Online Travel' },
        ],
        market: [
          { value: 'GCO', label: 'Group Coorporate' },
          { value: 'GTA', label: 'Group Travel Agent' },
        ],
        type: [
          { value: 'ALOT', label: 'Allotment' },
          { value: 'MEED', label: 'Meeting Only' },
          { value: 'WED', label: 'Wedding Without Room' },
        ],
        sales: [
          { value: '12', label: 'NANA' },
          { value: '64', label: 'olive' },
          { value: '09', label: 'RONAL' },
          { value: '65', label: 'SSM' },
          { value: '66', label: 'Taufan' },
        ],
        rtype: [
          { value: 'GCC', label: 'Guaranteed CC' },
          { value: 'GOV', label: 'Goverment Guaranteed' },
        ],
        rcode: [
          { value: 'BQR1', label: 'DLTS' },
          { value: 'BQR2', label: 'DLKN' },
        ],
        cateringStatus: [{ value: 'TST', label: 'TEST' }],
      },
      amendment: {
        active: false,
      },
      plan: {
        active: false,
        cards: [
          {
            number: 1,
            title: 'Kitchen & Pastry',
            value: '',
          },
          {
            number: 2,
            title: 'Food & Beverage',
            value: '',
          },
          {
            number: 3,
            title: 'Billing',
            value: '',
          },
          {
            number: 4,
            title: 'Front Office',
            value: '',
          },
          {
            number: 5,
            title: 'Housekeeping',
            value: '',
          },
          {
            number: 6,
            title: 'JUST SPACE',
            value: '',
          },
          {
            number: 7,
            title: 'IT & Engineering',
            value: '',
          },
          {
            number: 8,
            title: 'Security',
            value: '',
          },
          {
            number: 9,
            title: 'Number of Banquet',
            value: '',
          },
          {
            number: 10,
            title: 'Internal Breakdown',
            value: '',
          },
          {
            number: 11,
            title: 'Equipment',
            value: '',
          },
          {
            number: 12,
            title: 'Remark',
            value: '',
          },
          {
            number: 13,
            title: 'Space',
            value: '',
          },
          {
            number: 14,
            title: 'BEO LABEL 14',
            value: '',
          },
          {
            number: 15,
            title: 'BEO LABEL 15',
            value: '',
          },
          {
            number: 16,
            title: 'BEO LABEL 16',
            value: '',
          },
          {
            number: 17,
            title: 'BEO LABEL 17',
            value: '',
          },
          {
            number: 18,
            title: 'BEO LABEL 18',
            value: '',
          },
        ],
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
      prompt: false,
    });

    onMounted(() => {
      state.data = [
        {
          datum: '5',
          deptname: 'BQ0000005',
          rechnr: 'Airn20180527/01',
          pax: '27/05/2018',
          'f-betrag': 'Airnav Indonesia',
          'f-cost': 'RONAL',
          'b-betrag': '2',
          'b-cost': 'DEF',
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

    const onCheckin = (x) => {
      state.prompt = true;
    };

    const onPlan = (x) => {
      state.plan.active = true;
    };

    const onEvent = () => {
      state.event.show = true;
    };

    const onClickCancel = (x) => {
      state.modal.show = true;
    };

    const onClickAmendment = () => {
      state.amendment.active = true;
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
      onCheckin,
      onPlan,
      onClickEdit,
      onClickCancel,
      onEvent,
      onClickAmendment,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {
    SearchMasterplan: () => import('./components/SearchMasterplan.vue'),
    DialogMasterPlan: () => import('./components/DialogMasterPlan.vue'),
    DialogPlanNotes: () => import('./components/DialogPlanNotes.vue'),
    DialogAmendment: () => import('./components/DialogAmendment.vue'),
    DialogEvent: () => import('./components/DialogEvent.vue'),
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
