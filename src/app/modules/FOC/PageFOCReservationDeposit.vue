<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <div class="q-pa-md">
        <SInput label-text="Name" v-model="inputParams.name" />
        <SInput
          label-text="Reservation Number"
          v-model="inputParams.resNumber"
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
        <q-separator class="q-mb-md" />
        <SInput label-text="Total" v-model="inputParams.total" />
        <SInput
          label-text="Total Deposit Paid"
          v-model="inputParams.totalPaid"
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
          <template #header-cell-artnr="props">
            <q-th :props="props" class="fixed-col left">
              {{ props.col.label }}
            </q-th>
          </template>

          <template #header-cell-actions="props">
            <q-th :props="props" class="fixed-col right">
              {{ props.col.label }}
            </q-th>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="fixed-col right">
              <q-icon name="mdi-dots-vertical" size="16px">
                <q-menu auto-close anchor="bottom right" self="top right">
                  <q-list>
                    <q-item clickable v-ripple>
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-td>
          </template>
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
import { tableHeaders } from './tables/reservationNumber.table';
import { setupCalendar, DatePicker } from 'v-calendar';

setupCalendar({
  firstDayOfWeek: 2,
});

export default defineComponent({
  setup() {
    const state = reactive({
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
      inputParams: {
        name: '',
        resNumber: '',
        date: {
          start: null,
          end: null,
        },
        total: '',
        totalPaid: '',
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
    });

    const onSearch = () => {
      console.log(state.inputParams);
    };

    const onResets = () => {
      const inputParam: any = state.inputParams;
      inputParam.name = '';
      inputParam.resNumber = '';
      (inputParam.date = {
        start: null,
        end: null,
      }),
        (inputParam.total = '');
      inputParam.totalPaid = '';
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
