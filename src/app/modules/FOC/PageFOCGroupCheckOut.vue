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

        <q-separator class="q-mb-md" />

        <SInput label-text="Room Number" v-model="inputParams.roomNumber" />

        <SRemarkLeftDrawer
          label="Bill Receiver"
          :value="
            inputParams.resName.trim().length > 0 ? inputParams.resName : 'None'
          "
        />
        <SRemarkLeftDrawer
          label="Reservation Comment"
          :value="
            inputParams.resComment.trim().length > 0
              ? inputParams.resComment
              : 'None'
          "
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

      <div class="row">
        <div class="col-4">
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

        <div class="col-8 q-pl-sm">
          <STable
            :loading="table.isFetching"
            :columns="tableHeadersRight"
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
import { tableHeaders } from './tables/groupCheckOutLeft.table';
import { tableHeadersRight } from './tables/groupCheckOutRight.table';
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
        date: {
          start: null,
          end: null,
        },
        roomNumber: '',
        resName: '',
        resComment: '',
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
      (inputParam.date = {
        start: null,
        end: null,
      }),
        (inputParam.roomNumber = '');
      inputParam.resName = '';
      inputParam.resComment = '';
      state.table.data = [];
    };

    return {
      tableHeaders,
      tableHeadersRight,
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
